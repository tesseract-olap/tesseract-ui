import {loadingInitialState, loadingReducer} from "./loading/reducer";
import {queriesInitialState, queriesReducer} from "./queries/reducer";
import {serverInitialState, serverReducer} from "./server/reducer";

/** @type {TessExpl.State.ExplorerState} */
export const initialState = {
  explorerServer: serverInitialState,
  explorerLoading: loadingInitialState,
  explorerQueries: queriesInitialState
};

/** @type {import("redux").Reducer<TessExpl.State.ExplorerState>} */
export function explorerReducer(state = initialState, action) {
  return {
    explorerServer: serverReducer(state.explorerServer, action),
    explorerLoading: loadingReducer(state.explorerLoading, action),
    explorerQueries: queriesReducer(state.explorerQueries, action)
  };
}
