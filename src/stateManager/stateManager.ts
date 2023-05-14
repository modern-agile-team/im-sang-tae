/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { AtomOrSelectorType, Store, defaultStore } from "./store";

interface IStateManager {
  atomState<Value>(atom: AtomOrSelectorType<Value>): [() => Value, (newValue: Value) => void];
  atomValue<Value>(atom: AtomOrSelectorType<Value>): () => Value;
  setAtomState<Value>(atom: AtomOrSelectorType<Value>): (newValue: Value) => void;
  subscribe(atom: AtomOrSelectorType, callback: () => void): void;
}

class StateManager implements IStateManager {
  private store: Store;
  private subscriptions: Map<string, (() => void)[]> = new Map();

  constructor(store: Store) {
    this.store = store;
  }

  atomValue<Value>(atom: AtomOrSelectorType<Value>) {
    return () => this.store.readAtomValue(atom);
  }

  setAtomState<Value>(atom: AtomOrSelectorType<Value>) {
    return (newValue: Value) => {
      this.store.setAtomState(atom, newValue);
      this.render(atom);
    };
  }

  atomState<Value>(atom: AtomOrSelectorType<Value>): [() => Value, (newValue: Value) => void] {
    return [this.atomValue(atom), this.setAtomState(atom)];
  }

  subscribe(atom: AtomOrSelectorType, callback: () => void) {
    const existingSubscriptions = this.subscriptions.get(atom.key) || [];
    this.subscriptions.set(atom.key, [...existingSubscriptions, callback]);
  }

  private render<Value>(atom: AtomOrSelectorType<Value>) {
    const listeners = this.subscriptions.get(atom.key);
    if (listeners) {
      listeners.forEach((callback) => callback());
    }
  }
}

export const defaultManager = new StateManager(defaultStore);
