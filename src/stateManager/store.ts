/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 SoonKiMin
 */

type AtomMapType = Map<string, AtomType & { state: any }>;
type SelectorMapType = Map<string, SelectorType & { state: any }>;

type AtomWithStateType<Value> = AtomType<Value> & { state: Value };
type SelectorWithStateType<Value> = SelectorType<Value> & { state: Value };

export type AtomOrSelectorType<Value = any> = AtomType<Value> | SelectorType<Value>;

export type AtomType<Value = any> = {
  key: string;
  initialState: Value;
};

export type SelectorType<Value = any> = {
  key: string;
  get: ({ get }: { get: <Value>(atom: AtomOrSelectorType<Value>) => Value }) => Value;
};

interface IStore {
  /** atom relative methods */
  createAtom<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  readAtomState<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  readAtomValue<Value>(atom: AtomOrSelectorType<Value>): Value;
  setAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): void;
}

export class Store implements IStore {
  private atomMap: AtomMapType = new Map();
  private selectorMap: SelectorMapType = new Map();
  private selectorDependencies: Map<string, Set<string>> = new Map();

  private createNewAtom<Value>(atom: AtomType<Value>) {
    const newAtom: AtomType<Value> = { key: atom.key, initialState: atom.initialState };
    this.atomMap.set(atom.key, { ...newAtom, state: atom.initialState });
    return newAtom;
  }

  private createNewSelector<Value>(atom: SelectorType<Value>) {
    const get = <Value>(getterState: AtomOrSelectorType<Value>) => {
      // Track selector dependencies
      const dependency = this.selectorDependencies.get(getterState.key) || new Set();
      dependency.add(atom.key);
      this.selectorDependencies.set(getterState.key, dependency);

      return this.readAtomValue(getterState);
    };
    const newSelector: SelectorType<Value> = { key: atom.key, get: atom.get };
    this.selectorMap.set(atom.key, { ...newSelector, state: atom.get({ get }) });
    return newSelector;
  }

  createAtom<Value>(atom: AtomType<Value>): AtomType<Value>;
  createAtom<Value>(atom: SelectorType<Value>): SelectorType<Value>;
  createAtom<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value> {
    if ("get" in atom) {
      if (this.selectorMap.has(atom.key)) throw Error(`selector that has ${atom.key} key already exist`);
      return this.createNewSelector(atom);
    } else {
      if (this.atomMap.has(atom.key)) throw Error(`atom that has ${atom.key} key already exist`);
      return this.createNewAtom(atom);
    }
  }

  readAtomState<Value>(atom: AtomType<Value>): AtomWithStateType<Value>;
  readAtomState<Value>(atom: SelectorType<Value>): SelectorWithStateType<Value>;
  readAtomState<Value>(atom: AtomOrSelectorType<Value>): AtomWithStateType<Value> | SelectorWithStateType<Value> {
    if ("get" in atom) {
      if (!this.selectorMap.has(atom.key)) {
        throw Error(`selector that has ${atom.key} key does not exist`);
      }
      const selectorState = this.selectorMap.get(atom.key) as SelectorWithStateType<Value>;

      return selectorState;
    } else {
      if (!this.atomMap.has(atom.key)) {
        throw Error(`atom that has ${atom.key} key does not exist`);
      }
      const atomState = this.atomMap.get(atom.key) as AtomWithStateType<Value>;

      return atomState;
    }
  }

  readAtomValue<Value>(atom: AtomOrSelectorType<Value>): Value {
    if ("get" in atom) {
      return this.readAtomState(atom as SelectorType<Value>).state;
    } else {
      return this.readAtomState(atom as AtomType<Value>).state;
    }
  }

  private updateDependencies<Value>(atom: AtomOrSelectorType<Value>) {
    const dependencies = this.selectorDependencies.get(atom.key);
    if (dependencies) {
      dependencies.forEach((key) => {
        const dependent = this.selectorMap.get(key);
        if (dependent) {
          dependent.state = dependent.get({ get: this.readAtomValue.bind(this) });
        }
      });
    }
  }

  setAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): void {
    if ("get" in targetAtom) {
      const currentAtom = this.readAtomState(targetAtom);
      this.selectorMap.set(targetAtom.key, { ...currentAtom, state: newState });
    } else {
      const currentAtom = this.readAtomState(targetAtom);
      this.atomMap.set(targetAtom.key, { ...currentAtom, state: newState });
    }
    this.updateDependencies(targetAtom);
  }
}

export const defaultStore = new Store();
export const createStore = () => new Store();
