/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 SoonKiMin
 */

export type AtomType<Value = unknown> = {
  key: string;
  state: Value;
};

interface IStore {
  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value>;
  readAtomValue<Value>(atom: AtomType<Value>): Value;
  createAtom<Value>(atom: AtomType<Value>): AtomType<Value>;
  setAtomState<Value>(targetAtom: AtomType<Value>, newState: Value): void;
}

export class Store implements IStore {
  private static instance: Store;
  private atomMap: Map<string, AtomType> = new Map();

  constructor() {
    if (!Store.instance) {
      Store.instance = this;
    }
    return Store.instance;
  }

  createAtom<Value>(atom: AtomType<Value>): AtomType<Value> {
    const newAtom: AtomType<Value> = { key: atom.key, state: atom.state };
    this.atomMap.set(atom.key, newAtom);
    return newAtom;
  }

  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value> {
    if (!this.atomMap.has(atom.key)) {
      this.createAtom(atom);
    }
    const atomState = this.atomMap.get(atom.key) as AtomType<Value>;
    return atomState;
  }

  readAtomValue<Value>(atom: AtomType<Value>): Value {
    return this.readAtomState(atom).state as Value;
  }

  setAtomState<Value>(targetAtom: AtomType<Value>, newState: Value): void {
    const currentAtom = this.readAtomState(targetAtom);
    this.atomMap.set(targetAtom.key, { ...currentAtom, state: newState });
  }
}

export const defaultStore = new Store();
