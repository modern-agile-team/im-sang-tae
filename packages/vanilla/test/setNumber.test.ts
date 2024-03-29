/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Thu Jun 08 2023
 **/

import { atomState, createAtom, createAtomFamily } from "../src";

const numberAtom = createAtom({ key: "numberAtom", initialState: 0 });
const numberSelector = createAtom({
  key: "numberSelector",
  async get({ get }) {
    return get(numberAtom) + 1;
  },
});

const numberAtomFamily = createAtomFamily<number, number>({
  key: "numberAtomFamily",
  initialState(param) {
    return 1 + param;
  },
});

const numberSelectorFamily = createAtomFamily<number, number>({
  key: "numberSelectorFamily",
  get:
    (param: number) =>
    ({ get }) => {
      return get(numberAtom) + param;
    },
});

const [getNumber, setNumber] = atomState(numberAtom);
const [getNumberWithSelector, setNumberS] = atomState(numberSelector);
const [getNumberWithAtomFamily, setNumberWithAtomFamily] = atomState(numberAtomFamily(10));
const [getNumberWithSelectorFamily, setNumberWithSelectorFamily] = atomState(numberSelectorFamily(10));

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
    const number = await getNumberWithSelector();
    setNumberS(number + 1);
  });

  test.each([6, 7, 8, 9])("%s", async (number: number) => {
    expect(await getNumberWithSelector()).toBe(number);
  });
});

describe("setNumberWithCallback", () => {
  beforeEach(async () => {
    setNumberS(async (prev) => {
      return (await prev) + 1;
    });
  });

  test.each([10, 11, 12, 13])("%s", async (number: number) => {
    expect(await getNumberWithSelector()).toBe(number);
  });
});

describe("setNumberWithAtomFamily", () => {
  beforeEach(() => {
    setNumberWithAtomFamily((prev) => {
      return prev + 1;
    });
  });

  test.each([12, 13, 14, 15])("%s", (number: number) => {
    expect(getNumberWithAtomFamily()).toBe(number);
  });
});

describe("setNumberWithSelectorFamily", () => {
  beforeEach(() => {
    setNumberWithSelectorFamily((prev) => {
      return prev + 1;
    });
  });

  test.each([15, 16, 17, 18])("%s", (number: number) => {
    expect(getNumberWithSelectorFamily()).toBe(number);
  });
});
