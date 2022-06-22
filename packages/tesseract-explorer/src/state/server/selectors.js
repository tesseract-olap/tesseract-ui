import {Format, TesseractDataSource} from "@datawheel/olap-client";
import ISO6391 from "iso-639-1";
import {createSelector} from "reselect";
import {getKeys, getValues} from "../helpers";

/**
 * @param {TessExpl.State.ExplorerState | {explorer: TessExpl.State.ExplorerState}} state
 * @returns {TessExpl.State.ServerState}
 */
export function selectServerState(state) {
  return "explorer" in state ? state.explorer.explorerServer : state.explorerServer;
}

export const selectServerSoftware = createSelector(selectServerState, server => server.software);

export const selectServerEndpoint = createSelector(selectServerState, server => server.endpoint);

export const selectServerFormatsEnabled = createSelector(
  selectServerSoftware,
  software => software === TesseractDataSource.softwareName
    ? [Format.csv, Format.jsonarrays, Format.jsonrecords]
    : [Format.csv, Format.json, Format.jsonrecords, Format.xls]
);

export const selectServerBooleansEnabled = createSelector(
  selectServerSoftware,
  software => software === TesseractDataSource.softwareName
    ? ["debug", "exclude_default_members", "parents", "sparse"]
    : ["debug", "distinct", "nonempty", "parents", "sparse"]
);

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
