import ISO6391 from "iso-639-1";
import {createSelector} from "reselect";

/** @type {(state: ExplorerState) => ServerState} */
export function selectServerState(state) {
  return state.explorerServer;
}

export const selectOlapCubeMap = createSelector(
  selectServerState,
  server => server.cubeMap
);
export const selectOlapCubeKeys = createSelector(selectOlapCubeMap, cubes =>
  Object.keys(cubes)
);
export const selectOlapCubeItems = createSelector(selectOlapCubeMap, cubes =>
  Object.values(cubes)
);

export const selectLocaleOptions = createSelector(selectServerState, server =>
  ISO6391.getLanguages(server.localeOptions).map(locale => ({
    label: locale.nativeName,
    value: locale.code
  }))
);
