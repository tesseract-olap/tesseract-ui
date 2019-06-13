import formurlencode from "form-urlencoded";
import urljoin from "url-join";

import {filterActive} from "./array";
import {applyQueryParams} from "./api";

/** @typedef {import("../reducers/queryReducer").QueryState} QueryState */

/**
 * @param {QueryState} query
 */
export function getCube(query) {
  return query.measures.length ? query.measures[0].measure.cube : undefined;
}

/**
 * @param {QueryState} query
 */
export function buildJavascriptCall(query) {
  if (!query) return "";

  const drilldowns = query.drilldowns
    .filter(filterActive)
    .map(item => `.addDrilldown("${item.key}")`);
  const measures = query.measures
    .filter(filterActive)
    .map(item => `.addMeasure("${item.key}")`);
  const cuts = query.cuts
    .filter(filterActive)
    .map(
      item =>
        `.addCut("${item.drillable.fullName}.${item.members.map(m => m.key).join(",")}")`
    );

  const growth =
    query.growth.level &&
    query.growth.measure &&
    `.setGrowth("${query.growth.level.fullName}", "${query.growth.measure.name}")`;

  const options = ["parents"].map(opt => `.setOption("${opt}", ${query[opt]})`);

  const output = [].concat(measures, drilldowns, cuts, growth, options);

  return "query\n  " + output.filter(Boolean).join("\n  ");
}

/**
 * @param {QueryState} query
 */
export function buildAggregateUrl(query) {
  const cube = getCube(query);
  return !query || !cube ? "" : applyQueryParams(cube.query, query).getPath();
}

/**
 * @param {QueryState} query
 */
export function buildLogicLayerUrl(query) {
  const cube = getCube(query);
  if (!query || !cube) return "";

  const params = {
    cube: cube.name,
    parents: query.parents
  };

  // cube=exports_and_imports
  // drilldowns=HS6,Year&
  // measures=Total&
  // parents=true
  // Year=2018,2017&
  // locale=et&
  // Flow=1&
  // growth=Year,Total

  const drilldowns = [];
  query.drilldowns.forEach(item => {
    item.active && drilldowns.push(item.drillable.name);
  });
  params.drilldowns = drilldowns.join(",");

  const measures = [];
  query.measures.forEach(item => {
    item.active && measures.push(item.measure.name);
  });
  params.measures = measures.join(",");

  query.cuts.forEach(item => {
    if (item.active) {
      const key = item.drillable.name;
      params[key] = item.members.map(member => member.key).join(",");
    }
  });

  // params.locale = query.locale;

  return urljoin(
    cube.server,
    `data?${formurlencode(params, {
      ignorenull: true,
      skipIndex: true,
      sorted: true
    })}`
  );
}
