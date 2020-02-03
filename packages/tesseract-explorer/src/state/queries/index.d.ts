interface QueryItem {
  created: string;
  isDirty: boolean;
  key: string;
  label: string;
  params: QueryParams;
  result: QueryResult;
}

interface QueryParams {
  booleans: Record<string, boolean>;
  cube: string;
  cuts: Record<string, CutItem>;
  drilldowns: Record<string, DrilldownItem>;
  filters: Record<string, FilterItem>;
  growth: Record<string, GrowthItem>;
  locale: string | undefined;
  measures: Record<string, MeasureItem>;
  rca: Record<string, RcaItem>;
  topk: Record<string, TopkItem>;
}

interface QueryResult {
  chartConfig: string;
  chartType: string;
  data: any[];
  error: string | null;
  pivotColumns: string | undefined;
  pivotRows: string | undefined;
  pivotValues: string | undefined;
  sourceCall: string | undefined;
  status: number;
  urlAggregate: string | undefined;
  urlLogicLayer: string | undefined;
}
