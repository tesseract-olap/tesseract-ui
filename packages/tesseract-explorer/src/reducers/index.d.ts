import {
  AdaptedCube,
  AdaptedDimension,
  AdaptedHierarchy,
  AdaptedLevel,
  AdaptedMeasure,
  AdaptedMember
} from "@datawheel/olap-client";

type JSONCube = AdaptedCube;
type JSONDimension = AdaptedDimension;
type JSONHierarchy = AdaptedHierarchy;
type JSONLevel = AdaptedLevel;
type JSONMeasure = AdaptedMeasure;
type JSONMember = AdaptedMember;

interface QueryItem {
  active: boolean;
  readonly key: string;
}

interface DrilldownItem extends QueryItem {
  dimension: string;
  hierarchy: string;
  level: string;
}

interface CutItem extends QueryItem {
  dimension: string;
  hierarchy: string;
  level: string;
  error?: Error;
  members: MemberItem[];
  membersLoaded: boolean;
}

interface MeasureItem extends QueryItem {
  measure: string;
}

interface FilterItem extends QueryItem {
  measure: string;
  comparison: FilterComparison;
  inputtedValue: string;
  interpretedValue: number;
}

interface NamedSetItem extends QueryItem {
  namedset?: string;
}

type MeasurableItem = MeasureItem | FilterItem;
type DrillableItem = DrilldownItem;

interface MemberItem extends QueryItem {
  name: string;
}

interface StarredItem {
  date: string;
  key: string;
  label: string;
  query: QueryState;
}

interface GrowthQueryState {
  level?: string;
  measure?: string;
}

interface RcaQueryState {
  level1?: string;
  level2?: string;
  measure?: string;
}

interface TopkQueryState {
  amount?: number;
  level?: string;
  measure?: string;
  order?: "asc" | "desc";
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
  growth: GrowthQueryState;
  locale: string | undefined;
  measures: MeasureItem[];
  nonempty: boolean;
  parents: boolean;
  rca: RcaQueryState;
  sparse: boolean;
  topk: TopkQueryState;
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

interface ExplorerState {
  explorerAggregation: AggregationState;
  explorerCubes: CubesState;
  explorerLoading: LoadingState;
  explorerQuery: QueryState;
  explorerStarred: StarredItem[];
  explorerUi: UiState;
}
