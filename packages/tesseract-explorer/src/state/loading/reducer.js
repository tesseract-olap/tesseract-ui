export const STATUS_FETCHING = "FETCHING";
export const STATUS_SUCCESS = "SUCCESS";
export const STATUS_FAILURE = "FAILURE";


export const LOADING_SETMESSAGE = "explorer/LOADING/SET_MESSAGE";
export const LOADING_SETSTATUS = "explorer/LOADING/SET_STATUS";


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
  // TODO: reevaluate trigger
  const trigger = (action.action || action).type;

  if (type === LOADING_SETMESSAGE) {
    return {
      ...state,
      message: action.payload
    };
  }
  else if (type.endsWith(":REQUEST")) {
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
