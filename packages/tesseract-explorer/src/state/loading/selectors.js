/**
 * @param {TessExpl.State.ExplorerState | {explorer: TessExpl.State.ExplorerState}} state
 * @returns {TessExpl.State.LoadingState}
 */
export function selectLoadingState(state) {
  return "explorer" in state ? state.explorer.explorerLoading : state.explorerLoading;
}
