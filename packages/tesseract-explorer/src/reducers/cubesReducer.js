import {CUBES_UPDATE} from "../actions/cubes";
import {cubesInitialState} from "./initialState";

/** @type {import("redux").Reducer<import(".").CubesState>} */
function cubesReducer(state = cubesInitialState, action) {
  switch (action.type) {
    case CUBES_UPDATE:
      return {...action.payload};

    default:
      return state;
  }
}

export default cubesReducer;
