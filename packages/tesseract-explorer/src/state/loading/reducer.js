import {STATUS_FAILURE, STATUS_FETCHING, STATUS_SUCCESS} from "../../enums";

/** @type {TessExpl.State.LoadingState} */
export const loadingInitialState = {
  error: null,
  loading: true,
  status: STATUS_FETCHING,
  trigger: null
};

/** @type {import("redux").Reducer<TessExpl.State.LoadingState>} */
export function loadingReducer(state = loadingInitialState, action) {
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
  else if (type.endsWith(":MESSAGE")) {
    return {
      ...state,
      message: action.payload
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
