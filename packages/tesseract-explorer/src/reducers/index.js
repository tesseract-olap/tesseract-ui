import aggregationReducer from "./aggregationReducer";
import cubesReducer from "./cubesReducer";
import loadingReducer from "./loadingReducer";
import queryReducer from "./queryReducer";
import starredReducer from "./starredReducer";
import uiReducer from "./uiReducer";
import initialStateBuilder from "../utils/initialState";

// this is the same as redux.combineReducers
export default (state, action) => {
  const explorerState = (state.explorer || state) ?? initialStateBuilder();
  return {
    explorerAggregation: aggregationReducer(explorerState.explorerAggregation, action),
    explorerCubes: cubesReducer(explorerState.explorerCubes, action),
    explorerLoading: loadingReducer(explorerState.explorerLoading, action),
    explorerQuery: queryReducer(explorerState.explorerQuery, action),
    explorerStarred: starredReducer(explorerState.explorerStarred, action),
    explorerUi: uiReducer(explorerState.explorerUi, action),
  };
};
