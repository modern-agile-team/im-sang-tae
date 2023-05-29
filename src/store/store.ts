/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 SoonKiMin
 */

import type {
  AtomOrSelectorType,
  AtomType,
  SelectorMapType,
  SelectorType,
  AtomMapType,
  AtomWithStateType,
  SelectorWithStateType,
} from "../types";

interface Store {
  /**
   * receive atom and store in the atomMap.
   * @param atom
   */
  createAtom<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  /**
   * receive atom and read itself.
   * @param atom
   */
  readAtomState<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  /**
   * receive atom and read it's value.
   * @param atom
   */
  readAtomValue<Value>(atom: AtomOrSelectorType<Value>): Value;
  /**
   * update targeted atom's state.
   * @param targetAtom
   * @param newState
   */
  writeAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): void;
}

export type { AtomOrSelectorType, AtomType, Store, SelectorType };

export function createStore(): Store {
  const atomMap: AtomMapType = new Map();
  const selectorMap: SelectorMapType = new Map();
  const selectorDependencies: Map<string, Set<string>> = new Map();

  function createNewAtom<Value>(atom: AtomType<Value>) {
    const newAtom: AtomType<Value> = {
      key: atom.key,
      initialState: atom.initialState,
    };
    atomMap.set(atom.key, { ...newAtom, state: atom.initialState });
    return newAtom;
  }

  function createNewSelector<Value>(atom: SelectorType<Value>) {
    const get = <Value>(getterState: AtomOrSelectorType<Value>) => {
      // Track selector dependencies
      const dependency = selectorDependencies.get(getterState.key) || new Set();
      dependency.add(atom.key);
      selectorDependencies.set(getterState.key, dependency);

      return readAtomValue(getterState);
    };
    const newSelector: SelectorType<Value> = { key: atom.key, get: atom.get };
    selectorMap.set(atom.key, { ...newSelector, state: atom.get({ get }) });
    return newSelector;
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
  function createAtom<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value> {
    if ("get" in atom) {
      if (selectorMap.has(atom.key)) throw Error(`selector that has ${atom.key} key already exist`);
      return createNewSelector(atom);
    } else {
      if (atomMap.has(atom.key)) throw Error(`atom that has ${atom.key} key already exist`);
      return createNewAtom(atom);
    }
  }

  function readAtomState<Value>(atom: AtomType<Value>): AtomWithStateType<Value>;
  function readAtomState<Value>(atom: SelectorType<Value>): SelectorWithStateType<Value>;
  function readAtomState<Value>(
    atom: AtomOrSelectorType<Value>
  ): AtomWithStateType<Value> | SelectorWithStateType<Value> {
    if ("get" in atom) {
      if (!selectorMap.has(atom.key)) {
        throw Error(`selector that has ${atom.key} key does not exist`);
      }
      const selectorState = selectorMap.get(atom.key) as SelectorWithStateType<Value>;

      return selectorState;
    } else {
      if (!atomMap.has(atom.key)) {
        throw Error(`atom that has ${atom.key} key does not exist`);
      }

      const atomState = atomMap.get(atom.key) as AtomWithStateType<Value>;

      return atomState;
    }
  }

  function readAtomValue<Value>(atom: AtomOrSelectorType<Value>): Value {
    if ("get" in atom) {
      return readAtomState(atom as SelectorType<Value>).state;
    } else {
      return readAtomState(atom as AtomType<Value>).state;
    }
  }

  function writeAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): void {
    if ("get" in targetAtom) {
      const currentAtom = readAtomState(targetAtom);
      selectorMap.set(targetAtom.key, { ...currentAtom, state: newState });
    } else {
      const currentAtom = readAtomState(targetAtom);
      atomMap.set(targetAtom.key, { ...currentAtom, state: newState });
    }
    updateDependencies(targetAtom);
  }

  return {
    createAtom,
    readAtomState,
    readAtomValue,
    writeAtomState,
  };
}

let defaultStore: Store | undefined;

export const getDefaultStore = () => {
  if (!defaultStore) {
    defaultStore = createStore();
  }
  return defaultStore;
};
