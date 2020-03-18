import aggregationReducer from "./aggregationReducer";
import cubesReducer from "./cubesReducer";
import loadingReducer from "./loadingReducer";
import queryReducer from "./queryReducer";
import starredReducer from "./starredReducer";
import uiReducer from "./uiReducer";

// this is the same as redux.combineReducers
export default (state, action) => {
  state = state ?? {};
  return {
    explorerAggregation: aggregationReducer(state.explorerAggregation, action),
    explorerCubes: cubesReducer(state.explorerCubes, action),
    explorerLoading: loadingReducer(state.explorerLoading, action),
    explorerQuery: queryReducer(state.explorerQuery, action),
    explorerStarred: starredReducer(state.explorerStarred, action),
    explorerUi: uiReducer(state.explorerUi, action)
  };
};
