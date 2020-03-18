import {STARRED_CREATE, STARRED_REMOVE, STARRED_UPDATE, STARRED_INYECT} from "../actions/starred";
import {findByProperty, replaceFromArray} from "../utils/array";
import {starredInitialState} from "./initialState";

const actions = {
  [STARRED_INYECT]: (state, action) => [].concat(action.payload),

  [STARRED_CREATE]: (state, action) => {
    const item = action.payload;
    const newState = state.slice();
    newState.unshift(item);
    typeof window === "object" &&
      window.localStorage.setItem("starred", JSON.stringify(newState));
    return newState;
  },

  [STARRED_REMOVE]: (state, action) => {
    const key = action.payload;
    const newState = state.filter(item => item.key !== key);
    typeof window === "object" &&
      window.localStorage.setItem("starred", JSON.stringify(newState));
    return newState;
  },

  [STARRED_UPDATE]: (state, action) => replaceFromArray(state, action.payload, findByProperty("key"))
};

/** @type {import("redux").Reducer<import(".").StarredItem[]>} */
function starredReducer(state = starredInitialState, action) {
  const effector = actions[action.type];
  return typeof effector === "function" ? effector(state, action) : state;
}

export default starredReducer;
