import {stringifyName} from "./transform";
import {
  isActiveCut,
  isActiveItem,
  isGrowthItem,
  isRcaItem,
  isTopkItem
} from "./validation";
import {SERIAL_BOOLEAN} from "../enums";

/**
 * @param {TessExpl.Struct.QueryParams} query
 * @returns {TessExpl.Struct.SerializedQuery}
 */
export function serializeState(query) {
  const cuts = Object.values(query.cuts).filter(isActiveCut).map(serializeCut);

  const drilldowns = Object.values(query.drilldowns)
    .filter(isActiveItem)
    .map(stringifyName);

  const filters = Object.values(query.filters).filter(isActiveItem).map(serializeFilter);

  const growth = Object.values(query.growth).filter(isGrowthItem).map(serializeGrowth);

  const measures = Object.values(query.measures).filter(isActiveItem).map(i => i.measure);

  const rca = Object.values(query.rca).filter(isRcaItem).map(serializeRca);

  const topk = Object.values(query.topk).filter(isTopkItem).map(serializeTopk);

  const booleans =
    (query.booleans.debug ? SERIAL_BOOLEAN.DEBUG : 0) +
    (query.booleans.distinct ? SERIAL_BOOLEAN.DISTINCT : 0) +
    (query.booleans.nonempty ? SERIAL_BOOLEAN.NONEMPTY : 0) +
    (query.booleans.parents ? SERIAL_BOOLEAN.PARENTS : 0) +
    (query.booleans.sparse ? SERIAL_BOOLEAN.SPARSE : 0);

  return {
    cube: query.cube,
    cuts: cuts.length > 0 ? cuts : undefined,
    drilldowns: drilldowns.length > 0 ? drilldowns : undefined,
    filters: filters.length > 0 ? filters : undefined,
    growth: growth.length > 0 ? growth : undefined,
    locale: query.locale ? query.locale : undefined,
    measures: measures.length > 0 ? measures : undefined,
    rca: rca.length > 0 ? rca : undefined,
    topk: topk.length > 0 ? topk : undefined,
    booleans: booleans > 0 ? booleans : undefined
  };
}

/**
 * @param {TessExpl.Struct.CutItem} item
 * @returns {string}
 */
export function serializeCut(item) {
  return [stringifyName(item)]
    .concat(item.members.filter(isActiveItem).map(m => m.key))
    .join(",");
}

/**
 * @param {TessExpl.Struct.FilterItem} item
 * @returns {string}
 */
export function serializeFilter(item) {
  return `${item.measure},${item.comparison},${item.interpretedValue}`;
}

/**
 * @param {TessExpl.Struct.GrowthItem} item
 * @returns {string}
 */
export function serializeGrowth(item) {
  return `${item.level},${item.measure}`;
}

/**
 * @param {TessExpl.Struct.RcaItem} item
 * @returns {string}
 */
export function serializeRca(item) {
  return `${item.level1},${item.level2},${item.measure}`;
}

/**
 * @param {TessExpl.Struct.TopkItem} item
 * @returns {string}
 */
export function serializeTopk(item) {
  return `${item.amount},${item.level},${item.measure},${item.order}`;
}
