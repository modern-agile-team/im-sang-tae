/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { defaultManager } from "./stateManager";
import { defaultStore } from "./store";

const store = defaultStore;
const stateManager = defaultManager;

const numberAtom = store.createAtom(1);
const userAtom = store.createAtom({ name: "순기", age: 25 });

const [getNumber, setNumber] = stateManager.getAndSetRSState(numberAtom);
const [getUser, setUser] = stateManager.getAndSetRSState(userAtom);

console.log(getNumber());
setNumber(2);
console.log(getNumber());
setNumber(3);
console.log(getNumber());
setNumber(4);
console.log(getNumber());

console.log(getUser());
setUser({ name: "순기2", age: 26 });
console.log(getUser());
setUser({ name: "순기3", age: 27 });
console.log(getUser());
setUser({ name: "순기4", age: 28 });
console.log(getUser());
