import {CUBE_SELECT} from "../actions/cubes";
import {DATASET_FAILURE, DATASET_REQUEST, DATASET_SUCCESS} from "../actions/dataset";

const initialState = {
  data: [],
  error: null,
  loading: true,
  options: {},
  queryObj: null,
  url: ""
};

function datasetReducer(state = initialState, action) {
  switch (action.type) {
    case CUBE_SELECT:
      return initialState;

    case DATASET_REQUEST:
      const queryObj = action.payload;
      const url = queryObj.getPath();
      return {...initialState, queryObj, url};

    case DATASET_SUCCESS:
      return action.payload;

    case DATASET_FAILURE:
      return {...initialState, error: action.payload};

    default:
      return state;
  }
}

export default datasetReducer;
