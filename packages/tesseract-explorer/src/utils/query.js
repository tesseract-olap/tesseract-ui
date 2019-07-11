import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopState
} from "./validation";

/**
 * @param {import("@datawheel/tesseract-client").Query} query
 * @param {import("../reducers/queryReducer").QueryState} params
 */
export function applyQueryParams(query, params) {
  params.drilldowns.forEach(item => {
    isActiveItem(item) && query.addDrilldown(item.drillable);
  });
  params.measures.forEach(item => {
    isActiveItem(item) && query.addMeasure(item.measure);
  });
  params.cuts.forEach(item => {
    isActiveCut(item) &&
      query.addCut(item.drillable, item.members.filter(isActiveItem).map(m => m.key));
  });

  const {growth, rca, top} = params;
  if (validGrowthState(growth)) {
    query.setGrowth(growth.level, growth.measure);
  }
  if (validRcaState(rca)) {
    query.setRCA(rca.level1, rca.level2, rca.measure);
  }
  if (validTopState(top)) {
    query.setTop(top.amount, top.level, top.measure, top.order);
  }

  query.setOption("parents", params.parents);
  query.setOption("sparse", params.sparse);

  return query;
}

function QueryItem(name) {
  this.name = name;
  this.fullName = name;
  this.key = Math.random().toString(16).substr(2);
}

/**
 * @param {Partial<import("../reducers").CutItem>} [props]
 * @returns {import("../reducers").CutItem}
 */
export function buildCut(item, props) {
  item = typeof item === "string" ? new QueryItem(item) : item;
  return {
    active: typeof item.active === "boolean" ? item.active : false,
    error: null,
    members: [],
    membersLoaded: false,
    ...props,
    drillable: item.drillable || item.fullName,
    key: item.key == null ? item.uri : item.key,
  };
}

/**
 * @param {Partial<import("../reducers").DrilldownItem>} [props]
 * @returns {import("../reducers").DrilldownItem}
 */
export function buildDrilldown(item, props) {
  item = typeof item === "string" ? new QueryItem(item) : item;
  return {
    active: typeof item.active === "boolean" ? item.active : true,
    ...props,
    drillable: item.drillable || item.fullName,
    key: item.key == null ? item.uri : item.key,
  };
}

/**
 * @param {Partial<import("../reducers").FilterItem>} [props]
 * @returns {import("../reducers").FilterItem}
 */
export function buildFilter(item, props) {
  item = typeof item === "string" ? new QueryItem(item) : item;
  return {
    active: typeof item.active === "boolean" ? item.active : true,
    comparison: item.comparison || "=",
    inputtedValue: "inputtedValue" in item ? item.inputtedValue : "0",
    interpretedValue: "interpretedValue" in item ? item.interpretedValue : 0,
    ...props,
    key: item.key == null ? item.uri : item.key,
    measure: item.measure || item.name
  };
}

/**
 * @param {Partial<import("../reducers").MeasureItem>} [props]
 * @returns {import("../reducers").MeasureItem}
 */
export function buildMeasure(item, props) {
  item = typeof item === "string" ? new QueryItem(item) : item;
  return {
    active: typeof item.active === "boolean" ? item.active : true,
    ...props,
    key: item.key == null ? item.uri : item.key,
    measure: item.measure || item.name
  };
}

/**
 * @param {Partial<import("../reducers").MemberItem>} [props]
 * @returns {import("../reducers").MemberItem}
 */
export function buildMember(item, props) {
  return {
    active: typeof item.active === "boolean" ? item.active : false,
    name: item.name || item,
    ...props,
    key: item.key == null ? item : item.key,
  };
}
