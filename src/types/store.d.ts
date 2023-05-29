export type getter = <Value>(atom: AtomOrSelectorType<Value>) => Value;

export type AtomType<Value = any> = {
  key: string;
  initialState: Value;
};

export type SelectorType<Value = any> = {
  key: string;
  get: ({ get }: { get: getter }) => Value;
};

export type AtomOrSelectorType<Value = any> =
  | AtomType<Value>
  | SelectorType<Value>;

export type AtomMapType = Map<string, AtomType & { state: any }>;
export type SelectorMapType = Map<string, SelectorType & { state: any }>;

export type AtomWithStateType<Value> = AtomType<Value> & { state: Value };
export type SelectorWithStateType<Value> = SelectorType<Value> & {
  state: Value;
};
