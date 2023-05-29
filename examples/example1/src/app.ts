/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { defaultStateManger } from "im-sang-tae";
import { numberAtom } from "./atom";

const Comp = document.createElement("div");
const Button = document.createElement("button");
const Text = document.createElement("span");

Comp.id = "wrapper";
Text.id = "text";

const [getNumber, setNumber] = defaultStateManger.atomState(numberAtom);

function changeText(component: HTMLElement, text: string) {
  component.innerText = text;
}

Button.innerText = "+1";
Text.innerText = `${getNumber()}`;

document.body.appendChild(Comp);
Comp.appendChild(Button);
Comp.appendChild(Text);

defaultStateManger.subscribe(numberAtom, () => {
  if (!Text) return;
  changeText(Text, `${getNumber()}`);
});

Button.onclick = () => {
  setNumber(getNumber() + 1);
};
