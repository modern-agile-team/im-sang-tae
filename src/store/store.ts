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

const isSelector = <Value, T>(
  atom: AtomOrSelectorType<Value> | AtomOrSelectorFamilyType<Value, T>
): atom is SelectorType<Value> | SelectorFamilyType<Value, T> => "get" in atom;

export function createStore(): Store {
  const atomMap: AtomMapType = new Map();
  const selectorMap: SelectorMapType = new Map();

  const selectorDependencies: Map<string, Set<string>> = new Map();

  function createAtomWithPersistence<Value>(
    atom: AtomOrSelectorType<Value> | AtomOrSelectorFamilyType<Value>,
    newAtom: AtomOrSelectorType<Value>
  ) {
    if (!atom.options?.persistence) return;

    const atomInStorage = window[atom.options.persistence].getItem(atom.key);
    if (atomInStorage) {
      if (isSelector(atom)) {
        if (!isSelector(newAtom)) return;
        selectorMap.set(atom.key, { ...newAtom, state: JSON.parse(atomInStorage) });
      } else {
        if (isSelector(newAtom)) return;
        atomMap.set(atom.key, { ...newAtom, state: JSON.parse(atomInStorage) });
      }
    } else {
      if (isSelector(atom)) {
        const state = atom.get({ get: getter<Value>(atom) });
        window[atom.options.persistence].setItem(atom.key, JSON.stringify(state));
      } else {
        window[atom.options.persistence].setItem(atom.key, JSON.stringify(atom.initialState));
      }
    }
  }

  function getter<Value>(atom: SelectorType | SelectorFamilyType<Value>) {
    return <Value>(getterState: AtomOrSelectorType<Value>) => {
      // Track selector dependencies
      const dependency = selectorDependencies.get(getterState.key) || new Set();
      dependency.add(atom.key);
      selectorDependencies.set(getterState.key, dependency);

      return readAtomValue(getterState);
    };
  }

  function createNewAtom<Value>(atom: AtomType<Value>) {
    const newAtom: AtomType<Value> = {
      key: atom.key,
      initialState: atom.initialState,
      options: atom.options,
    };
    atomMap.set(atom.key, { ...newAtom, state: atom.initialState });
    createAtomWithPersistence(atom, newAtom);
    return newAtom;
  }

  function createNewSelector<Value>(atom: SelectorType<Value>) {
    const newSelector: SelectorType<Value> = {
      key: atom.key,
      get: atom.get,
      options: atom.options,
    };
    const state = atom.get({ get: getter<Value>(atom) });
    selectorMap.set(atom.key, { ...newSelector, state });
    createAtomWithPersistence(atom, newSelector);
    return newSelector;
  }

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
      createAtomWithPersistence(atom, newAtom(param));
      return newAtom(param);
    };
  }

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
      createAtomWithPersistence(atom, newSelector(param));
      return newSelector(param);
    };
  }

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

  function readAtomValue<Value>(atom: AtomOrSelectorType<Value> | AtomOrSelectorFamilyType<Value>) {
    if (isSelector(atom)) {
      return readAtomState(atom as SelectorType<Value>).state;
    }
    return readAtomState(atom as AtomType<Value>).state;
  }

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
