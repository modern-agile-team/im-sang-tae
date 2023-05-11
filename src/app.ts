/*
 * Created on Tue May 09 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { numberAtom } from "./atom";
import { defaultManager as stateManager, defaultStore as store } from "./stateManager";

const Comp = document.createElement("div");
const Button = document.createElement("button");
const Text = document.createElement("span");

Comp.id = "wrapper";
Text.id = "text";

const [getNumber, setNumber] = stateManager.getAndSetRSState(numberAtom);

Button.innerText = "+1";
Text.innerText = `${getNumber()}`;

document.body.appendChild(Comp);
Comp.appendChild(Button);
Comp.appendChild(Text);

Button.onclick = () => {
  setNumber(getNumber() + 1);
  store.rerender(numberAtom, () => {
    Text.innerText = `${getNumber()}`;
  });
};
