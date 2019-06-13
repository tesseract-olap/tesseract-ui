export const STATUS_EMPTY = "EMPTY";
export const STATUS_FETCHING = "FETCHING";
export const STATUS_SUCCESS = "SUCCESS";
export const STATUS_FAILURE = "FAILURE";

const initialState = {
  action: null,
  error: null,
  status: STATUS_FETCHING
};

function loadingReducer(state = initialState, action) {
  const type = action.type;

  if (/_REQUEST$/.test(type)) {
    return {
      action,
      error: null,
      status: STATUS_FETCHING
    };
  }
  else if (/_SUCCESS$/.test(type)) {
    return {
      action: state.action,
      error: null,
      status: STATUS_SUCCESS
    };
  }
  else if (/_FAILURE$/.test(type)) {
    return {
      action: state.action,
      error: action.payload,
      status: STATUS_FAILURE
    };
  }

  return state;
}

export default loadingReducer;
