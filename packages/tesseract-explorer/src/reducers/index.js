import cubeReducer from "./cubeReducer";
import datasetReducer from "./datasetReducer";
import loadingReducer from "./loadingReducer";
import queryReducer from "./queryReducer";
import uiReducer from "./uiReducer";

// this is the same as redux.combineReducers
export default (state = {}, action) => ({
  explorerCubes: cubeReducer(state.explorerCubes, action),
  explorerDataset: datasetReducer(state.explorerDataset, action),
  explorerLoading: loadingReducer(state.explorerLoading, action),
  explorerQuery: queryReducer(state.explorerQuery, action),
  explorerUi: uiReducer(state.explorerUi, action)
});
