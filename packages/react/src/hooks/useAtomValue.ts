/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Thu Sep 28 2023
 **/

import { AtomOrSelectorType } from "@im-sang-tae/vanilla";
import { useState } from "react";
import { useStore } from "src/components";

export default function useAtomValue<T>(atom: AtomOrSelectorType<T>) {
  const store = useStore();
  const [currentState] = useState(store.readAtomValue(atom));

  return currentState;
}
