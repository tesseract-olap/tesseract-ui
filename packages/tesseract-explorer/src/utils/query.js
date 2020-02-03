import {Order} from "@datawheel/olap-client";
import {selectBooleans, selectCutItems, selectDrilldownItems, selectFilterItems, selectGrowthItems, selectMeasureItems, selectRcaItems, selectTopkItems} from "../state/params/selectors";
import {buildCut, buildDrilldown, buildFilter, buildGrowth, buildMeasure, buildMember, buildRca, buildTopk} from "./structs";
import {keyBy} from "./transform";
import {isActiveCut, isActiveItem, isGrowthItem, isRcaItem, isTopkItem} from "./validation";

/**
 * @param {import("@datawheel/olap-client").Query} query
 * @param {QueryParams} params
 */
export function applyQueryParams(query, params) {
  Object.entries(params.booleans).forEach(item => {
    // @ts-ignore
    query.setOption(item[0], item[1]);
  });

  Object.values(params.cuts).forEach(item => {
    isActiveCut(item) &&
      query.addCut(item, item.members.filter(isActiveItem).map(m => m.key));
  });

  Object.values(params.drilldowns).forEach(item => {
    if (!isActiveItem(item)) return;
    query.addDrilldown(item);
    item.properties.forEach(prop => {
      isActiveItem(prop) && query.addProperty(item, prop.property);
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

  console.log(query);

  return query;
}

/**
 * @param {import("@datawheel/olap-client").Query} query
 * @returns {QueryParams}
 */
export function extractQueryParams(query) {
  const cube = query.cube;

  const booleans = query.getParam("options");
  const drilldowns = query.getParam("drilldowns").map(dd => buildDrilldown(dd.toJSON()));
  const measures = query.getParam("measures").map(ms => buildMeasure(ms.toJSON()));
  const filters = query.getParam("filters").map(filter => buildFilter(filter));

  const growth = query.getParam("growth");
  const growthItem = buildGrowth({
    active: true,
    measure: growth.measure?.name,
    level: growth.level?.uniqueName
  });

  const rca = query.getParam("rca");
  const rcaItem = buildRca({
    active: true,
    level1: rca.level1?.uniqueName,
    level2: rca.level2?.uniqueName,
    measure: rca.measure?.name
  });

  const topk = query.getParam("topk");
  const topkItem = buildTopk({
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
      active: true,
      dimension: level.dimension.name,
      hierarchy: level.hierarchy.name,
      level: level.uniqueName || level.name,
      members: cutRecord[cutLevel].map(key => buildMember({active: true, key})),
      membersLoaded: false
    });
  });

  const getKey = i => i.key;
  return {
    booleans: {
      debug: Boolean(booleans.debug),
      distinct: Boolean(booleans.distinct),
      nonempty: Boolean(booleans.nonempty),
      parents: Boolean(booleans.parents),
      sparse: Boolean(booleans.sparse)
    },
    cube: cube.name,
    cuts: keyBy(cuts, getKey),
    drilldowns: keyBy(drilldowns, getKey),
    filters: keyBy(filters, getKey),
    growth: {[growthItem.key]: growthItem},
    locale: query.getParam("locale"),
    measures: keyBy(measures, getKey),
    rca: {[rcaItem.key]: rcaItem},
    topk: {[topkItem.key]: topkItem}
  };
}
