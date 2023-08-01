/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Sun Jul 30 2023
 **/

import { defaultStore } from "../../src";

describe("createAtom", () => {
  it("createAtom", () => {
    const atom = defaultStore.createAtom({
      key: "atom",
      initialState: 1,
    });
    expect(defaultStore.readAtomValue(atom)).toBe(1);
  });

  it("duplicateKeyError", () => {
    expect(() => defaultStore.createAtom({ key: "atom", initialState: 3 })).toThrow();
  });
});
