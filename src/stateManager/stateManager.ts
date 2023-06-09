/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 09 2023
 **/

import { defaultStore } from "../store";
import type { AtomOrSelectorType, StateManager, Store, setStateArgument } from "../types";

export function createStateManager(store: Store): StateManager {
  const subscriptions: Map<string, (() => void)[]> = new Map();
  const atomBatchingQueue: { [key: string]: { atom: AtomOrSelectorType; newValue: any }[] } = {};

  let processingQueueFlag = false;

  function batching(process: (last: { atom: AtomOrSelectorType; newValue: any }) => void) {
    if (processingQueueFlag) return;

    processingQueueFlag = true;

    Promise.resolve().then(() => {
      const atomKeyList = Object.keys(atomBatchingQueue);

      const promises = atomKeyList.map((key) => {
        const batchList = atomBatchingQueue[key];
        atomBatchingQueue[key] = [];

        const last = batchList.pop();
        if (!last) return Promise.resolve();

        return Promise.resolve(process(last)).catch((error) => {
          console.error(`Failed to process for ${last.atom.key}:`, error);
        });
      });

      Promise.all(promises).finally(() => {
        processingQueueFlag = false;
      });
    });
  }

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
      if (!atomBatchingQueue[atom.key]) atomBatchingQueue[atom.key] = [];
      atomBatchingQueue[atom.key].push({ atom, newValue });
      batching((last) => {
        store.writeAtomState(last.atom, last.newValue);
        render(last.atom);
      });
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

  function subscribeCallbackToSingleAtom(atom: AtomOrSelectorType, callback: () => void) {
    const existingSubscriptions = subscriptions.get(atom.key) || [];
    subscriptions.set(atom.key, [...existingSubscriptions, callback]);
  }

  /**
   * Subscribes a callback function to one or many atoms or selectors.
   * The callback is called whenever one of the subscribed atoms changes its value.
   */
  function subscribe(
    targetAtom:
      | (AtomOrSelectorType | ((param: any) => AtomOrSelectorType))
      | (((param: any) => AtomOrSelectorType) | AtomOrSelectorType)[],
    callback: () => void
  ) {
    if (Array.isArray(targetAtom)) {
      targetAtom.forEach((atom) => {
        subscribeCallbackToSingleAtom(typeof atom === "function" ? atom(null) : atom, callback);
      });
    } else {
      subscribeCallbackToSingleAtom(typeof targetAtom === "function" ? targetAtom(null) : targetAtom, callback);
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
export const { atomState, atomValue, setAtomState, subscribe } = defaultStateManger;
