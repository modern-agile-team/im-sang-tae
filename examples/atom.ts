/*
 * Created on Thu May 11 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { getDefaultStore } from "../src";

const defaultStore = getDefaultStore();

export const numberAtom = defaultStore.createAtom({
  key: "numberAtom",
  initialState: 1,
});

export const numberAtom2 = defaultStore.createAtom({
  key: "numberAtom2",
  initialState: 2,
});

export const numberSelector = defaultStore.createAtom({
  key: "numberSelector",
  get({ get }) {
    return get(numberAtom) + get(numberAtom2) + 1;
  },
});
