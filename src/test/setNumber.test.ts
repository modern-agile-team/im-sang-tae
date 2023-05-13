import { defaultStore as store } from "../stateManager";
import { defaultManager as manager } from "../stateManager";

const numberAtom = store.createAtom({ key: "numberAtom", state: 1 });
const [getNumber, setNumber] = manager.getAndSetRSState(numberAtom);

describe("setNumber", () => {
  afterEach(() => {
    setNumber(getNumber() + 1);
  });

  test.each([1, 2, 3, 4])("%s", (number: number) => {
    expect(getNumber()).toBe(number);
  });
});
