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
  subscribe(atom: AtomType, callback: () => void): void;
}

class StateManager implements IStateManager {
  private static instance: StateManager;
  private store: Store;
  private subscriptions: Map<string, (() => void)[]> = new Map();

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
      this.store.setAtomState(atom, newValue);
      this.render(atom);
    };
  }

  getAndSetRSState<Value>(atom: AtomType<Value>): [() => Value, (newValue: Value) => void] {
    return [this.getRSState(atom), this.setRSState(atom)];
  }

  subscribe(atom: AtomType, callback: () => void) {
    const existingSubscriptions = this.subscriptions.get(atom.key) || [];
    this.subscriptions.set(atom.key, [...existingSubscriptions, callback]);
  }

  private render<Value>(atom: AtomType<Value>) {
    const listeners = this.subscriptions.get(atom.key);
    if (listeners) {
      listeners.forEach((callback) => callback());
    }
  }
}

export const defaultManager = new StateManager(defaultStore);
