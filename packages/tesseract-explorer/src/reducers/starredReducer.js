import {STARRED_ADD, STARRED_REMOVE} from "../actions/starred";
import {removeFromArray} from "../utils/array";

const initialState = {
  index: {a:1},
  items: []
};

function starredReducer(state = initialState, action) {
  switch (action.type) {
    case STARRED_ADD: {
      const items = [].concat(action.payload, state.items);
      return {...state, items};
    }

    case STARRED_REMOVE: {
      const items = removeFromArray(state.items, action.payload);
      return {...state, items};
    }

    default:
      return state;
  }
}

export default starredReducer;
