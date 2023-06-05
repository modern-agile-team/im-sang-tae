/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Mon Jun 05 2023
 **/

import { defaultStore, defaultStateManger } from "../index";

const atom = defaultStore.createAtom({
  key: "atom",
  initialState: 1,
});

const atomWithStorage = defaultStore.createAtom({
  key: "atomWithStorage",
  initialState: 1,
  options: {
    persistence: "localStorage",
  },
});

const atomFamily = defaultStore.createAtomFamily<number, number>({
  key: "atomFamily",
  initialState(param) {
    return param;
  },
});

const [getAtom, setAtom] = defaultStateManger.atomState(atom);
const [getAtomWithStorage, setAtomWithStorage] = defaultStateManger.atomState(atomWithStorage);
const [getAtomFamily, setAtomFamily] = defaultStateManger.atomState(atomFamily(10));

const AtomText = document.createElement("p");
const AtomWithStorageText = document.createElement("p");
const AtomFamilyText = document.createElement("p");

document.body.appendChild(AtomText);
document.body.appendChild(AtomWithStorageText);
document.body.appendChild(AtomFamilyText);

const AtomButton = document.createElement("button");
const AtomWithStorageButton = document.createElement("button");
const AtomFamilyButton = document.createElement("button");

AtomButton.innerText = "AtomButton + 1";
AtomWithStorageButton.innerText = "AtomWithStorageButton + 1";
AtomFamilyButton.innerText = "AtomFamilyButton + 1";

document.body.appendChild(AtomButton);
document.body.appendChild(AtomWithStorageButton);
document.body.appendChild(AtomFamilyButton);

AtomText.innerHTML = `${getAtom()}`;
AtomWithStorageText.innerHTML = `${getAtomWithStorage()}`;
AtomFamilyText.innerHTML = `${getAtomFamily()}`;

AtomButton.onclick = () => {
  setAtom((prev) => prev + 1);
};

AtomWithStorageButton.onclick = () => {
  setAtomWithStorage((prev) => prev + 1);
};

AtomFamilyButton.onclick = () => {
  setAtomFamily((prev) => prev + 1);
};

defaultStateManger.subscribe(atom, () => {
  AtomText.innerHTML = `${getAtom()}`;
});

defaultStateManger.subscribe(atomWithStorage, () => {
  AtomWithStorageText.innerHTML = `${getAtomWithStorage()}`;
});

defaultStateManger.subscribe(atomFamily(10), () => {
  AtomFamilyText.innerHTML = `${getAtomFamily()}`;
});
