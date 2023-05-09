/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 SoonKiMin
 */

type AtomType<Value = unknown> = {
  state: Value;
  next: AtomType | null;
};

interface IStore {
  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value>;
  readAtomValue<Value>(atom: AtomType<Value>): Value;
  createAtom<Value>(state: Value): AtomType<Value>;
  setAtomState<Value>(prevAtom: AtomType<Value>, newAtom: AtomType<Value>): void;
  subscribeAtom<Value>(atom: AtomType<Value>, listener: () => void): void;
  unsubscribeAtom<Value>(atom: AtomType<Value>, listener: () => void): void;
}

export class Store implements IStore {
  private atomMap: WeakMap<AtomType, AtomType> = new WeakMap();
  private listeners: WeakMap<AtomType, () => void>[] = [];

  constructor() {}

  createAtom<Value>(state: Value): AtomType<Value> {
    const newAtom: AtomType<Value> = { state, next: null };
    this.atomMap.set(newAtom, newAtom);
    return newAtom;
  }

  readAtomState<Value>(atom: AtomType<Value>): AtomType<Value> {
    try {
      const atomState = this.atomMap.get(atom) as AtomType<Value>;
      if (!atomState) throw Error("This atom is empty");
      return atomState;
    } catch (err) {
      throw Error("Failed to get Atom");
    }
  }

  readAtomValue<Value>(atom: AtomType<Value>): Value {
    return this.readAtomState(atom).state as Value;
  }

  subscribeAtom<Value>(atom: AtomType<Value>, listener: () => void): void {
    this.listeners.push(new WeakMap().set(atom, listener));
  }

  unsubscribeAtom<Value>(atom: AtomType<Value>, listener: () => void): void {
    this.listeners = this.listeners.filter((map) => !(map.has(atom) && map.get(atom) === listener));
  }

  setAtomState<Value>(prevAtom: AtomType<Value>, newAtom: AtomType<Value>): void {
    try {
      this.atomMap.set(prevAtom, newAtom);
      this.listeners.forEach((map) => {
        if (map.has(prevAtom)) {
          const func = map.get(prevAtom);
          func!();
        }
      });
    } catch (err) {
      throw Error("Failed to set atom");
    }
  }
}

export const defaultStore = new Store();