import {STARRED_CREATE, STARRED_REMOVE, STARRED_UPDATE} from "../actions/starred";
import {findByProperty, replaceFromArray} from "../utils/array";
import {starredInitialState} from "./initialState";

/** @type {import("redux").Reducer<import(".").StarredItem[]>} */
function starredReducer(state = starredInitialState, action) {
  switch (action.type) {
    case STARRED_CREATE: {
      const item = action.payload;
      const newState = state.slice();
      newState.unshift(item);
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
