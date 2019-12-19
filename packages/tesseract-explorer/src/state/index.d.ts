interface ExplorerState {
  explorerAggregation: AggregationState;
  explorerCubes: CubesState;
  explorerLoading: LoadingState;
  explorerQuery: QueryState;
  explorerStarred: StarredItem[];
  explorerUi: UiState;
}

interface AggregationState {
  aggregateUrl: string;
  data: any[];
  emptyDataset: boolean;
  jsCall: string;
  logicLayerUrl: string;
  options: any;
}

interface CubesState {
  [name: string]: JSONCube;
}

interface LoadingState {
  error: string | null;
  loading: boolean;
  status: string;
  trigger: string | null;
}

interface QueryState {
  cube: string;
  cuts: CutItem[];
  debug: boolean;
  distinct: boolean;
  drilldowns: DrilldownItem[];
  filters: FilterItem[];
  growth: GrowthItem;
  locale: string | undefined;
  measures: MeasureItem[];
  nonempty: boolean;
  parents: boolean;
  rca: RcaItem;
  sparse: boolean;
  topk: TopkItem;
}

interface UiState {
  darkTheme: boolean;
  debugDrawer: boolean;
  localeOptions: string[];
  serverOnline: boolean | undefined;
  serverSoftware: string;
  serverUrl: string;
  serverVersion: string;
  starredDrawer: boolean;
  tab: string;
}
