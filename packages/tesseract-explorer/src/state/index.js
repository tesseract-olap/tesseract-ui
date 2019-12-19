import {queryReducer, queryInitialState} from "./query/reducer";
import {aggregationReducer, aggregationInitialState} from "./aggregation/reducer";
import {uiReducer, uiInitialState} from "./ui/reducer";
import {loadingReducer, loadingInitialState} from "./loading/reducer";
import {cubesReducer, cubesInitialState} from "./cubes/reducer";
import {starredReducer, starredInitialState} from "./starred/reducer";

/** @type {ExplorerState} */
export const initialState = {
  explorerAggregation: aggregationInitialState,
  explorerCubes: cubesInitialState,
  explorerLoading: loadingInitialState,
  explorerQuery: queryInitialState,
  explorerStarred: starredInitialState,
  explorerUi: uiInitialState
};

/** @type {import("redux").Reducer<ExplorerState>} */
export function explorerReducer(state = initialState, action) {
  return {
    explorerAggregation: aggregationReducer(state.explorerAggregation, action),
    explorerCubes: cubesReducer(state.explorerCubes, action),
    explorerLoading: loadingReducer(state.explorerLoading, action),
    explorerQuery: queryReducer(state.explorerQuery, action),
    explorerStarred: starredReducer(state.explorerStarred, action),
    explorerUi: uiReducer(state.explorerUi, action)
  };
}
