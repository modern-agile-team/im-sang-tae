/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Sun Jul 30 2023
 **/

import { defaultStore } from "../../src";

describe("createAtomFamily", () => {
  it("createAtomFamily", () => {
    const atom = defaultStore.createAtomFamily({
      key: "atomFamily",
      initialState(param: number) {
        return param + 1;
      },
    });

    expect(defaultStore.readAtomValue(atom(1))).toBe(2);
  });

  it("createSelectorFamily", () => {
    const atom = defaultStore.createAtomFamily({
      key: "atomFamilyForSelector",
      initialState(param: number) {
        return param + 1;
      },
    });

    const selector = defaultStore.createAtom({
      key: "selector",
      get({ get }) {
        return get(atom(10)) + 1;
      },
    });

    expect(defaultStore.readAtomValue(selector)).toBe(12);
  });

  it("duplicateKeyError", () => {
    expect(() => {
      defaultStore.createAtomFamily({
        key: "atomFamily",
        initialState(param: number) {
          return param + 1;
        },
      });
    }).toThrow();
  });
});
