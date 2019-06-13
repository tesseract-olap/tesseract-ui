import {Level, Member, Measure} from "@datawheel/tesseract-client";
import {ReduxAction} from "..";

export default function queryReducer(state: QueryState, action: ReduxAction): QueryState;

export interface QueryState {
  cuts: QueryCut[];
  drilldowns: QueryDrilldown[];
  filters: [];
  growth: {
    level?: Level;
    measure?: Measure;
  };
  measures: QueryMeasure[];
  parents: boolean;
  rca: {
    level1?: Level;
    level2?: Level;
    measure?: Measure;
  };
  top: {
    amount: number;
    level?: Level;
    measure?: Measure;
    descendent: boolean;
  };
}

interface QueryCut {
  active: boolean;
  allMembers: Member[];
  drillable: Level;
  error: Error;
  key: string;
  members: Member[];
}

interface QueryDrilldown {
  active: boolean;
  drillable: Level;
  key: string;
}

interface QueryMeasure {
  active: boolean;
  key: string;
  measure: Measure;
}
