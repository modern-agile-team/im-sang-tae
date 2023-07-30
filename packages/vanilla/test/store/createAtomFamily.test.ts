//@ts-nocheck
/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Sun Jul 30 2023
 **/

import { defaultStore } from "../../src";

test("createAtomFamily", () => {
  const atom = defaultStore.createAtomFamily({
    key: "atomFamily",
    initialState(param: number) {
      return param + 1;
    },
  });

  expect(defaultStore.readAtomValue(atom(1))).toBe(2);
});
