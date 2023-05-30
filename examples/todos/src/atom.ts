/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 30 2023
 **/

import { getDefaultStore } from "im-sang-tae";

const defaultStore = getDefaultStore();

type TodoType = {
  key: number;
  value: string;
  checked: boolean;
};

export const todoList = defaultStore.createAtom<TodoType[]>({
  key: "todoList",
  initialState: [],
});
