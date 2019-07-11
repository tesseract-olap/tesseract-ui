import queryReducer from "./queryReducer";
import aggregationReducer from "./aggregationReducer";
import uiReducer from "./uiReducer";
import loadingReducer from "./loadingReducer";
import cubesReducer from "./cubesReducer";
import starredReducer from "./starredReducer";

// this is the same as redux.combineReducers
export default (state = {}, action) => ({
  explorerAggregation: aggregationReducer(state.explorerAggregation, action),
  explorerCubes: cubesReducer(state.explorerCubes, action),
  explorerLoading: loadingReducer(state.explorerLoading, action),
  explorerQuery: queryReducer(state.explorerQuery, action),
  explorerStarred: starredReducer(state.explorerStarred, action),
  explorerUi: uiReducer(state.explorerUi, action),
});
