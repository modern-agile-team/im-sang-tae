/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 SoonKiMin
 */

type AtomMapType = Map<string, AtomType & { state: any }>;
type SelectorMapType = Map<string, SelectorType & { state: any }>;

export type AtomType<Value = unknown> = {
  key: string;
  initialState: Value;
};

export type SelectorType<Value = unknown> = {
  key: string;
  get: ({ get }: { get: <Value>(atom: AtomType<Value>) => Value }) => Value;
};

interface IStore {
  /** atom relative methods */
  createAtom<Value>(atom: AtomType<Value>): AtomType<Value>;
  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value>;
  readAtomValue<Value>(atom: AtomType<Value>): Value;
  setAtomState<Value>(targetAtom: AtomType<Value>, newState: Value): void;

  /** selector relative methods */
  createSelector<Value>(selector: SelectorType<Value>): SelectorType<Value>;
  readSelectorState<Value>(selector: SelectorType<Value>): SelectorType<Value>;
  readSelectorValue<Value>(selector: SelectorType<Value>): Value;
  setSelectorState<Value>(targetSelector: SelectorType<Value>, newState: Value): void;
}

export class Store implements IStore {
  private atomMap: AtomMapType = new Map();
  private selectorMap: SelectorMapType = new Map();

  createAtom<Value>(atom: AtomType<Value>): AtomType<Value> {
    if (this.atomMap.has(atom.key)) {
      throw Error(`atom that has ${atom.key} key already exist`);
    }
    const newAtom: AtomType<Value> = { key: atom.key, initialState: atom.initialState };
    this.atomMap.set(atom.key, { ...newAtom, state: atom.initialState });
    return newAtom;
  }

  createSelector<Value>(selector: SelectorType<Value>): SelectorType<Value> {
    if (this.selectorMap.has(selector.key)) {
      throw Error(`selector that has ${selector.key} key already exist`);
    }
    const newSelector: SelectorType<Value> = { key: selector.key, get: selector.get };

    const get = <Value>(atom: AtomType<Value>) => {
      return this.readAtomValue(atom);
    };

    this.selectorMap.set(selector.key, { ...newSelector, state: selector.get({ get }) });

    return newSelector;
  }

  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value> & { state: Value } {
    if (!this.atomMap.has(atom.key)) {
      throw Error(`atom that has ${atom.key} key does not exist`);
    }
    const atomState = this.atomMap.get(atom.key) as AtomType<Value> & { state: Value };

    return atomState;
  }

  readSelectorState<Value>(selector: SelectorType<Value>): SelectorType<Value> & { state: Value } {
    if (!this.selectorMap.has(selector.key)) {
      throw Error(`selector that has ${selector.key} key does not exist`);
    }
    const selectorState = this.selectorMap.get(selector.key) as SelectorType<Value> & { state: Value };

    return selectorState;
  }

  readAtomValue<Value>(atom: AtomType<Value>): Value {
    return this.readAtomState(atom).state as Value;
  }

  readSelectorValue<Value>(selector: SelectorType<Value>): Value {
    return this.readSelectorState(selector).state;
  }

  setAtomState<Value>(targetAtom: AtomType<Value>, newState: Value): void {
    const currentAtom = this.readAtomState(targetAtom);
    this.atomMap.set(targetAtom.key, { ...currentAtom, state: newState });
  }

  setSelectorState<Value>(targetSelector: SelectorType<Value>, newState: Value): void {
    const currentSelector = this.readSelectorState(targetSelector);
    this.selectorMap.set(targetSelector.key, { ...currentSelector, state: newState });
  }
}

export const defaultStore = new Store();
export const createStore = () => new Store();
