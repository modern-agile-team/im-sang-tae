/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Sun Jul 30 2023
 **/

import { defaultStore } from "../../src";

describe("createSelector", () => {
  it("createSelector", () => {
    const atom = defaultStore.createAtom({
      key: "atom",
      initialState: 1,
    });

    const selector = defaultStore.createAtom({
      key: "selector",
      get({ get }) {
        return get(atom) + 1;
      },
    });

    expect(defaultStore.readAtomValue(selector)).toBe(2);
  });

  it("createSelectorWithFamily", () => {
    const atom = defaultStore.createAtomFamily({
      key: "atomFamily",
      initialState(param: number) {
        return param + 1;
      },
    });

    const selector = defaultStore.createAtom({
      key: "selectorWithFamily",
      get({ get }) {
        return get(atom(1)) + 1;
      },
    });

    expect(defaultStore.readAtomValue(selector)).toBe(3);
  });

  it("duplicateKeyError", () => {
    const atom = defaultStore.createAtomFamily({
      key: "atomFamily2",
      initialState(param: number) {
        return param + 1;
      },
    });
    expect(() =>
      defaultStore.createAtom({
        key: "selectorWithFamily",
        get({ get }) {
          return get(atom(1)) + 1;
        },
      })
    ).toThrow();
  });
});
