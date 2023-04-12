import {ActionReducerMapBuilder, AnyAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import type {ExplorerState} from "./store";

export const LOADINGSTATUS = {
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE"
} as const;

export type LoadingStatus = typeof LOADINGSTATUS[keyof (typeof LOADINGSTATUS)];

export interface LoadingMessage {
  type: string;
  [params: string]: string;
}

export interface LoadingState {
  error: string | null;
  loading: boolean;
  message?: LoadingMessage;
  status: LoadingStatus;
  trigger: string | null;
}

const name = "explorerLoading";

const initialState: LoadingState = {
  error: null,
  loading: true,
  status: LOADINGSTATUS.FETCHING,
  trigger: null
};

export const loadingSlice = createSlice({
  name,
  initialState,
  reducers: {
    setLoadingMessage(state, action: PayloadAction<LoadingMessage>) {
      state.message = action.payload;
    }
  },
  extraReducers(builder: ActionReducerMapBuilder<LoadingState>) {
    builder
      .addMatcher(isFetchingAction, (state, action) => {
        state.error = null;
        state.loading = true;
        state.status = LOADINGSTATUS.FETCHING;
        state.trigger = action.type;
      })
      .addMatcher(isSuccessAction, (state, action) => {
        state.error = null;
        state.loading = false;
        state.status = LOADINGSTATUS.SUCCESS;
        state.trigger = action.type;
      })
      .addMatcher(isFailureAction, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.status = LOADINGSTATUS.FAILURE;
        state.trigger = action.type;
      });
  }
});

export const loadingActions = {
  ...loadingSlice.actions,

  setLoadingState(status: LoadingStatus, message?: string) {
    return {type: `${name}/setLoadingState:${status}`, payload: message} as const;
  }
};

// SELECTORS

/**
 * Selector for the root LoadingState
 */
export function selectLoadingState(state: ExplorerState): LoadingState {
  return state[name];
}

// UTILS

/**
 * Typeguard for Actions that set the LoadingStatus to FETCHING
 */
function isFetchingAction(action: AnyAction): action is PayloadAction<string> {
  return action.type.endsWith(`:${LOADINGSTATUS.FETCHING}`);
}

/**
 * Typeguard for Actions that set the LoadingStatus to FAILURE
 */
function isFailureAction(action: AnyAction): action is PayloadAction<string> {
  return action.type.endsWith(`:${LOADINGSTATUS.FAILURE}`);
}

/**
 * Typeguard for Actions that set the LoadingStatus to SUCCESS
 */
function isSuccessAction(action: AnyAction): action is PayloadAction<string> {
  return action.type.endsWith(`:${LOADINGSTATUS.SUCCESS}`);
}
