import {atom} from "recoil";

const key = "atom/shareddims";

/** @type {import("recoil").RecoilState<Record<string, TessBench.DimensionItem>>} */
export const sharedDimsAtom = atom({
  key,
  default: {}
});
