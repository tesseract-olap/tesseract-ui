import {STARRED_CREATE, STARRED_REMOVE, STARRED_UPDATE} from "../actions/starred";
import {replaceFromArray, findByProperty} from "../utils/array";

/** @type {import(".").StarredItem[]} */
export const initialState = [];

/** @type {import("redux").Reducer<import(".").StarredItem[]>} */
function starredReducer(state = initialState, action) {
  switch (action.type) {
    case STARRED_CREATE: {
      const item = action.payload;
      const newState = [].concat(item, state);
      typeof window === "object" &&
        window.localStorage.setItem("starred", JSON.stringify(newState));
      return newState;
    }

    case STARRED_REMOVE: {
      const key = action.payload;
      const newState = state.filter(item => item.key !== key);
      typeof window === "object" &&
        window.localStorage.setItem("starred", JSON.stringify(newState));
      return newState;
    }

    case STARRED_UPDATE: {
      return replaceFromArray(state, action.payload, findByProperty("key"));
    }

    default:
      return state;
  }
}

export default starredReducer;
