/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").AggregationState}
 */
export const selectAggregationState = state =>
  state.explorer ? state.explorer.explorerAggregation : state.explorerAggregation;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").CubesState}
 */
export const selectCubesState = state =>
  state.explorer ? state.explorer.explorerCubes : state.explorerCubes;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").LoadingState}
 */
export const selectLoadingState = state =>
  state.explorer ? state.explorer.explorerLoading : state.explorerLoading;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").QueryState}
 */
export const selectQueryState = state =>
  state.explorer ? state.explorer.explorerQuery : state.explorerQuery;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").StarredItem[]}
 */
export const selectStarredState = state =>
  state.explorer ? state.explorer.explorerStarred : state.explorerStarred;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").UiState}
 */
export const selectUiState = state =>
  state.explorer ? state.explorer.explorerUi : state.explorerUi;
