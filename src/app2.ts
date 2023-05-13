/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { numberAtom } from "./atom";
import { defaultManager as stateManager } from "./stateManager";

const Comp = document.getElementById("wrapper");
const Text = document.getElementById("text");
const Button = document.createElement("button");

const [getNumber, setNumber] = stateManager.getAndSetRSState(numberAtom);

function changeText(component: HTMLElement, text: string) {
  component.innerText = text;
}

Comp?.appendChild(Button);

Button.innerText = "+2";

stateManager.subscribe(numberAtom, () => {
  if (!Text) return;
  changeText(Text, `${getNumber()}`);
});

Button.onclick = () => {
  if (!Text) return;
  setNumber(getNumber() + 2);
};
