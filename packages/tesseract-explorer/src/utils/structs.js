import {randomKey} from "./string";
import {ensureArray} from "./array";

/**
 * @param {any} props
 * @returns {QueryItem}
 */
export function buildQuery(props) {
  const params = props.params || {};
  return {
    created: props.created || new Date().toISOString(),
    key: props.key || randomKey(),
    label: props.label || "",
    isDirty: false,
    params: {
      booleans: params.booleans || {},
      cube: params.cube || "",
      cuts: params.cuts || {},
      drilldowns: params.drilldowns || {},
      filters: params.filters || {},
      growth: params.growth || {},
      locale: params.locale || "",
      measures: params.measures || {},
      rca: params.rca || {},
      topk: params.topk || {}
    },
    result: {
      chartConfig: `config = {
  x: d => d[levelName],
  y: d => d[measureName]
};
`,
      chartType: "BarChart",
      data: [],
      error: null,
      pivotColumns: undefined,
      pivotRows: undefined,
      pivotValues: undefined,
      sourceCall: "",
      status: 0,
      urlAggregate: "",
      urlLogicLayer: ""
    }
  };
}

/**
 * @param {CutItem | any} props
 * @returns {CutItem}
 */
export function buildCut(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    dimension: `${props.dimension}`,
    error: props.error || undefined,
    hierarchy: `${props.hierarchy}`,
    key: props.key || randomKey(),
    level: `${props.level || props.uniqueName || props.name}`,
    members: Array.isArray(props.members) ? props.members : [],
    membersLoaded: typeof props.membersLoaded === "boolean" ? props.membersLoaded : false
  };
}

/**
 * @param {any} props
 * @returns {DrilldownItem}
 */
export function buildDrilldown(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    caption: `${props.caption || ""}`,
    dimension: `${props.dimension}`,
    hierarchy: `${props.hierarchy}`,
    key: props.key || randomKey(),
    properties: ensureArray(props.properties).map(buildProperty),
    level: `${props.level || props.uniqueName || props.name}`
  };
}

/**
 * @param {any} props
 * @returns {FilterItem}
 */
export function buildFilter(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    comparison: props.comparison || "=",
    inputtedValue: typeof props.inputtedValue === "string" ? props.inputtedValue : "0",
    interpretedValue:
      !Number.isNaN(props.interpretedValue) && Number.isFinite(props.interpretedValue)
        ? Number.parseFloat(props.interpretedValue)
        : 0,
    key: props.key || randomKey(),
    measure: `${props.measure || props.name}`
  };
}

/**
 * @param {any} props
 * @returns {GrowthItem}
 */
export function buildGrowth(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    key: props.key || randomKey(),
    level: props.level,
    measure: props.measure
  };
}

/**
 * @param {any} props
 * @returns {MeasureItem}
 */
export function buildMeasure(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    key: props.key || props.name || props.measure,
    measure: props.measure || props.name
  };
}

/**
 * @param {any} props
 * @returns {MemberItem}
 */
export function buildMember(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.uri || props.fullName || props.key,
    name: props.name || props.key || `${props}`
  };
}

/**
 * @param {any} props
 * @returns {PropertyItem}
 */
export function buildProperty(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.uri || props.fullName || props.key || randomKey(),
    level: props.level,
    property: props.property || props.name
  };
}

/**
 * @param {any} props
 * @returns {RcaItem}
 */
export function buildRca(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.key || randomKey(),
    level1: props.level1,
    level2: props.level2,
    measure: props.measure || props.name
  };
}

/**
 * @param {any} props
 * @returns {TopkItem}
 */
export function buildTopk(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.key || randomKey(),
    amount: Number.parseInt(props.amount, 10) || 1,
    level: props.level,
    measure: props.measure,
    order:
      typeof props.order === "boolean"
        ? props.order ? "desc" : "asc"
        : props.order === "asc" ? "asc" : "desc"
  };
}
