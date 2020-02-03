interface IQueryItem {
  active: boolean;
  readonly key: string;
}

interface CutItem extends IQueryItem {
  dimension: string;
  hierarchy: string;
  level: string;
  error?: Error;
  members: MemberItem[];
  membersLoaded: boolean;
}

interface DrilldownItem extends IQueryItem {
  dimension: string;
  hierarchy: string;
  level: string;
  caption: string;
  properties: PropertyItem[];
}

interface FilterItem extends IQueryItem {
  measure: string;
  comparison: FilterComparison;
  inputtedValue: string;
  interpretedValue: number;
}

interface GrowthItem extends IQueryItem {
  level: string;
  measure: string;
}

interface MeasureItem extends IQueryItem {
  measure: string;
}

interface MemberItem extends IQueryItem {
  name: string;
}

interface NamedSetItem extends IQueryItem {
  namedset?: string;
}

interface PropertyItem extends IQueryItem {
  level: string;
  property: string;
}

interface RcaItem extends IQueryItem {
  level1: string;
  level2: string;
  measure: string;
}

interface TopkItem extends IQueryItem {
  amount: number;
  level: string;
  measure: string;
  order: "asc" | "desc";
}

type MeasurableItem = MeasureItem | FilterItem;
