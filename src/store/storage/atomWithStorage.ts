import { AtomOrSelectorType, AtomType } from "../../types/store";

export function atomWithStorage<Value = any>(
  atom: AtomOrSelectorType | AtomType,
  storageType: "local" | "session" = "local"
): void {
  //Todo : Selector일 경우 함수 따와서 state 저장
  switch (storageType) {
    //Todo : 로컬, 세션 로직구분
    default:
      break;
  }
}

//Todo : 스토리지 업데이트 기능 추가
