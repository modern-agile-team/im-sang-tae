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
  get: ({ get }: { get: <Value>(state: AtomOrSelectorType<Value>) => Value }) => Value;
};

interface IStore {
  /** atom relative methods */
  createAtom<Value>(state: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  readAtomState<Value>(state: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  readAtomValue<Value>(state: AtomOrSelectorType<Value>): Value;
  setAtomState<Value>(targetState: AtomOrSelectorType<Value>, newState: Value): void;
}

export class Store implements IStore {
  private atomMap: AtomMapType = new Map();
  private selectorMap: SelectorMapType = new Map();
  private selectorDependencies: Map<string, Set<string>> = new Map();

  private createNewAtom<Value>(state: AtomType<Value>) {
    const newAtom: AtomType<Value> = { key: state.key, initialState: state.initialState };
    this.atomMap.set(state.key, { ...newAtom, state: state.initialState });
    return newAtom;
  }

  private createNewSelector<Value>(state: SelectorType<Value>) {
    const get = <Value>(getterState: AtomOrSelectorType<Value>) => {
      // Track selector dependencies
      const dependency = this.selectorDependencies.get(getterState.key) || new Set();
      dependency.add(state.key);
      this.selectorDependencies.set(getterState.key, dependency);

      return this.readAtomValue(getterState);
    };
    const newSelector: SelectorType<Value> = { key: state.key, get: state.get };
    this.selectorMap.set(state.key, { ...newSelector, state: state.get({ get }) });
    return newSelector;
  }

  createAtom<Value>(state: AtomType<Value>): AtomType<Value>;
  createAtom<Value>(state: SelectorType<Value>): SelectorType<Value>;
  createAtom<Value>(state: AtomOrSelectorType<Value>): AtomOrSelectorType<Value> {
    if ("get" in state) {
      if (this.selectorMap.has(state.key)) throw Error(`selector that has ${state.key} key already exist`);
      return this.createNewSelector(state);
    } else {
      if (this.atomMap.has(state.key)) throw Error(`atom that has ${state.key} key already exist`);
      return this.createNewAtom(state);
    }
  }

  readAtomState<Value>(state: AtomType<Value>): AtomWithStateType<Value>;
  readAtomState<Value>(state: SelectorType<Value>): SelectorWithStateType<Value>;
  readAtomState<Value>(state: AtomOrSelectorType<Value>): AtomWithStateType<Value> | SelectorWithStateType<Value> {
    if ("get" in state) {
      if (!this.selectorMap.has(state.key)) {
        throw Error(`selector that has ${state.key} key does not exist`);
      }
      const selectorState = this.selectorMap.get(state.key) as SelectorWithStateType<Value>;

      return selectorState;
    } else {
      if (!this.atomMap.has(state.key)) {
        throw Error(`atom that has ${state.key} key does not exist`);
      }
      const atomState = this.atomMap.get(state.key) as AtomWithStateType<Value>;

      return atomState;
    }
  }

  readAtomValue<Value>(state: AtomOrSelectorType<Value>): Value {
    if ("get" in state) {
      return this.readAtomState(state as SelectorType<Value>).state;
    } else {
      return this.readAtomState(state as AtomType<Value>).state;
    }
  }

  private updateDependencies<Value>(state: AtomOrSelectorType<Value>) {
    const dependencies = this.selectorDependencies.get(state.key);
    if (dependencies) {
      dependencies.forEach((key) => {
        const dependent = this.selectorMap.get(key);
        if (dependent) {
          dependent.state = dependent.get({ get: this.readAtomValue.bind(this) });
        }
      });
    }
  }

  setAtomState<Value>(targetState: AtomOrSelectorType<Value>, newState: Value): void {
    if ("get" in targetState) {
      const currentAtom = this.readAtomState(targetState);
      this.selectorMap.set(targetState.key, { ...currentAtom, state: newState });
    } else {
      const currentAtom = this.readAtomState(targetState);
      this.atomMap.set(targetState.key, { ...currentAtom, state: newState });
    }
    this.updateDependencies(targetState);
  }
}

export const defaultStore = new Store();
export const createStore = () => new Store();
