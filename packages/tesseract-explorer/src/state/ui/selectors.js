import {createSelector} from "reselect";

/**
 * @param {TessExpl.State.ExplorerState | {explorer: TessExpl.State.ExplorerState}} state
 * @returns {TessExpl.State.UiState}
 */
export function selectUiState(state) {
  return "explorer" in state ? state.explorer.explorerUi : state.explorerUi;
}

/**
 * @returns {boolean}
 */
export const selectIsDarkTheme = createSelector(selectUiState, ui => ui.darkTheme);
