import {Cube} from "@datawheel/tesseract-client";
import {QueryOptions} from "@datawheel/tesseract-client/dist/dts/common";

import {QueryState} from "./queryReducer";
import {TAB_RAW, TAB_TABLE, TAB_TREE} from "./uiReducer";
import {
  STATUS_EMPTY,
  STATUS_FETCHING,
  STATUS_SUCCESS,
  STATUS_FAILURE
} from "./loadingReducer";

export default function explorerReducer(
  state: ExplorerState,
  action: ReduxAction
): ExplorerState;

export interface ReduxAction {
  type: string;
  payload: any;
}

export interface ExplorerState {
  explorerCubes: CubesState;
  explorerDataset: DatasetState;
  explorerLoading: LoadingState;
  explorerQuery: QueryState;
  explorerUi: UiState;
}

export interface CubesState {
  available: Cube[];
  current: Cube;
}

export interface DatasetState {
  data: any[];
  error: Error;
  loading: boolean;
  options: QueryOptions;
  url: string;
}

export interface LoadingState {
  action: string;
  error: Error;
  status: STATUS_EMPTY | STATUS_FETCHING | STATUS_SUCCESS | STATUS_FAILURE;
}

export interface UiState {
  darkTheme: boolean;
  debugDrawer: boolean;
  queryOptions: boolean;
  serverStatus: string;
  serverUrl: string;
  serverVersion: string;
  tab: TAB_TABLE | TAB_RAW | TAB_TREE;
}
