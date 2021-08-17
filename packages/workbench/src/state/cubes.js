import {atom, selectorFamily} from "recoil";
import {buildCube, buildTypedObject} from "./structs";

const key = "state/cubes";

export const cubesAtom = atom({
  key: `${key}/atom`,
  default: buildTypedObject(buildCube("undefined"))
});

export const selectCube = selectorFamily({
  key: `${key}/selectCube`,
  get: param => opts => {
    const state = opts.get(cubesAtom);
    return state[String(param)];
  },
  set: param => (opts, newValue) => {
    const key = String(param);
    const state = opts.get(cubesAtom);
    const item = state[key];
    opts.set(cubesAtom, {...state, [key]: {...item, ...newValue}});
  }
});
