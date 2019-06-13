import {
  CUBE_FETCH_FAILURE,
  CUBE_FETCH_REQUEST,
  CUBE_FETCH_SUCCESS,
  CUBE_SELECT
} from "../actions/cubes";

const initialState = {
  available: [],
  current: null
};

function cubeReducer(state = initialState, action) {
  switch (action.type) {
    case CUBE_FETCH_REQUEST:
      return {available: [], current: null};

    case CUBE_FETCH_SUCCESS:
      return {available: action.payload, current: action.payload[0]};

    case CUBE_FETCH_FAILURE:
      return {available: [], current: null};

    case CUBE_SELECT:
      return {...state, current: action.payload};

    default:
      return state;
  }
}

export default cubeReducer;
