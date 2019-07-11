import {STARRED_CREATE, STARRED_REMOVE} from "../actions/starred";

/**
 * @typedef {import(".").StarredItem[]} StarredState
 */

/** @type {StarredState} */
const initialState = JSON.parse(localStorage.getItem("starred") || "[]");

/** @type {import("redux").Reducer<StarredState>} */
function starredReducer(state = initialState, action) {
  switch (action.type) {
    case STARRED_CREATE: {
      const item = action.payload;
      const newState = [].concat(item, state);
      localStorage.setItem("starred", JSON.stringify(newState));
      return newState;
    }

    case STARRED_REMOVE: {
      const key = action.payload;
      const newState = state.filter(item => item.key !== key);
      localStorage.setItem("starred", JSON.stringify(newState));
      return newState;
    }

    default:
      return state;
  }
}

export default starredReducer;
