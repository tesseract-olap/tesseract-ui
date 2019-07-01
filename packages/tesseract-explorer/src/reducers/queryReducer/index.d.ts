import {AllowedOrder, Level, Measure, Member} from "@datawheel/tesseract-client";
import {ReduxAction} from "..";

export default function queryReducer(state: QueryState, action: ReduxAction): QueryState;

export interface SerializedQuery {
  cube: string;
  measures: string[];
  drilldowns: string[];
  cuts: string[];
  filters: string[];
  growth?: {
    level: string;
    measure: string;
  };
  rca?: {
    level1: string;
    level2: string;
    measure: string;
  };
  top?: {
    amount: number;
    level: string;
    measure: string;
    order: string;
  };
  parents: boolean;
}

export interface QueryState {
  cuts: QueryCut[];
  drilldowns: QueryDrilldown[];
  filters: QueryFilter[];
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
    order: AllowedOrder;
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

interface QueryFilter {
  active: boolean;
  key: string;
  measure: Measure;
  comparison: string;
  inputtedValue: string;
  interpretedValue: number;
}

interface QueryMeasure {
  active: boolean;
  key: string;
  measure: Measure;
}
