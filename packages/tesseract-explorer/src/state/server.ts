import {
  Format,
  type PlainCube,
  PyTesseractDataSource,
  TesseractDataSource,
  MondrianDataSource
} from "@datawheel/olap-client";
import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {ExplorerState} from "./store";
import {getKeys, getValues} from "../utils/object";

export interface ServerState {
  cubeMap: Record<string, PlainCube>;
  endpoint: string;
  localeOptions: string[];
  online: boolean | undefined;
  software: string;
  url: string;
  version: string;
}

const name = "explorerServer";

const initialState: ServerState = {
  cubeMap: {},
  endpoint: "aggregate",
  localeOptions: ["en"],
  online: undefined,
  software: "",
  url: "",
  version: ""
};

export const serverSlice = createSlice({
  name,
  initialState,
  reducers: {

    /**
     * Replaces the specified keys in the ServerState with the provided values.
     */
    updateServer(state, action: PayloadAction<Partial<ServerState>>) {
      return {...state, ...action.payload};
    },

    /**
     * Updates the type of endpoint to use in the current query.
     */
    updateEndpoint(state, action: PayloadAction<string | undefined>) {
      state.endpoint =
        action.payload || (state.endpoint === "aggregate" ? "logiclayer" : "aggregate");
    },

    /**
     * Updates the list of locales supported by the current server.
     */
    updateLocaleList(state, action: PayloadAction<string[]>) {
      state.localeOptions = action.payload;
    }
  }
});

export const serverActions = {
  ...serverSlice.actions
};

// SELECTORS

/**
 * Selector for the root ServerState
 */
export function selectServerState(state: ExplorerState): ServerState {
  return state[name];
}

export const selectServerSoftware = createSelector(
  selectServerState,
  server => server.software
);

export const selectServerEndpoint = createSelector(
  selectServerState,
  server => server.endpoint
);

export const selectServerFormatsEnabled = createSelector(
  selectServerSoftware,
  software => {
    if (software === MondrianDataSource.softwareName) {
      return [Format.csv, Format.json, Format.jsonrecords, Format.xls];
    }
    if (software === PyTesseractDataSource.softwareName) {
      return [Format.csv, Format.jsonarrays, Format.jsonrecords];
    }
    return [Format.csv, Format.jsonarrays, Format.jsonrecords];
  }
);

export const selectServerBooleansEnabled = createSelector(
  selectServerSoftware,
  software => {
    if (software === MondrianDataSource.softwareName) {
      return ["debug", "distinct", "nonempty", "parents", "sparse"];
    }
    if (software === TesseractDataSource.softwareName) {
      return ["debug", "exclude_default_members", "parents", "sparse"];
    }
    return ["debug", "parents"];
  }
);

export const selectOlapCubeMap = createSelector(
  selectServerState,
  server => server.cubeMap
);
export const selectOlapCubeKeys = createSelector(selectOlapCubeMap, getKeys);
export const selectOlapCubeItems = createSelector(selectOlapCubeMap, getValues);
