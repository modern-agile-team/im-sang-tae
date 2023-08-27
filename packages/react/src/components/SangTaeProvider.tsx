/**
 * Author: HyunWoo Park (bagh9902@gmail.com)
 * License: MIT
 * Created On Sun Aug 27 2023
 **/

import { createStore, defaultStore, Store } from "@im-sang-tae/vanilla";
import { createContext, useContext } from "react";

const StoreContext = createContext<Store | undefined>(undefined);

export const useStore = () => {
  const store = useContext(StoreContext);

  return store || defaultStore;
};

export const SangTaeProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createStore();

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
