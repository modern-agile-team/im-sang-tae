import { defaultStore as store } from "../stateManager";
import { defaultManager as manager } from "../stateManager";

const numberAtom = store.createAtom({ key: "numberAtom", state: 1 });

test("create number atom", () => {
  expect(manager.getRSState(numberAtom)()).toBe(1);
});
