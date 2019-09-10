import {Order} from "@datawheel/olap-client";
import {parseName} from "./transform";
import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopkState
} from "./validation";

/**
 * @param {import("@datawheel/olap-client").Query} query
 * @param {import("../reducers").QueryState} params
 */
export function applyQueryParams(query, params) {
  params.drilldowns.forEach(item => {
    isActiveItem(item) && query.addDrilldown(item);
  });
  params.measures.forEach(item => {
    isActiveItem(item) && query.addMeasure(item.measure);
  });
  params.cuts.forEach(item => {
    isActiveCut(item) &&
      query.addCut(item, item.members.filter(isActiveItem).map(m => m.key));
  });

  const {growth, rca, topk} = params;
  validGrowthState(growth) && query.setGrowth(parseName(growth.level), growth.measure);
  validRcaState(rca) &&
    query.setRCA(parseName(rca.level1), parseName(rca.level2), rca.measure);
  validTopkState(topk) &&
    query.setTop(topk.amount, parseName(topk.level), topk.measure, Order[topk.order]);

  query.setOption("debug", params.debug);
  query.setOption("distinct", params.distinct);
  query.setOption("nonempty", params.nonempty);
  query.setOption("parents", params.parents);
  query.setOption("sparse", params.sparse);

  return query;
}

/**
 * @param {any} props
 * @returns {import("../reducers").CutItem}
 */
export function buildCut(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    dimension: `${props.dimension}`,
    error: props.error || undefined,
    hierarchy: `${props.hierarchy}`,
    key: props.uri || props.key,
    level: `${props.level || props.name}`,
    members: Array.isArray(props.members) ? props.members : [],
    membersLoaded: typeof props.membersLoaded === "boolean" ? props.membersLoaded : false
  };
}

/**
 * @param {any} props
 * @returns {import("../reducers").DrilldownItem}
 */
export function buildDrilldown(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    dimension: `${props.dimension}`,
    hierarchy: `${props.hierarchy}`,
    key: props.uri || props.key,
    level: `${props.level || props.name}`
  };
}

/**
 * @param {any} props
 * @returns {import("../reducers").FilterItem}
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
    key: props.uri || props.key,
    measure: `${props.measure || props.name}`
  };
}

/**
 * @param {any} props
 * @returns {import("../reducers").MeasureItem}
 */
export function buildMeasure(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : true,
    key: props.uri || props.key,
    measure: `${props.measure || props.name}`
  };
}

/**
 * @param {any} props
 * @returns {import("../reducers").MemberItem}
 */
export function buildMember(props) {
  return {
    active: typeof props.active === "boolean" ? props.active : false,
    key: props.uri || props.fullName || props.key,
    name: props.name || props.key || `${props}`
  };
}
