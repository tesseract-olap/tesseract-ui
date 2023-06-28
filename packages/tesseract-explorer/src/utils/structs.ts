import {Comparison, Measure} from "@datawheel/olap-client";
import {asArray} from "./array";
import {parseNumeric, randomKey} from "./string";
import {joinName} from "./transform";
import {isNumeric, isOneOf} from "./validation";


export interface QueryItem {
  created: string;
  isDirty: boolean;
  key: string;
  label: string;
  params: QueryParams;
  result: QueryResult;
}

export interface QueryParams {
  booleans: Record<string, undefined | boolean>;
  cube: string;
  dimensions: Record<string, DimensionColumn>;
  measurements: Record<string, MeasureColumn>;
  cuts: Record<string, CutItem>;
  drilldowns: Record<string, DrilldownItem>;
  filters: Record<string, FilterItem>;
  locale: string | undefined;
  measures: Record<string, MeasureItem>;
  previewLimit: number;
  pagiLimit: number;
  pagiOffset: number;
  sortDir: "asc" | "desc";
  sortKey: string | undefined;
}

export interface QueryResult {
  data: Record<string, string | number>[];
  error?: string;
  headers?: Record<string, string>;
  sourceCall?: string | undefined;
  status: number;
  url: string;
}

export interface QueryParamsItem {
  active: boolean;
  readonly key: string;
}

// This interface replaces CutItem and DrilldownItem
export interface DimensionColumn {
  key: string;

  isDrilldownActive: boolean;
  isCutActive: boolean;

  /** Identifier for the selected Level in this Dimension */
  level: string;

  /** List of selected Members to cut this Level. */
  members: string[];

  /** List of selected Properties from this Level. */
  properties: string[];

  /** Property to be used as caption for this Level in the data. */
  caption: string | undefined;
}

// This interface replaces MeasureItem
export interface MeasureColumn {
  key: string;

  isMeasureActive: boolean;
  isFilterActive: boolean;

  /** Identifier for the Measure this object refers. */
  measure: string;

  /** First condition for the range of the Filter applied to the Measure. */
  conditionOne: undefined | [string, string];

  /** Second condition for the range of the Filter applied to the Measure. */
  conditionTwo: undefined | [string, string];

  /** Union operator for both conditions. */
  joint: undefined | "and" | "or";
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
    params: buildQueryParams(props.params || {}),
    result: {
      data: [],
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
    dimensions: props.dimensions || {},
    measurements: props.measurements || {},
    cuts: props.cuts || {},
    drilldowns: props.drilldowns || {},
    filters: props.filters || {},
    locale: props.locale || "",
    measures: props.measures || {},
    pagiLimit: props.pagiLimit || props.limitAmount || props.limit || 0,
    pagiOffset: props.pagiOffset || props.limitOffset || props.offset || 0,
    previewLimit: props.previewLimit || 0,
    sortDir: props.sortDir || props.sortDirection || props.sortOrder || props.order || "desc",
    sortKey: props.sortKey || props.sortProperty || ""
  };
}

/**
 * Creates a {@link DimensionColumn} object.
 */
export function buildDimensionColumn(props: Partial<DimensionColumn> & {
  name?: string;
  uniqueName?: string;
}): DimensionColumn {
  return {
    key: props.key || props.uniqueName || props.name || randomKey(),
    isDrilldownActive: !!props.isDrilldownActive || false,
    isCutActive: !!props.isCutActive || false,
    level: props.level || props.uniqueName || `${props.name}`,
    members: asArray(props.members),
    caption: props.caption || undefined,
    properties: asArray(props.properties)
  };
}

/**
 * Creates a {@link MeasureColumn} object.
 */
export function buildMeasureColumn(props: Partial<MeasureColumn> & {
  name?: string;
}): MeasureColumn {
  const comparisonValues = Object.values(Comparison);
  const condOne = asArray(props.conditionOne).slice(0, 2).map(String);
  const condTwo = asArray(props.conditionTwo).slice(0, 2).map(String);
  return {
    key: props.key || props.name || randomKey(),
    isMeasureActive: !!props.isMeasureActive || false,
    isFilterActive: !!props.isFilterActive || false,
    measure: props.measure || `${props.name}`,
    conditionOne: isOneOf(condOne[0], comparisonValues) && isNumeric(condOne[1])
      ? [condOne[0], condOne[1]] : undefined,
    conditionTwo: isOneOf(condTwo[0], comparisonValues) && isNumeric(condTwo[1])
      ? [condTwo[0], condTwo[1]] : undefined,
    joint: isOneOf(props.joint, ["and", "or"]) ? props.joint : undefined
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
