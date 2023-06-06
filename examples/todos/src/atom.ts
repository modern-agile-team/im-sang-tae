/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 30 2023
 **/

import { defaultStore } from "im-sang-tae";

type TodoType = {
  key: number;
  value: string;
  checked: boolean;
};

export const todoList = defaultStore.createAtom<TodoType[]>({
  key: "todoList",
  initialState: [],
});
