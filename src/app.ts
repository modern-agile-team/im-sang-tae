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

const [getNumber, setNumber] = stateManager.getAndSetRSState(numberAtom);

const Comp = document.createElement("div");
const Button = document.createElement("button");
const Text = document.createElement("span");

Button.innerText = "click!";
Text.innerText = `${getNumber()}`;

document.body.appendChild(Comp);
Comp.appendChild(Button);
Comp.appendChild(Text);

function rerender<V>(component: HTMLElement, newState: V) {
  component.innerText = `${newState}`;
}

Button.onclick = () => {
  store.subscribeAtom(numberAtom, () => rerender(Text, getNumber()));
  setNumber(getNumber() + 1);
  store.render(numberAtom);
  store.unsubscribeAtom(numberAtom, () => rerender(Text, getNumber()));
};
