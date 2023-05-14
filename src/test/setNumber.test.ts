import { defaultStore as store } from "../stateManager";
import { defaultManager as manager } from "../stateManager";

const numberAtom = store.createAtom({ key: "numberAtom", initialState: 1 });
const [getNumber, setNumber] = manager.atomState(numberAtom);

describe("setNumber", () => {
  afterEach(() => {
    setNumber(getNumber() + 1);
  });

  test.each([1, 2, 3, 4])("%s", (number: number) => {
    expect(getNumber()).toBe(number);
  });
});
