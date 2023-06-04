import { defaultStateManger, getDefaultStore } from "../src/index";

const defaultStore = getDefaultStore();

const numberAtom = defaultStore.createAtom({ key: "numberAtom", initialState: 0 });
const numberSelector = defaultStore.createAtom({
  key: "numberSelector",
  async get({ get }) {
    return get(numberAtom) + 1;
  },
});
const numberAtomFamily = defaultStore.createAtomFamily<number, number>({
  key: "numberAtomFamily",
  initialState(param) {
    return 1 + param;
  },
});

const numberSelectorFamily = defaultStore.createAtomFamily<number, number>({
  key: "numberSelectorFamily",
  get:
    (param: number) =>
    ({ get }) => {
      return get(numberAtom) + param;
    },
});

const [getNumber, setNumber] = defaultStateManger.atomState(numberAtom);
const [getNumberS, setNumberS] = defaultStateManger.atomState(numberSelector);
const [getNumberAtomFamily, setNumberAtomFamily] = defaultStateManger.atomState(numberAtomFamily(10));
const [getNumberSelectorFamily, setNumberSelectorFamily] = defaultStateManger.atomState(numberSelectorFamily(10));

describe("setNumber", () => {
  beforeEach(() => {
    setNumber(getNumber() + 1);
  });

  test.each([1, 2, 3, 4])("%s", (number: number) => {
    expect(getNumber()).toBe(number);
  });
});

describe("setNumberWithAsyncFunction", () => {
  beforeEach(async () => {
    const number = await getNumberS();
    setNumberS(number + 1);
  });

  test.each([6, 7, 8, 9])("%s", async (number: number) => {
    expect(await getNumberS()).toBe(number);
  });
});

describe("setNumberWithCallback", () => {
  beforeEach(async () => {
    setNumberS(async (prev) => {
      return (await prev) + 1;
    });
  });

  test.each([10, 11, 12, 13])("%s", async (number: number) => {
    expect(await getNumberS()).toBe(number);
  });
});

describe("setNumberWithAtomFamily", () => {
  beforeEach(() => {
    setNumberAtomFamily((prev) => {
      return prev + 1;
    });
  });

  test.each([12, 13, 14, 15])("%s", (number: number) => {
    expect(getNumberAtomFamily()).toBe(number);
  });
});

describe("setNumberWithSelectorFamily", () => {
  beforeEach(() => {
    setNumberSelectorFamily((prev) => {
      return prev + 1;
    });
  });

  test.each([15, 16, 17, 18])("%s", (number: number) => {
    expect(getNumberSelectorFamily()).toBe(number);
  });
});
