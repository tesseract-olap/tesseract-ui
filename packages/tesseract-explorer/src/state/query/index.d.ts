interface QueryItem {
  active: boolean;
  readonly key: string;
}

interface CutItem extends QueryItem {
  dimension: string;
  hierarchy: string;
  level: string;
  error?: Error;
  members: MemberItem[];
  membersLoaded: boolean;
}

interface DrilldownItem extends QueryItem {
  dimension: string;
  hierarchy: string;
  level: string;
}

interface FilterItem extends QueryItem {
  measure: string;
  comparison: FilterComparison;
  inputtedValue: string;
  interpretedValue: number;
}

interface GrowthItem {
  level?: string;
  measure?: string;
}

interface MeasureItem extends QueryItem {
  measure: string;
}

interface MemberItem extends QueryItem {
  name: string;
}

interface NamedSetItem extends QueryItem {
  namedset?: string;
}

interface RcaItem {
  level1?: string;
  level2?: string;
  measure?: string;
}

interface TopkItem {
  amount?: number;
  level?: string;
  measure?: string;
  order?: "asc" | "desc";
}

type MeasurableItem = MeasureItem | FilterItem;
type DrillableItem = DrilldownItem;
