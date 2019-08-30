import {AggregationState} from "./aggregationReducer";
import {CubesState} from "./cubesReducer";
import {LoadingState} from "./loadingReducer";
import {QueryState} from "./queryReducer";
import {StarredState} from "./starredReducer";
import {UiState} from "./uiReducer";

type DrillableItem = DrilldownItem | CutItem;
type MeasurableItem = MeasureItem | FilterItem;

interface QueryItem {
  active: boolean;
  readonly key: string;
}

interface CutItem extends QueryItem {
  drillable: string;
  error?: Error;
  members: MemberItem[];
  membersLoaded: boolean;
}

interface DrilldownItem extends QueryItem {
  drillable: string;
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

interface MemberItem extends QueryItem {
  name: string;
}

interface StarredItem {
  date: string;
  key: string;
  label: string;
  query: QueryState;
}

interface ExplorerState {
  explorerAggregation: AggregationState;
  explorerCubes: CubesState;
  explorerLoading: LoadingState;
  explorerQuery: QueryState;
  explorerStarred: StarredState;
  explorerUi: UiState;
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
