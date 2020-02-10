/**
 * @param {ExplorerState | {explorer: ExplorerState}} state
 * @returns {LoadingState}
 */
export function selectLoadingState(state) {
  return "explorer" in state ? state.explorer.explorerLoading : state.explorerLoading;
}
