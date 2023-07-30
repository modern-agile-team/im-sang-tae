//@ts-nocheck
/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Sun Jul 30 2023
 **/

import { defaultStore } from "../../src";

test("createAtom", () => {
  const atom = defaultStore.createAtom({
    key: "atom",
    initialState: 1,
  });

  expect(defaultStore.readAtomValue(atom)).toBe(1);
  expect(() => defaultStore.createAtom({ key: "atom", initialState: 3 })).toThrow(
    "atom that has atom key already exist"
  );
});
