/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 SoonKiMin
 */

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
}

export class Store implements IStore {
  private static instance: Store;
  private atomMap: Map<string, AtomType> = new Map();
  private selectorMap: Map<string, SelectorType> = new Map();

  constructor() {
    if (!Store.instance) {
      Store.instance = this;
    }
    return Store.instance;
  }

  createAtom<Value>(atom: AtomType<Value>): AtomType<Value> {
    if (this.atomMap.has(atom.key)) {
      throw Error(`atom that has ${atom.key} key already exist`);
    }
    const newAtom: AtomType<Value> = { key: atom.key, initialState: atom.initialState };
    this.atomMap.set(atom.key, newAtom);
    return newAtom;
  }

  createSelector<Value>(selector: SelectorType<Value>): SelectorType<Value> {
    if (this.selectorMap.has(selector.key)) {
      throw Error(`atom that has ${selector.key} key already exist`);
    }
    const newSelector: SelectorType<Value> = { key: selector.key, get: selector.get };

    this.selectorMap.set(selector.key, newSelector);

    return newSelector;
  }

  readSelectorState<Value>(selector: SelectorType<Value>): SelectorType<Value> {
    if (!this.selectorMap.has(selector.key)) {
      this.createSelector(selector);
    }
    const selectorState = this.selectorMap.get(selector.key) as SelectorType<Value>;

    return selectorState;
  }

  readSelectorValue<Value>(selector: SelectorType<Value>): Value {
    if (!this.selectorMap.has(selector.key)) {
      throw Error(`selector that has ${selector.key} key does not exist`);
    }

    const get = <Value>(atom: AtomType<Value>) => {
      return this.readAtomValue(atom);
    };

    const getSelectorValue = this.readSelectorState(selector)!.get as ({
      get,
    }: {
      get: <A>(atom: AtomType<A>) => A;
    }) => Value;

    const selectorValue = getSelectorValue({ get });

    return selectorValue;
  }

  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value> {
    if (!this.atomMap.has(atom.key)) {
      this.createAtom(atom);
    }
    const atomState = this.atomMap.get(atom.key) as AtomType<Value>;
    return atomState;
  }

  readAtomValue<Value>(atom: AtomType<Value>): Value {
    return this.readAtomState(atom).initialState as Value;
  }

  setAtomState<Value>(targetAtom: AtomType<Value>, newState: Value): void {
    const currentAtom = this.readAtomState(targetAtom);
    this.atomMap.set(targetAtom.key, { ...currentAtom, initialState: newState });
  }
}

export const defaultStore = new Store();
