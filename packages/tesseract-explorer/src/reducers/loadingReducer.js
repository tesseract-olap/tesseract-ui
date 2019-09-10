export const STATUS_FETCHING = "FETCHING";
export const STATUS_SUCCESS = "SUCCESS";
export const STATUS_FAILURE = "FAILURE";

/** @type {import(".").LoadingState} */
const initialState = {
  error: null,
  loading: true,
  status: STATUS_FETCHING,
  trigger: null
};

/** @type {import("redux").Reducer<import(".").LoadingState>} */
function loadingReducer(state = initialState, action) {
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
