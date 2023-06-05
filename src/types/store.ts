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
};

export type SelectorType<Value = any> = {
  key: string;
  get: ({ get }: { get: getter }) => Value;
  options?: Options;
};

export type SelectorFamilyType<Value = any, T = any> = {
  key: string;
  get: (param: T) => ({ get }: { get: getter }) => Value;
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
  writeAtomState<Value>(targetAtom: AtomOrSelectorType<Value>, newState: Value): AtomOrSelectorType<Value>;

  /**
   * receive atomFamily and store in the atomMap.
   * @param atomFamily
   */
  createAtomFamily<Value, T>(atomFamily: AtomOrSelectorFamilyType<Value, T>): (param: T) => AtomOrSelectorType<Value>;
}
