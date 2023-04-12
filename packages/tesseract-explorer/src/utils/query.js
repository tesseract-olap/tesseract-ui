import {Measure} from "@datawheel/olap-client";
import {buildCut, buildDrilldown, buildFilter, buildMeasure} from "./structs";
import {keyBy} from "./transform";
import {isActiveCut, isActiveItem} from "./validation";

/**
 * @param {import("@datawheel/olap-client").Query} query
 * @param {import("./structs").QueryParams} params
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

  Object.values(params.measures).forEach(item => {
    if (!isActiveItem(item)) return;
    query.addMeasure(item.name);
  });

  params.locale && query.setLocale(params.locale);

  if (params.sortKey && params.sortDir) {
    query.setSorting(params.sortKey, params.sortDir === "desc");
  }

  if (params.previewLimit) {
    query.setPagination(params.previewLimit, 0);
  }
  else {
    query.setPagination(params.pagiLimit || 0, params.pagiOffset);
  }

  return query;
}

/**
 * @param {OlapClient.Query} query
 * @returns {import("./structs").QueryParams}
 */
export function extractQueryParams(query) {
  const cube = query.cube;

  const booleans = query.getParam("options");
  // TODO: parse properties too
  const drilldowns = query.getParam("drilldowns").map(buildDrilldown);
  const filters = query.getParam("filters").map(buildFilter);
  const measures = query.getParam("measures").map(buildMeasure);

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
    locale: query.getParam("locale"),
    measures: keyBy(measures, getKey),
    pagiLimit: pagination.limit,
    pagiOffset: pagination.offset,
    previewLimit: 0,
    sortDir: sorting.direction === "asc" ? "asc" : "desc",
    sortKey: Measure.isMeasure(sorting.property)
      ? sorting.property.name
      : `${sorting.property || ""}`
  };
}
