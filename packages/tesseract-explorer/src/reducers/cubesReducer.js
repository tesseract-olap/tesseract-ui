import {CUBES_UPDATE} from "../actions/cubes";

/** @type {import(".").CubesState} */
const initialState = {};

/** @type {import("redux").Reducer<import(".").CubesState>} */
function cubesReducer(state = initialState, action) {
  switch (action.type) {
    case CUBES_UPDATE:
      return {...action.payload};

    default:
      return state;
  }
}

export default cubesReducer;
