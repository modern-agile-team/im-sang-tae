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

  /**
   * Reads the current value of the provided atom or selector.
   * @returns a function that, when invoked, returns the current value of the atom.
   */
  function atomValue<Value>(atom: AtomOrSelectorType<Value>) {
    return () => store.readAtomValue(atom);
  }

  /**
   * Creates a setter function for a provided atom.
   * The setter function updates the atom's value and triggers a rerender for all subscribers.
   */
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

  /**
   * Returns a tuple of getter and setter functions for a given atom.
   */
  function atomState<Value>(
    atom: AtomOrSelectorType<Value>
  ): [
    () => Value,
    (newValue: Value | Awaited<Value> | ((prevValue: Value | Awaited<Value>) => Value | Awaited<Value>)) => void
  ] {
    return [atomValue(atom), setAtomState(atom)];
  }

  /**
   * Subscribes a callback function to one or many atoms or selectors.
   * The callback is called whenever one of the subscribed atoms changes its value.
   */
  function subscribe(targetAtom: AtomOrSelectorType | AtomOrSelectorType[], callback: () => void) {
    if (Array.isArray(targetAtom)) {
      targetAtom.forEach((atom) => {
        const existingSubscriptions = subscriptions.get(atom.key) || [];
        subscriptions.set(atom.key, [...existingSubscriptions, callback]);
      });
    } else {
      const existingSubscriptions = subscriptions.get(targetAtom.key) || [];
      subscriptions.set(targetAtom.key, [...existingSubscriptions, callback]);
    }
  }

  /**
   * Calls all subscribed callbacks for a given atom.
   */
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
