import ISO6391 from "iso-639-1";
import {createSelector} from "reselect";
import {getKeys, getValues} from "../helpers";

/**
 * @param {ExplorerState | {explorer: ExplorerState}} state
 * @returns {ServerState}
 */
export function selectServerState(state) {
  return "explorer" in state ? state.explorer.explorerServer : state.explorerServer;
}

export const selectOlapCubeMap = createSelector(
  selectServerState,
  server => server.cubeMap
);
export const selectOlapCubeKeys = createSelector(selectOlapCubeMap, getKeys);
export const selectOlapCubeItems = createSelector(selectOlapCubeMap, getValues);

export const selectLocaleOptions = createSelector(selectServerState, server =>
  ISO6391.getLanguages(server.localeOptions).map(locale => ({
    label: locale.nativeName,
    value: locale.code
  }))
);
