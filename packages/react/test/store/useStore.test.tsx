/**
 * Author: HyunWoo Park (bagh9902@gmail.com)
 * License: MIT
 * Created On Sun Aug 27 2023
 **/

import { SangTaeProvider, useStore } from "../../src";
import { render, renderHook } from "@testing-library/react";

describe("useStore", () => {
  it("createAtom test", () => {
    render(
      <SangTaeProvider>
        <div></div>
      </SangTaeProvider>
    );

    const {
      result: { current: store },
    } = renderHook(() => useStore());

    const atom = store.createAtom({
      key: "atom",
      initialState: 1,
    });
    expect(store.readAtomValue(atom)).toBe(1);
  });

  //Todo : store 다른 기능들 테스트
});
