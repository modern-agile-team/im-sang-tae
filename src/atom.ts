/*
 * Created on Thu May 11 2023
 *
 * Copyright (c) 2023 Your Company
 */

import { defaultStore } from "./stateManager";

export const numberAtom = defaultStore.createAtom({
  key: "numberAtom",
  state: 1,
});
