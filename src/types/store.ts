/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 30 2023
 **/

export type getter = <Value>(atom: AtomOrSelectorType<Value>) => Value;

export type AtomType<Value = any> = {
  key: string;
  initialState: Value;
  options?: Options;
};

export type AtomFamilyType<Value = any, T = any> = {
  key: string;
  initialState: (param: T) => Value;
  options?: Options;
};

export type SelectorType<Value = any> = {
  key: string;
  get: ({ get }: { get: getter }) => Value;
  options?: Options;
};

export type SelectorFamilyType<Value = any, T = any> = {
  key: string;
  get: (param: T) => ({ get }: { get: getter }) => Value;
  options?: Options;
};

export type AtomOrSelectorType<Value = any> = AtomType<Value> | SelectorType<Value>;
export type AtomOrSelectorFamilyType<Value = any, T = any> = AtomFamilyType<Value, T> | SelectorFamilyType<Value, T>;

export type AtomMapType = Map<string, AtomType & { state: any }>;
export type SelectorMapType = Map<string, SelectorType & { state: any }>;

export type AtomWithStateType<Value> = AtomType<Value> & { state: Value };
export type SelectorWithStateType<Value> = SelectorType<Value> & {
  state: Value;
};

export type Options = {
  persistence?: "localStorage" | "sessionStorage";
};

export interface Store {
  /**
   * Creates a new atom, throwing an error if an atom with the same key already exists.
   */
  createAtom<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  /**
   * Creates a new atom family, throwing an error if an atom family with the same key already exists.
   */
  createAtomFamily<Value, T>(atomFamily: AtomOrSelectorFamilyType<Value, T>): (param: T) => AtomOrSelectorType<Value>;
  /**
   * Reads the current state of a given atom, throwing an error if the atom does not exist.
   */
  readAtomState<Value>(atom: AtomOrSelectorType<Value>): AtomOrSelectorType<Value>;
  /**
   * Returns the current value of a given atom.
   */
  readAtomValue<Value>(atom: AtomOrSelectorType<Value>): Value;
  /**
   * Updates the state of a given atom to a new value and updates all dependencies.
   */
  writeAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): AtomOrSelectorType<Value>;
}
