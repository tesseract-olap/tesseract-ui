import {ensureArray} from "./array";
import {randomKey} from "./string";
import {joinName} from "./transform";

/**
 * @param {any} props
 * @returns {TessExpl.Struct.QueryItem}
 */
export function buildQuery(props) {
  const params = props.params || {};
  return {
    created: props.created || new Date().toISOString(),
    key: props.key || randomKey(),
    label: props.label || "",
    isDirty: true,
    params: {
      booleans: params.booleans || {},
      cube: params.cube || "",
      cuts: params.cuts || {},
      drilldowns: params.drilldowns || {},
      filters: params.filters || {},
      locale: params.locale || "",
      measures: params.measures || [],
      pagiLimit: params.pagiLimit || params.limitAmount || params.limit || 0,
      pagiOffset: params.pagiOffset || params.limitOffset || params.offset || 0,
      sortDir: params.sortDir || params.sortDirection || params.sortOrder || params.order || "desc",
      sortKey: params.sortKey || params.sortProperty || ""
    },
    result: {
      data: [],
      error: null,
      headers: {},
      sourceCall: "",
      status: 0,
      urlAggregate: "",
      urlLogicLayer: ""
    }
  };
}

/**
 * @param {any} props
 * @returns {TessExpl.Struct.CutItem}
 */
export function buildCut(props) {
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
 * @param {any} props
 * @returns {TessExpl.Struct.DrilldownItem}
 */
export function buildDrilldown(props) {
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
    properties: ensureArray(props.properties).map(buildProperty),
    uniqueName: props.uniqueName || props.name || props.level
  };
}

/**
 * @param {any} props
 * @returns {TessExpl.Struct.FilterItem}
 */
export function buildFilter(props) {
  if (typeof props.toJSON === "function") {
    props = props.toJSON();
  }
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
 * @returns {TessExpl.Struct.MemberItem}
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
 * @returns {TessExpl.Struct.PropertyItem}
 */
export function buildProperty(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.uri || props.fullName || props.key || randomKey(),
    level: props.level,
    name: props.name || props.property,
    uniqueName: props.uniqueName || props.name
  };
}
