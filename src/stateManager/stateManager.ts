/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { AtomType, Store, defaultStore } from "./store";

interface IStateManager {
  getAndSetRSState<Value>(atom: AtomType<Value>): [() => Value, (newValue: Value) => void];
  getRSState<Value>(atom: AtomType<Value>): () => Value;
  setRSState<Value>(atom: AtomType<Value>): (newValue: Value) => void;
}

class StateManager implements IStateManager {
  private static instance: StateManager;
  private store: Store;

  constructor(store: Store) {
    if (!StateManager.instance) {
      StateManager.instance = this;
    }
    this.store = store;
    return StateManager.instance;
  }

  getRSState<Value>(atom: AtomType<Value>) {
    return () => this.store.readAtomValue(atom);
  }

  setRSState<Value>(atom: AtomType<Value>) {
    return (newValue: Value) => {
      return this.store.setAtomState(atom, newValue);
    };
  }

  getAndSetRSState<Value>(atom: AtomType<Value>): [() => Value, (newValue: Value) => void] {
    return [this.getRSState(atom), this.setRSState(atom)];
  }
}

export const defaultManager = new StateManager(defaultStore);
