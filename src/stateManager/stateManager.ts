/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 09 2023
 **/

import { getDefaultStore } from "../store";

import type { AtomOrSelectorType, Store } from "../types";

export function createStateManager(store: Store) {
  const subscriptions: Map<string, (() => void)[]> = new Map();

  function atomValue<Value>(atom: AtomOrSelectorType<Value>) {
    return () => store.readAtomValue(atom);
  }

  function setAtomState<Value>(atom: AtomOrSelectorType<Value>) {
    return (newValue: Value) => {
      store.writeAtomState(atom, newValue);
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
    setAtomState,
    subscribe,
  };
}

export const defaultStateManger = createStateManager(getDefaultStore());
