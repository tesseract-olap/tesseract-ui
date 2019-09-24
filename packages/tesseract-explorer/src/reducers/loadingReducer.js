import {STATUS_FAILURE, STATUS_FETCHING, STATUS_SUCCESS} from "../actions/ui";
import {loadingInitialState} from "./initialState";

/** @type {import("redux").Reducer<import(".").LoadingState>} */
function loadingReducer(state = loadingInitialState, action) {
  const type = `${action.type}`;
  const trigger = (action.action || action).type;

  if (type.endsWith(":REQUEST")) {
    return {
      error: null,
      loading: true,
      status: STATUS_FETCHING,
      trigger
    };
  }
  else if (type.endsWith(":SUCCESS")) {
    return {
      error: null,
      loading: false,
      status: STATUS_SUCCESS,
      trigger
    };
  }
  else if (type.endsWith(":FAILURE")) {
    return {
      error: action.payload,
      loading: false,
      status: STATUS_FAILURE,
      trigger
    };
  }

  return state;
}

export default loadingReducer;
