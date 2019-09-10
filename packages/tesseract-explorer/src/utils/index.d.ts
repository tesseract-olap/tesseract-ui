interface SerializedQuery {
  cube: string;
  cuts?: string[];
  debug: boolean;
  distinct: boolean;
  drilldowns: string[];
  filters?: string[];
  growth: any;
  measures: string[];
  nonempty: boolean;
  parents: boolean;
  rca: any;
  sparse: boolean;
  topk: any;
}
