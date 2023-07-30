//@ts-nocheck
/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Sun Jul 30 2023
 **/

import { defaultStore } from "../../src";

test("writeAtom", () => {
  const atom = defaultStore.createAtom({
    key: "atom",
    initialState: 1,
  });

  defaultStore.writeAtomState(atom, 10);

  expect(defaultStore.readAtomValue(atom)).toBe(10);
});

test("writeSelector", () => {
  const atom = defaultStore.createAtom({
    key: "atomForSelector",
    initialState: 1,
  });

  const selector = defaultStore.createAtom({
    key: "selector",
    get({ get }) {
      return get(atom) + 1;
    },
  });

  defaultStore.writeAtomState(selector, 10);

  expect(defaultStore.readAtomValue(selector)).toBe(10);
});
