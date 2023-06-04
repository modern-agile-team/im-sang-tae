/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 09 2023
 **/

import { defaultStore } from "../store";
import type { AtomOrSelectorType, Store } from "../types";

type setStateArgument<Value> = Value | Awaited<Value> | ((prevValue: Value | Awaited<Value>) => Value | Awaited<Value>);

export function createStateManager(store: Store) {
  const subscriptions: Map<string, (() => void)[]> = new Map();

  function atomValue<Value>(atom: AtomOrSelectorType<Value>) {
    return () => store.readAtomValue(atom);
  }

  function setAtomState<Value>(atom: AtomOrSelectorType<Value>) {
    let newValue: Value | Awaited<Value>;

    const result = (argument: setStateArgument<Value>) => {
      if (typeof argument === "function") {
        const setter = argument as (prevValue: Value | Awaited<Value>) => Value | Awaited<Value>;
        const prevValue = store.readAtomValue(atom);
        newValue = setter(prevValue);
      } else {
        newValue = argument;
      }
      store.writeAtomState(atom, newValue);
      render(atom);
    };

    return result;
  }

  function atomState<Value>(
    atom: AtomOrSelectorType<Value>
  ): [
    () => Value,
    (newValue: Value | Awaited<Value> | ((prevValue: Value | Awaited<Value>) => Value | Awaited<Value>)) => void
  ] {
    return [atomValue(atom), setAtomState(atom)];
  }

  function subscribe(atom: AtomOrSelectorType, callback: () => void) {
    const existingSubscriptions = subscriptions.get(atom.key) || [];
    subscriptions.set(atom.key, [...existingSubscriptions, callback]);
  }

  function render<Value>(atom: AtomOrSelectorType<Value>) {
    const listeners = subscriptions.get(atom.key);
    if (!listeners) return;

    listeners.forEach((callback) => callback());
  }

  return {
    atomState,
    atomValue,
    setAtomState,
    subscribe,
  };
}

export const defaultStateManger = createStateManager(defaultStore);
