import {CUBES_UPDATE} from "./actions";

/** @type {CubesState} */
export const cubesInitialState = {};

/** @type {import("redux").Reducer<CubesState>} */
export function cubesReducer(state = cubesInitialState, action) {
  switch (action.type) {
    case CUBES_UPDATE:
      return {...action.payload};

    default:
      return state;
  }
}
