/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { AtomOrSelectorType, createStore, defaultStore } from "./store";

export function createStateManager(store: ReturnType<typeof createStore>) {
  const subscriptions: Map<string, (() => void)[]> = new Map();

  function atomValue<Value>(atom: AtomOrSelectorType<Value>) {
    return () => store.readAtomValue(atom);
  }

  function setAtomState<Value>(atom: AtomOrSelectorType<Value>) {
    return (newValue: Value) => {
      store.setAtom(atom, newValue);
      render(atom);
    };
  }

  function atomState<Value>(atom: AtomOrSelectorType<Value>): [() => Value, (newValue: Value) => void] {
    return [atomValue(atom), setAtomState(atom)];
  }

  function subscribe(atom: AtomOrSelectorType, callback: () => void) {
    const existingSubscriptions = subscriptions.get(atom.key) || [];
    subscriptions.set(atom.key, [...existingSubscriptions, callback]);
  }

  function render<Value>(atom: AtomOrSelectorType<Value>) {
    const listeners = subscriptions.get(atom.key);
    if (listeners) {
      listeners.forEach((callback) => callback());
    }
  }

  return {
    atomState,
    atomValue,
    subscribe,
  };
}

export const defaultStateManger = createStateManager(defaultStore);
