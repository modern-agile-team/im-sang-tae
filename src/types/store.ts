/*
 * Created on Tue May 30 2023
 *
 * Copyright (c) 2023 Your Company
 */

export type getter = <Value>(atom: AtomOrSelectorType<Value>) => Value;

export type AtomType<Value = any> = {
  key: string;
  initialState: Value;
};

export type SelectorType<Value = any> = {
  key: string;
  get: ({ get }: { get: getter }) => Value;
};

export type AtomOrSelectorType<Value = any> = AtomType<Value> | SelectorType<Value>;

export type AtomMapType = Map<string, AtomType & { state: any }>;
export type SelectorMapType = Map<string, SelectorType & { state: any }>;

export type AtomWithStateType<Value> = AtomType<Value> & { state: Value };
export type SelectorWithStateType<Value> = SelectorType<Value> & {
  state: Value;
};

export interface Store {
  /**
   * receive atom and store in the atomMap.
   * @param atom
   */
  createAtom<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  /**
   * receive atom and read itself.
   * @param atom
   */
  readAtomState<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  /**
   * receive atom and read it's value.
   * @param atom
   */
  readAtomValue<Value>(atom: AtomOrSelectorType<Value>): Value;
  /**
   * update targeted atom's state.
   * @param targetAtom
   * @param newState
   */
  writeAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): void;
}
