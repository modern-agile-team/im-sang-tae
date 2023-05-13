/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { numberAtom } from "./atom";
import { defaultManager as stateManager } from "./stateManager";

const Comp = document.createElement("div");
const Button = document.createElement("button");
const Text = document.createElement("span");

Comp.id = "wrapper";
Text.id = "text";

const [getNumber, setNumber] = stateManager.getAndSetRSState(numberAtom);

function changeText(component: HTMLElement, text: string) {
  component.innerText = text;
}

Button.innerText = "+1";
Text.innerText = `${getNumber()}`;

document.body.appendChild(Comp);
Comp.appendChild(Button);
Comp.appendChild(Text);

Button.onclick = () => {
  setNumber(getNumber() + 1);
  changeText(Text, `${getNumber()}`);
};
