/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { AtomType, Store } from "./store";

interface IStateManager {
  getAndSetRSState<Value>(atom: AtomType<Value>): [() => Value, (newValue: Value) => void];
  getRSState<Value>(atom: AtomType<Value>): () => Value;
  setRSState<Value>(atom: AtomType<Value>): (newValue: Value) => void;
}

class StateManager implements IStateManager {
  private store = new Store();

  getRSState<Value>(atom: AtomType<Value>) {
    return () => this.store.readAtomValue(atom);
  }

  setRSState<Value>(atom: AtomType<Value>) {
    return (newValue: Value) => this.store.setAtomState(atom, this.store.createAtom(newValue));
  }

  getAndSetRSState<Value>(atom: AtomType<Value>): [() => Value, (newValue: Value) => void] {
    return [this.getRSState(atom), this.setRSState(atom)];
  }
}

export const defaultManager = new StateManager();
