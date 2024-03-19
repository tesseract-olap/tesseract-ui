import {Comparison, Measure, PlainLevel, PlainMeasure, PlainProperty} from "@datawheel/olap-client";
import {asArray} from "./array";
import {parseNumeric, randomKey} from "./string";
import {joinName} from "./transform";


export interface QueryItem {
  created: string;
  isDirty: boolean;
  key: string;
  label: string;
  panel: string | null;
  params: QueryParams;
  result: QueryResult;
}

export interface QueryParams {
  booleans: Record<string, undefined | boolean>;
  cube: string;
  cuts: Record<string, CutItem>;
  drilldowns: Record<string, DrilldownItem>;
  filters: Record<string, FilterItem>;
  locale: string | undefined;
  measures: Record<string, MeasureItem>;
  isPreview: boolean;
  pagiLimit: number;
  pagiOffset: number;
  sortDir: "asc" | "desc";
  sortKey: string | undefined;
}

export interface QueryResult<D = Record<string, string | number>> {
  data: D[];
  types: Record<string, AnyResultColumn>;
  error?: {
    status: number;
    statusText: string;
    response: string;
  };
  headers?: Record<string, string>;
  sourceCall?: string | undefined;
  status: number;
  url: string;
}

interface ResultEntityType {
  level: PlainLevel;
  property: PlainProperty;
  measure: PlainMeasure;
}

export interface ResultColumn<T extends keyof ResultEntityType> {
  label: string;
  localeLabel: string;
  isId: boolean;
  entity: ResultEntityType[T];
  entityType: T;
  valueType: "boolean" | "number" | "string";
  range?: [number, number];
}

export type AnyResultColumn =
  | ResultColumn<"level">
  | ResultColumn<"measure">
  | ResultColumn<"property">;

export interface QueryParamsItem {
  active: boolean;
  readonly key: string;
}

export interface CutItem extends QueryParamsItem {
  dimension: string;
  fullName: string;
  hierarchy: string;
  level: string;
  members: string[];
  uniqueName: string;
}

export interface DrilldownItem extends QueryParamsItem {
  captionProperty: string;
  dimension: string;
  dimType: string;
  fullName: string;
  hierarchy: string;
  level: string;
  properties: PropertyItem[];
  uniqueName: string;
  memberCount: number;
}

export interface FilterItem extends QueryParamsItem {
  measure: string;
  conditionOne: [`${Comparison}`, string, number];
  conditionTwo?: [`${Comparison}`, string, number];
  joint: "and" | "or";
}

export interface MeasureItem extends QueryParamsItem {
  name: string;
}

export interface MemberItem extends QueryParamsItem {
  name: string;
}

export interface NamedSetItem extends QueryParamsItem {
  namedset?: string;
}

export interface PropertyItem extends QueryParamsItem {
  level: string;
  name: string;
  uniqueName: string;
}

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends string | boolean | number | bigint | symbol
    ? T[K]
    : RecursivePartial<T[K]>
}

/**
 * Creates a QueryItem object.
 */
export function buildQuery(
  props: RecursivePartial<QueryItem>
): QueryItem {
  return {
    created: props.created || new Date().toISOString(),
    key: props.key || randomKey(),
    label: props.label || "",
    isDirty: true,
    panel: props.panel || null,
    params: buildQueryParams(props.params || {}),
    result: {
      data: [],
      types: {},
      headers: {},
      sourceCall: "",
      status: 0,
      url: ""
    }
  };
}

/**
 * Creates a QueryParams object.
 */
export function buildQueryParams(props): QueryParams {
  return {
    booleans: props.booleans || {},
    cube: props.cube || "",
    cuts: props.cuts || {},
    drilldowns: props.drilldowns || {},
    filters: props.filters || {},
    isPreview: props.isPreview || false,
    locale: props.locale || "",
    measures: props.measures || {},
    pagiLimit: props.pagiLimit || props.limitAmount || props.limit || 0,
    pagiOffset: props.pagiOffset || props.limitOffset || props.offset || 0,
    sortDir: props.sortDir || props.sortDirection || props.sortOrder || props.order || "desc",
    sortKey: props.sortKey || props.sortProperty || ""
  };
}

/**
 * Creates a CutItem object.
 */
export function buildCut(props): CutItem {
  if (typeof props.toJSON === "function") {
    props = props.toJSON();
  }
  const dimension = `${props.dimension}`;
  const hierarchy = `${props.hierarchy}`;
  const level = `${props.level || props.name}`;
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    dimension,
    fullName: props.fullName || joinName([dimension, hierarchy, level]),
    hierarchy,
    key: props.key || randomKey(),
    level,
    members: Array.isArray(props.members) ? props.members : [],
    uniqueName: props.uniqueName || level
  };
}

/**
 * Creates a DrilldownItem object.
 */
export function buildDrilldown(props): DrilldownItem {
  const dimType = typeof props.dimension === "object"
    ? props.dimension.dimensionType
    : props.dimType;
  if (typeof props.toJSON === "function") {
    props = props.toJSON();
  }
  const dimension = `${props.dimension}`;
  const hierarchy = `${props.hierarchy}`;
  const level = `${props.level || props.name}`;
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    captionProperty: props.captionProperty || "",
    dimension,
    dimType,
    fullName: props.fullName || joinName([dimension, hierarchy, level]),
    hierarchy,
    key: props.key || randomKey(),
    level,
    memberCount: 0,
    properties: asArray(props.properties).map(buildProperty),
    uniqueName: props.uniqueName || props.name || props.level
  };
}

/**
 * Creates a FilterItem object.
 */
export function buildFilter(props: {
  active?: boolean;
  key?: string;
  measure?: Measure | string;
  name?: string;
  const1?: [Comparison, number];
  const2?: [Comparison, number];
  conditionOne?: [`${Comparison}`, string, number];
  conditionTwo?: [`${Comparison}`, string, number];
  comparison?: string;
  inputtedValue?: string;
  interpretedValue?: string;
  joint?: string;
}): FilterItem {
  return {
    key: props.key || randomKey(),
    active: typeof props.active === "boolean" ? props.active : true,
    measure: Measure.isMeasure(props.measure)
      ? props.measure.name
      : props.measure || `${props.name}`,
    conditionOne: props.conditionOne || [
      props.const1 ? `${props.const1[0]}` : `${Comparison.GT}`,
      props.const1 ? props.const1[1].toString() : props.inputtedValue || "0",
      props.const1 ? props.const1[1] : parseNumeric(props.interpretedValue, 0)
    ],
    conditionTwo: props.conditionTwo || [
      props.const2 ? `${props.const2[0]}` : `${Comparison.GT}`,
      props.const2 ? props.const2[1].toString() : props.inputtedValue || "0",
      props.const2 ? props.const2[1] : parseNumeric(props.interpretedValue, 0)
    ],
    joint: props.joint === "or" ? "or" : "and"
  };
}

/**
 * Creates a MeasureItem object.
 */
export function buildMeasure(props: {
  active?: boolean;
  key?: string;
  name?: string;
  fullName?: string;
  uri?: string;
}): MeasureItem {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.key || props.name || props.fullName || props.uri || `${props}`,
    name: props.name || props.key || `${props}`
  };
}

/**
 * Creates a MemberItem object.
 */
export function buildMember(props): MemberItem {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.uri || props.fullName || props.key,
    name: props.name || props.key || `${props}`
  };
}

/**
 * Creates a PropertyItem object.
 */
export function buildProperty(props): PropertyItem {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.uri || props.fullName || props.key || randomKey(),
    level: props.level,
    name: props.name || props.property,
    uniqueName: props.uniqueName || props.name
  };
}
