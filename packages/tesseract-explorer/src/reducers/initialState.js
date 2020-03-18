import {STATUS_FETCHING, UITAB_TABLE} from "../actions/ui";

/** @type {import(".").AggregationState} */
export const aggregationInitialState = {
  aggregateUrl: "",
  data: [],
  emptyDataset: false,
  jsCall: "",
  logicLayerUrl: "",
  options: {}
};

/** @type {import(".").CubesState} */
export const cubesInitialState = {};

/** @type {import(".").LoadingState} */
export const loadingInitialState = {
  error: null,
  loading: true,
  status: STATUS_FETCHING,
  trigger: null
};

/** @type {import(".").GrowthQueryState} */
export const queryGrowthInitialState = {};

/** @type {import(".").RcaQueryState} */
export const queryRcaInitialState = {};

/** @type {import(".").TopkQueryState} */
export const queryTopkInitialState = {
  order: "desc"
};

/** @type {import(".").QueryState} */
export const queryInitialState = {
  cube: "",
  cuts: [],
  debug: false,
  distinct: true,
  drilldowns: [],
  filters: [],
  growth: queryGrowthInitialState,
  locale: "",
  measures: [],
  nonempty: true,
  parents: false,
  rca: queryRcaInitialState,
  sparse: false,
  topk: queryTopkInitialState
};

/** @type {import(".").StarredItem[]} */
export const starredInitialState = [];

/** @type {import(".").UiState} */
export const uiInitialState = {
  darkTheme: false,
  debugDrawer: false,
  localeOptions: ["en"],
  serverOnline: undefined,
  serverSoftware: "",
  serverUrl: "",
  serverVersion: "",
  starredDrawer: false,
  tab: UITAB_TABLE
};
