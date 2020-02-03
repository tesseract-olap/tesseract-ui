/** @type {(state: ExplorerState) => LoadingState} */
export function selectLoadingState(state) {
  return state.explorerLoading;
}
