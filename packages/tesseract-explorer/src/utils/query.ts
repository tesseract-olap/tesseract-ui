import {Measure, Query} from "@datawheel/olap-client";
import {CutItem, DrilldownItem, FilterItem, MeasureItem, QueryParams, QueryParamsItem, buildCut, buildDrilldown, buildFilter, buildMeasure} from "./structs";
import {keyBy} from "./transform";
import {isActiveCut, isActiveItem} from "./validation";

/**
 * Applies the properties set on a QueryParams object
 * to an OlapClient Query object.
 */
export function applyQueryParams(
  query: Query,
  params: QueryParams,
  settings: {
    previewLimit: number;
  }
) {

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

  if (params.isPreview) {
    query.setPagination(settings.previewLimit, 0);
  }
  else {
    query.setPagination(params.pagiLimit || 0, params.pagiOffset);
  }

  return query;
}

/**
 * Extracts the properties set in an OlapClient Query object
 * to a new QueryParams object.
 */
export function extractQueryParams(query: Query): QueryParams {
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

  const getKey = <T extends QueryParamsItem>(item: T) => item.key;

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
    cuts: keyBy<CutItem>(cuts, getKey),
    drilldowns: keyBy<DrilldownItem>(drilldowns, getKey),
    filters: keyBy<FilterItem>(filters, getKey),
    locale: query.getParam("locale"),
    measures: keyBy<MeasureItem>(measures, getKey),
    pagiLimit: pagination.limit,
    pagiOffset: pagination.offset,
    isPreview: true,
    sortDir: sorting.direction === "asc" ? "asc" : "desc",
    sortKey: Measure.isMeasure(sorting.property)
      ? sorting.property.name
      : `${sorting.property || ""}`
  };
}
