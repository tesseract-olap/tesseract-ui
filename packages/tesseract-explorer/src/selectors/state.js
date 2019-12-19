/**
 * @type {(state: ExplorerState) => AggregationState}
 */
export const selectAggregationState = state => state.explorerAggregation;

/**
 * @type {(state: ExplorerState) => CubesState}
 */
export const selectCubesState = state => state.explorerCubes;

/**
 * @type {(state: ExplorerState) => LoadingState}
 */
export const selectLoadingState = state => state.explorerLoading;

/**
 * @type {(state: ExplorerState) => QueryState}
 */
export const selectQueryState = state => state.explorerQuery;

/**
 * @type {(state: ExplorerState) => StarredItem[]}
 */
export const selectStarredState = state => state.explorerStarred;

/**
 * @type {(state: ExplorerState) => UiState}
 */
export const selectUiState = state => state.explorerUi;

