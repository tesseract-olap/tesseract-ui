import {Order, Measure} from "@datawheel/olap-client";
import {buildCut, buildDrilldown, buildFilter, buildGrowth, buildMeasure, buildRca, buildTopk} from "./structs";
import {keyBy} from "./transform";
import {isActiveCut, isActiveItem, isGrowthItem, isRcaItem, isTopkItem} from "./validation";

/**
 * @param {OlapClient.Query} query
 * @param {TessExpl.Struct.QueryParams} params
 */
export function applyQueryParams(query, params) {
  Object.entries(params.booleans).forEach(item => {
    item[1] != null && query.setOption(item[0], item[1]);
  });

  Object.values(params.cuts).forEach(item => {
    isActiveCut(item) && query.addCut(item, item.members);
  });

  Object.values(params.drilldowns).forEach(item => {
    if (!isActiveItem(item)) return;
    query.addDrilldown(item);
    item.captionProperty &&
      query.addCaption({...item, property: item.captionProperty});
    item.properties.forEach(prop => {
      isActiveItem(prop) && query.addProperty({...item, property: prop.name});
    });
  });

  Object.values(params.growth).forEach(item => {
    isGrowthItem(item) && isActiveItem(item) && query.addCalculation("growth", {
      category: item.level,
      value: item.measure,
    });
  });

  Object.values(params.measures).forEach(item => {
    isActiveItem(item) && query.addMeasure(item.measure);
  });

  Object.values(params.rca).forEach(item => {
    isRcaItem(item) && isActiveItem(item) && query.addCalculation("rca", {
      category: item.level1,
      location: item.level2,
      value: item.measure,
    });
  });

  Object.values(params.topk).forEach(item => {
    isTopkItem(item) && isActiveItem(item) && query.addCalculation("topk", {
      amount: item.amount,
      category: item.level,
      order: Order[item.order],
      value: item.measure,
    });
  });

  params.locale && query.setLocale(params.locale);

  if (params.sortKey && params.sortDir) {
    query.setSorting(params.sortKey, params.sortDir === "desc");
  }

  query.setPagination(params.pagiLimit || 0, params.pagiOffset);

  return query;
}

/**
 * @param {OlapClient.Query} query
 * @returns {TessExpl.Struct.QueryParams}
 */
export function extractQueryParams(query) {
  const cube = query.cube;

  const booleans = query.getParam("options");
  // TODO: parse properties too
  const drilldowns = query.getParam("drilldowns").map(buildDrilldown);
  const measures = query.getParam("measures").map(buildMeasure);
  const filters = query.getParam("filters").map(buildFilter);
  const calculations = query.getParam("calculations").reverse();

  /** @type {OlapClient.QueryCalcGrowth | undefined} */
  const growth = calculations.find(item => item.kind === "growth");
  const growthItem = growth && buildGrowth({
    active: true,
    measure: Measure.isMeasure(growth.value) ? growth.value.name : growth.value,
    level: growth.category.uniqueName
  });

  /** @type {OlapClient.QueryCalcRca | undefined} */
  const rca = calculations.find(item => item.kind === "rca");
  const rcaItem = rca && buildRca({
    active: true,
    level1: rca.category.uniqueName,
    level2: rca.location.uniqueName,
    measure: Measure.isMeasure(rca.value) ? rca.value.name : rca.value,
  });

  /** @type {OlapClient.QueryCalcTopk | undefined} */
  const topk = calculations.find(item => item.kind === "topk");
  const topkItem = topk && buildTopk({
    active: true,
    amount: topk.amount,
    level: topk.category.uniqueName,
    measure: Measure.isMeasure(topk.value) ? topk.value.name : topk.value,
    order: topk.order
  });

  const cutRecord = query.getParam("cuts");
  const cuts = Object.keys(cutRecord).map(cutLevel => {
    const level = cube.getLevel(cutLevel);
    return buildCut({
      ...level.toJSON(),
      active: true,
      members: cutRecord[cutLevel],
      membersLoaded: false
    });
  });

  const pagination = query.getParam("pagination");
  const sorting = query.getParam("sorting");

  const getKey = i => i.key;
  return {
    booleans: {
      debug: Boolean(booleans.debug),
      distinct: Boolean(booleans.distinct),
      exclude_default_members: Boolean(booleans.exclude_default_members),
      nonempty: Boolean(booleans.nonempty),
      parents: Boolean(booleans.parents),
      sparse: Boolean(booleans.sparse)
    },
    cube: cube.name,
    cuts: keyBy(cuts, getKey),
    drilldowns: keyBy(drilldowns, getKey),
    filters: keyBy(filters, getKey),
    growth: growthItem ? {[growthItem.key]: growthItem} : {},
    locale: query.getParam("locale"),
    measures: keyBy(measures, getKey),
    pagiLimit: pagination.limit,
    pagiOffset: pagination.offset,
    rca: rcaItem ? {[rcaItem.key]: rcaItem} : {},
    sortDir: sorting.direction === "asc" ? "asc" : "desc",
    sortKey: Measure.isMeasure(sorting.property)
      ? sorting.property.name
      : `${sorting.property || ""}`,
    topk: topkItem ? {[topkItem.key]: topkItem} : {}
  };
}
