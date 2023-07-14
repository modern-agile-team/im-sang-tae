/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Mon Jun 05 2023
 **/

import { createAtom, createAtomFamily, atomState, subscribe } from "../index";

const atom = createAtom({
  key: "atom",
  initialState: 1,
});

const atomWithStorage = createAtom({
  key: "atomWithStorage",
  initialState: 1,
  options: {
    persistence: "localStorage",
  },
});

const atomFamily = createAtomFamily<number, number>({
  key: "atomFamily",
  initialState(param) {
    return param;
  },
  options: {
    persistence: "localStorage",
  },
});

const selector = createAtom({
  key: "selector",
  get({ get }) {
    return get(atom) + 1;
  },
});

const selectorWithStorage = createAtom({
  key: "selectorWithStorage",
  get({ get }) {
    return get(atom) + 1;
  },
  options: {
    persistence: "localStorage",
  },
});

const selectorFamily = createAtomFamily<number, number>({
  key: "selectorFamily",
  get:
    (param) =>
    ({ get }) => {
      return get(atom) + param;
    },
  options: {
    persistence: "localStorage",
  },
});

const [getAtom, setAtom] = atomState(atom);
const [getAtomWithStorage, setAtomWithStorage] = atomState(atomWithStorage);
const [getAtomFamily, setAtomFamily] = atomState(atomFamily(10));

const [getSelector, setSelector] = atomState(selector);
const [getSelectorWithStorage, setSelectorWithStorage] = atomState(selectorWithStorage);
const [getSelectorFamily, setSelectorFamily] = atomState(selectorFamily(10));

const AtomText = document.createElement("p");
const AtomWithStorageText = document.createElement("p");
const AtomFamilyText = document.createElement("p");

const SelectorText = document.createElement("p");
const SelectorWithStorageText = document.createElement("p");
const SelectorFamilyText = document.createElement("p");

document.body.appendChild(AtomText);
document.body.appendChild(AtomWithStorageText);
document.body.appendChild(AtomFamilyText);

document.body.appendChild(SelectorText);
document.body.appendChild(SelectorWithStorageText);
document.body.appendChild(SelectorFamilyText);

const AtomButton = document.createElement("button");
const AtomWithStorageButton = document.createElement("button");
const AtomFamilyButton = document.createElement("button");

const SelectorButton = document.createElement("button");
const SelectorWithStorageButton = document.createElement("button");
const SelectorFamilyButton = document.createElement("button");

const multiSetStateProcess = setInterval(() => {
  SelectorButton.click();
  SelectorButton.click();
  SelectorButton.click();
  SelectorButton.click();
  AtomButton.click();
  AtomButton.click();
  AtomButton.click();
  AtomButton.click();
  AtomButton.click();
}, 100);

setTimeout(() => {
  clearInterval(multiSetStateProcess);
}, 5000);

AtomButton.innerText = "AtomButton + 1";
AtomWithStorageButton.innerText = "AtomWithStorageButton + 1";
AtomFamilyButton.innerText = "AtomFamilyButton + 1";

SelectorButton.innerText = "SelectorButton + 1";
SelectorWithStorageButton.innerText = "SelectorWithStorageButton + 1";
SelectorFamilyButton.innerText = "SelectorFamilyButton + 1";

document.body.appendChild(AtomButton);
document.body.appendChild(AtomWithStorageButton);
document.body.appendChild(AtomFamilyButton);

document.body.appendChild(SelectorButton);
document.body.appendChild(SelectorWithStorageButton);
document.body.appendChild(SelectorFamilyButton);

AtomText.innerText = `atom => ${getAtom()}`;
AtomWithStorageText.innerText = `atomWithStorage => ${getAtomWithStorage()}`;
AtomFamilyText.innerText = `atomFamily => ${getAtomFamily()}`;

SelectorText.innerText = `selector => ${getSelector()}`;
SelectorWithStorageText.innerText = `selectorWithStorage => ${getSelectorWithStorage()}`;
SelectorFamilyText.innerText = `selectorFamily => ${getSelectorFamily()}`;

AtomButton.onclick = () => {
  setAtom((prev) => prev + 1);
};

AtomWithStorageButton.onclick = () => {
  setAtomWithStorage((prev) => prev + 1);
};

AtomFamilyButton.onclick = () => {
  setAtomFamily((prev) => prev + 1);
};

SelectorButton.onclick = () => {
  setSelector((prev) => prev + 1);
};

SelectorWithStorageButton.onclick = () => {
  setSelectorWithStorage((prev) => prev + 1);
};

SelectorFamilyButton.onclick = () => {
  setSelectorFamily((prev) => prev + 1);
};

subscribe([atom, atomWithStorage, atomFamily, selector, selectorWithStorage, selectorFamily], () => {
  AtomText.innerText = `atom => ${getAtom()}`;
  AtomWithStorageText.innerText = `atomWithStorage => ${getAtomWithStorage()}`;
  AtomFamilyText.innerText = `atomFamily => ${getAtomFamily()}`;
  SelectorText.innerText = `selector => ${getSelector()}`;
  SelectorWithStorageText.innerText = `selectorWithStorage => ${getSelectorWithStorage()}`;
  SelectorFamilyText.innerText = `selectorFamily => ${getSelectorFamily()}`;
});
