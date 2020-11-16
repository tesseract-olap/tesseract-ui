interface IQueryItem {
  active: boolean;
  readonly key: string;
}

interface CutItem extends IQueryItem {
  dimension: string;
  error?: Error;
  fullName: string;
  hierarchy: string;
  level: string;
  members: MemberItem[];
  membersLoaded: boolean;
  uniqueName: string;
}

interface DrilldownItem extends IQueryItem {
  captionProperty: string;
  dimension: string;
  dimType: string;
  fullName: string;
  hierarchy: string;
  level: string;
  properties: PropertyItem[];
  uniqueName: string;
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
  aggType: string;
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
  name: string;
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
