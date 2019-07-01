import formurlencode from "form-urlencoded";
import urljoin from "url-join";

import {applyQueryParams} from "./api";
import {serializeState} from "./format";
import {isActiveCut, isActiveItem} from "./validation";

/** @typedef {import("../reducers/queryReducer").QueryState} QueryState */

/**
 * Returns the parent cube to the elements in the passed query.
 * We can assume there will always be at least one measure, so it's safe.
 * @param {QueryState} query
 */
export function getCube(query) {
  return query.measures.length ? query.measures[0].measure.cube : undefined;
}

/**
 * @param {QueryState} query
 */
export function buildJavascriptCall(query) {
  const q = serializeState(query);

  const drilldowns = q.drilldowns.map(item => `.addDrilldown("${item}")`);
  const measures = q.measures.map(item => `.addMeasure("${item}")`);
  const cuts = q.cuts.map(item => `.addCut("${item}")`);

  const growth = q.growth && `.setGrowth("${q.growth.level}", "${q.growth.measure}")`;
  const rca =
    q.rca && `.setRCA("${q.rca.level1}", "${q.rca.level2}", "${q.rca.measure}")`;
  const top = q.top && `.setTop(top.amount, top.level, top.measure, top.descendent)`;

  const options = ["parents"].map(opt => `.setOption("${opt}", ${q[opt]})`);

  const output = [].concat(measures, drilldowns, cuts, growth, rca, top, options);

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

  // cube=exports_and_imports
  // measures=Total
  // drilldowns=HS6,Year
  // Flow=1
  // Year=2018,2017
  // locale=et
  // growth=Year,Total
  // parents=true

  const params = {
    cube: cube.name,
    parents: query.parents,
    measures: query.measures
      .reduce((measures, item) => {
        isActiveItem(item) && measures.push(item.measure.name);
        return measures;
      }, [])
      .join(","),
    drilldowns: query.drilldowns
      .reduce((drilldowns, item) => {
        isActiveItem(item) && drilldowns.push(item.drillable.name);
        return drilldowns;
      }, [])
      .join(",")
  };

  query.cuts.forEach(item => {
    if (isActiveCut(item)) {
      const key = item.drillable.name;
      params[key] = item.members.map(member => member.key).join(",");
    }
  });

  // TODO: implement locale in UI
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
