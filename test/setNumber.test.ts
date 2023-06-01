import { defaultStateManger, getDefaultStore } from "../src/index";

const defaultStore = getDefaultStore();

const numberAtom = defaultStore.createAtom({ key: "numberAtom", initialState: 1 });
const numberSelector = defaultStore.createAtom({
  key: "numberSelector",
  async get({ get }) {
    return get(numberAtom) + 1;
  },
});

const [getNumber, setNumber] = defaultStateManger.atomState(numberAtom);
const [getNumberS, setNumberS] = defaultStateManger.atomState(numberSelector);

describe("setNumber", () => {
  afterEach(() => {
    setNumber(getNumber() + 1);
  });

  test.each([1, 2, 3, 4])("%s", (number: number) => {
    expect(getNumber()).toBe(number);
  });
});

describe("setNumberWithAsyncFunction", () => {
  afterEach(async () => {
    const number = await getNumberS();
    setNumberS(number + 1);
  });

  test.each([6, 7, 8, 9])("%s", async (number: number) => {
    expect(await getNumberS()).toBe(number);
  });
});
