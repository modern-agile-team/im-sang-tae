/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 09 2023
 **/

import type {
  AtomFamilyType,
  AtomMapType,
  AtomOrSelectorFamilyType,
  AtomOrSelectorType,
  AtomType,
  AtomWithStateType,
  SelectorFamilyType,
  SelectorMapType,
  SelectorType,
  SelectorWithStateType,
  Store,
} from "../types";

// Returns true if the atom is a selector
const isSelector = <Value, T>(
  atom: AtomOrSelectorType<Value> | AtomOrSelectorFamilyType<Value, T>
): atom is SelectorType<Value> | SelectorFamilyType<Value, T> => "get" in atom;

const getParsedStorageItem = (storage: "localStorage" | "sessionStorage", key: string) => {
  const item = window[storage].getItem(key);
  if (!item) return null;
  return JSON.parse(item);
};

const setItemToStorage = <V>(key: string, item: V, storage: "localStorage" | "sessionStorage") => {
  window[storage].setItem(key, JSON.stringify(item));
};

export function createStore(): Store {
  const atomMap: AtomMapType = new Map();
  const selectorMap: SelectorMapType = new Map();

  const selectorDependencies: Map<string, Set<string>> = new Map();

  function createAtomWithPersistence<Value>(
    atom: AtomOrSelectorType<Value> | AtomOrSelectorFamilyType<Value>,
    newAtom: AtomOrSelectorType<Value>
  ) {
    if (!atom.options?.persistence) return;

    const atomInStorage = getParsedStorageItem(atom.options.persistence, atom.key);
    if (atomInStorage) {
      if (isSelector(atom)) {
        if (!isSelector(newAtom)) return;
        selectorMap.set(atom.key, { ...newAtom, state: atomInStorage });
      } else {
        if (isSelector(newAtom)) return;
        atomMap.set(atom.key, { ...newAtom, state: atomInStorage });
      }
      return;
    }
    if (isSelector(atom)) {
      if (!isSelector(newAtom)) return;
      const state = newAtom.get({ get: getter<Value>(newAtom) });
      setItemToStorage(atom.key, state, atom.options.persistence);
    } else {
      if (isSelector(newAtom)) return;
      setItemToStorage(atom.key, newAtom.initialState, atom.options.persistence);
    }
  }

  /**
   * Generates a getter function to fetch the atom's value for the given selector
   * and tracks the dependencies between the selector and atom.
   */
  function getter<Value>(atom: SelectorType | SelectorFamilyType<Value>) {
    return <Value>(getterState: AtomOrSelectorType<Value>) => {
      // Track selector dependencies
      const dependency = selectorDependencies.get(getterState.key) || new Set();
      dependency.add(atom.key);
      selectorDependencies.set(getterState.key, dependency);

      return readAtomValue(getterState);
    };
  }

  /**
   * Creates a new atom, adds it to the atomMap and handles persistence if needed.
   */
  function createNewAtom<Value>(atom: AtomType<Value>) {
    const newAtom: AtomType<Value> = {
      key: atom.key,
      initialState: atom.initialState,
      options: atom.options,
    };
    atomMap.set(atom.key, { ...newAtom, state: atom.initialState });
    if (atom.options?.persistence) {
      createAtomWithPersistence(atom, newAtom);
    }
    return newAtom;
  }

  /**
   * Creates a new selector, adds it to the selectorMap and handles persistence if needed.
   */
  function createNewSelector<Value>(atom: SelectorType<Value>) {
    const newSelector: SelectorType<Value> = {
      key: atom.key,
      get: atom.get,
      options: atom.options,
    };
    const state = atom.get({ get: getter<Value>(atom) });
    selectorMap.set(atom.key, { ...newSelector, state });
    if (atom.options?.persistence) {
      createAtomWithPersistence(atom, newSelector);
    }
    return newSelector;
  }

  /**
   * Creates a new atomFamily - a factory function that creates different atoms for each parameter.
   */
  function createNewAtomFamily<Value, T>(atom: AtomFamilyType<Value, T>) {
    const newAtom: (param: T) => AtomType<Value> = (param: T) => {
      return {
        key: atom.key,
        initialState: atom.initialState(param),
        options: atom.options,
      };
    };

    return (param: T) => {
      atomMap.set(atom.key, { ...newAtom(param), state: atom.initialState(param) });
      if (atom.options?.persistence) {
        createAtomWithPersistence(atom, newAtom(param));
      }
      return newAtom(param);
    };
  }

  /**
   * Creates a new selectorFamily - a factory function that creates different selectors for each parameter.
   */
  function createNewSelectorFamily<Value, T>(atom: SelectorFamilyType<Value, T>) {
    const newSelector: (param: T) => SelectorType<Value> = (param: T) => {
      return {
        key: atom.key,
        get: atom.get(param),
        options: atom.options,
      };
    };
    return (param: T) => {
      selectorMap.set(atom.key, { ...newSelector(param), state: atom.get(param)({ get: getter<Value>(atom) }) });
      if (atom.options?.persistence) {
        createAtomWithPersistence(atom, newSelector(param));
      }
      return newSelector(param);
    };
  }

  /**
   * Updates the state of all selectors that depend on the atom whenever it changes.
   */
  function updateDependencies<Value>(atom: AtomOrSelectorType<Value>) {
    const dependencies = selectorDependencies.get(atom.key);
    if (dependencies) {
      dependencies.forEach((key) => {
        const dependent = selectorMap.get(key);
        if (dependent) {
          dependent.state = dependent.get({ get: readAtomValue });
        }
      });
    }
  }

  // ############### Functions below are main interface ############### //

  /**
   * Creates a new atom, throwing an error if an atom with the same key already exists.
   */
  function createAtom<Value>(atom: AtomType<Value>): AtomType<Value>;
  function createAtom<Value>(atom: SelectorType<Value>): SelectorType<Value>;
  function createAtom<Value>(atom: AtomOrSelectorType<Value>) {
    if (isSelector(atom)) {
      if (selectorMap.has(atom.key)) throw Error(`selector that has ${atom.key} key already exist`);
      return createNewSelector(atom);
    }

    if (atomMap.has(atom.key)) throw Error(`atom that has ${atom.key} key already exist`);
    return createNewAtom(atom);
  }

  /**
   * Creates a new atom family, throwing an error if an atom family with the same key already exists.
   */
  function createAtomFamily<Value, T>(atomFamily: AtomFamilyType<Value, T>): (param: T) => AtomType<Value>;
  function createAtomFamily<Value, T>(atomFamily: SelectorFamilyType<Value, T>): (param: T) => SelectorType<Value>;
  function createAtomFamily<Value, T>(atomFamily: AtomOrSelectorFamilyType<Value, T>) {
    if (isSelector(atomFamily)) {
      if (selectorMap.has(atomFamily.key)) throw Error(`selector that has ${atomFamily.key} key already exist`);
      return createNewSelectorFamily(atomFamily);
    }

    if (atomMap.has(atomFamily.key)) throw Error(`atom that has ${atomFamily.key} key already exist`);
    return createNewAtomFamily(atomFamily);
  }

  /**
   * Reads the current state of a given atom, throwing an error if the atom does not exist.
   */
  function readAtomState<Value>(atom: AtomType<Value>): AtomWithStateType<Value>;
  function readAtomState<Value>(atom: SelectorType<Value>): SelectorWithStateType<Value>;
  function readAtomState<Value>(atom: AtomOrSelectorType<Value>) {
    if (isSelector(atom)) {
      if (!selectorMap.has(atom.key)) throw Error(`selector that has ${atom.key} key does not exist`);
      return selectorMap.get(atom.key) as SelectorWithStateType<Value>;
    }

    if (!atomMap.has(atom.key)) throw Error(`atom that has ${atom.key} key does not exist`);
    return atomMap.get(atom.key) as AtomWithStateType<Value>;
  }

  /**
   * Returns the current value of a given atom.
   */
  function readAtomValue<Value>(atom: AtomOrSelectorType<Value> | AtomOrSelectorFamilyType<Value>) {
    if (isSelector(atom)) {
      return readAtomState(atom as SelectorType<Value>).state;
    }
    return readAtomState(atom as AtomType<Value>).state;
  }

  /**
   * Updates the state of a given atom to a new value and updates all dependencies.
   */
  function writeAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value) {
    if (isSelector(targetAtom)) {
      const currentAtom = readAtomState(targetAtom);
      selectorMap.set(targetAtom.key, { ...currentAtom, state: newState });
      if (targetAtom.options?.persistence) {
        window[targetAtom.options.persistence].setItem(targetAtom.key, JSON.stringify(newState));
      }
      updateDependencies(targetAtom);
      return readAtomState(targetAtom);
    }

    const currentAtom = readAtomState(targetAtom);
    atomMap.set(targetAtom.key, { ...currentAtom, state: newState });
    if (targetAtom.options?.persistence) {
      window[targetAtom.options.persistence].setItem(targetAtom.key, JSON.stringify(newState));
    }
    updateDependencies(targetAtom);
    return readAtomState(targetAtom);
  }

  return {
    createAtom,
    createAtomFamily,
    readAtomState,
    readAtomValue,
    writeAtomState,
  };
}

export const defaultStore = createStore();
export const { createAtom, createAtomFamily, readAtomState, readAtomValue, writeAtomState } = defaultStore;
