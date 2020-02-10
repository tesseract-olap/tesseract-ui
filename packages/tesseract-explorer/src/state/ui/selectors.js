import {createSelector} from "reselect";

/**
 * @param {ExplorerState | {explorer: ExplorerState}} state
 * @returns {UiState}
 */
export function selectUiState(state) {
  return "explorer" in state ? state.explorer.explorerUi : state.explorerUi;
}

/**
 * @returns {boolean}
 */
export const selectIsDarkTheme = createSelector(selectUiState, ui => ui.darkTheme);
