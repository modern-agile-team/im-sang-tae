/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { numberAtom, numberSelector } from "./atom";
import { defaultManager as stateManager } from "../stateManager";

const Comp = document.getElementById("wrapper");
const Text = document.getElementById("text");
const Button = document.createElement("button");

const Text2 = document.createElement("span");

const getNumber = stateManager.atomValue(numberAtom);
const [getNumberS, setNumberS] = stateManager.atomState(numberSelector);

function changeText(component: HTMLElement, text: string) {
  component.innerText = text;
}

changeText(Text2, `${getNumberS()}`);

Comp?.appendChild(Button);
Comp?.appendChild(Text2);

Button.innerText = "+2";

stateManager.subscribe(numberAtom, () => {
  if (!Text) return;
  changeText(Text, `${getNumber()}`);
  changeText(Text2, `${getNumberS()}`);
});

stateManager.subscribe(numberSelector, () => {
  if (!Text) return;
  changeText(Text2, `${getNumberS()}`);
});

Button.onclick = () => {
  if (!Text) return;
  setNumberS(getNumberS() + 2);
};
