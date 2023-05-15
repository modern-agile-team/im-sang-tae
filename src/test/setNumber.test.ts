import { defaultStateManger, defaultStore } from "../stateManager";

const numberAtom = defaultStore.createAtom({ key: "numberAtom", initialState: 1 });
const [getNumber, setNumber] = defaultStateManger.atomState(numberAtom);

describe("setNumber", () => {
  afterEach(() => {
    setNumber(getNumber() + 1);
  });

  test.each([1, 2, 3, 4])("%s", (number: number) => {
    expect(getNumber()).toBe(number);
  });
});
