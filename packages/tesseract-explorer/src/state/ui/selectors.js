
import {createSelector} from "reselect";

/** @type {(state: ExplorerState) => UiState} */
export function selectUiState(state) {
  return state.explorerUi;
}


export const selectIsDarkTheme = createSelector(selectUiState, ui => ui.darkTheme);
