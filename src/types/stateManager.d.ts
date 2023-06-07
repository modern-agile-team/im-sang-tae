/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Wed Jun 07 2023
 **/

import { AtomOrSelectorType } from "./store";

export type setStateArgument<Value> =
  | Value
  | Awaited<Value>
  | ((prevValue: Value | Awaited<Value>) => Value | Awaited<Value>);

export interface StateManager {
  /**
   * Reads the current value of the provided atom or selector.
   * @returns a function that, when invoked, returns the current value of the atom.
   */
  atomValue<Value>(atom: AtomOrSelectorType<Value>): () => Value;
  /**
   * Creates a setter function for a provided atom.
   * The setter function updates the atom's value and triggers a rerender for all subscribers.
   */
  setAtomState<Value>(atom: AtomOrSelectorType<Value>): (argument: setStateArgument<Value>) => void;
  /**
   * Returns a tuple of getter and setter functions for a given atom.
   */
  atomState<Value>(
    atom: AtomOrSelectorType<Value>
  ): [
    () => Value,
    (newValue: Value | Awaited<Value> | ((prevValue: Value | Awaited<Value>) => Value | Awaited<Value>)) => void
  ];
  /**
   * Subscribes a callback function to one or many atoms or selectors.
   * The callback is called whenever one of the subscribed atoms changes its value.
   */
  subscribe(targetAtom: AtomOrSelectorType | AtomOrSelectorType[], callback: () => void): void;
}
