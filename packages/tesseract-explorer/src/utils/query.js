import {Order} from "@datawheel/olap-client";
import {buildCut, buildDrilldown, buildFilter, buildGrowth, buildMeasure, buildMember, buildRca, buildTopk} from "./structs";
import {keyBy} from "./transform";
import {isActiveCut, isActiveItem, isGrowthItem, isRcaItem, isTopkItem} from "./validation";

/**
 * @param {import("@datawheel/olap-client").Query} query
 * @param {QueryParams} params
 */
export function applyQueryParams(query, params) {
  Object.entries(params.booleans).forEach(item => {
    query.setOption(item[0], item[1]);
  });

  Object.values(params.cuts).forEach(item => {
    isActiveCut(item) &&
      query.addCut(item, item.members.filter(isActiveItem).map(m => m.key));
  });

  Object.values(params.drilldowns).forEach(item => {
    if (!isActiveItem(item)) return;
    query.addDrilldown(item);
    item.captionProperty && query.addCaption(item, item.captionProperty);
    item.properties.forEach(prop => {
      isActiveItem(prop) && query.addProperty(item, prop.name);
    });
  });

  Object.values(params.growth).forEach(item => {
    isGrowthItem(item) && isActiveItem(item) &&
      query.setGrowth(item.level, item.measure);
  });

  Object.values(params.measures).forEach(item => {
    isActiveItem(item) && query.addMeasure(item.measure);
  });

  Object.values(params.rca).forEach(item => {
    isRcaItem(item) && isActiveItem(item) &&
      query.setRCA(item.level1, item.level2, item.measure);
  });

  Object.values(params.topk).forEach(item => {
    isTopkItem(item) && isActiveItem(item) &&
      query.setTop(item.amount, item.level, item.measure, Order[item.order]);
  });

  params.locale && query.setLocale(params.locale);

  return query;
}

/**
 * @param {import("@datawheel/olap-client").Query} query
 * @returns {QueryParams}
 */
export function extractQueryParams(query) {
  const cube = query.cube;

  const booleans = query.getParam("options");
  const drilldowns = query.getParam("drilldowns").map(buildDrilldown);
  const measures = query.getParam("measures").map(buildMeasure);
  const filters = query.getParam("filters").map(buildFilter);

  const growth = query.getParam("growth");
  const growthItem = growth && buildGrowth({
    active: true,
    measure: growth.measure?.name,
    level: growth.level?.uniqueName
  });

  const rca = query.getParam("rca");
  const rcaItem = rca && buildRca({
    active: true,
    level1: rca.level1?.uniqueName,
    level2: rca.level2?.uniqueName,
    measure: rca.measure?.name
  });

  const topk = query.getParam("topk");
  const topkItem = topk && buildTopk({
    active: true,
    amount: topk.amount,
    level: topk.level?.uniqueName,
    measure: topk.measure?.name,
    order: topk.order
  });

  const cutRecord = query.getParam("cuts");
  const cuts = Object.keys(cutRecord).map(cutLevel => {
    const level = cube.getLevel(cutLevel);
    return buildCut({
      ...level.toJSON(),
      active: true,
      members: cutRecord[cutLevel].map(key => buildMember({active: true, key})),
      membersLoaded: false
    });
  });

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
    rca: rcaItem ? {[rcaItem.key]: rcaItem} : {},
    topk: topkItem ? {[topkItem.key]: topkItem} : {}
  };
}
