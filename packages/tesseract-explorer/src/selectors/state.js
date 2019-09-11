/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").AggregationState}
 */
export const selectAggregationState = state => state.explorerAggregation;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").CubesState}
 */
export const selectCubesState = state => state.explorerCubes;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").LoadingState}
 */
export const selectLoadingState = state => state.explorerLoading;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").QueryState}
 */
export const selectQueryState = state => state.explorerQuery;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").StarredItem[]}
 */
export const selectStarredState = state => state.explorerStarred;

/**
 * @type {(state: import("../reducers").ExplorerState) => import("../reducers").UiState}
 */
export const selectUiState = state => state.explorerUi;

