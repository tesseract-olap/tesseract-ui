import {Vizbuilder} from "@datawheel/vizbuilder";
import {createElement, useMemo} from "react";

/**
 * @template {TessExpl.Struct.IQueryItem} T
 * @template U
 * @param {Record<string, T>} dict
 * @param {(item: T, index: number, list: T[]) => U} mapFn
 * @returns {U[]}
 */
function mapActives(dict, mapFn) {
  return Object.values(dict).filter(item => item.active).map(mapFn);
}

/** @type {React.FC<import("..").VizbuilderViewProps>} */
export const VizbuilderView = props => {
  const {params, result, formatters = {}} = props;

  /** @type {VizBldr.QueryResult} */
  const queries = useMemo(() => {

    /** @type {VizBldr.QueryParams} */
    const parameters = {
      booleans: params.booleans,
      cuts: mapActives(params.cuts, item => ({
        dimension: item.dimension,
        hierarchy: item.hierarchy,
        level: item.level,
        members: item.members
      })),
      drilldowns: mapActives(params.drilldowns, item => ({
        caption: item.captionProperty,
        dimension: item.dimension,
        hierarchy: item.hierarchy,
        level: item.level,
        properties: item.properties.map(item => item.name)
      })),
      filters: mapActives(params.filters, item => ({
        comparison: item.comparison,
        formatter: formatters[item.measure],
        measure: item.measure,
        value: `${item.interpretedValue}`
      })),
      growth: mapActives(params.growth, item => ({
        measure: item.measure,
        level: item.level
      })),
      measures: mapActives(params.measures, item => ({
        formatter: formatters[item.measure],
        measure: item.measure
      }))
    };

    return {cube: props.cube, dataset: result.data, params: parameters};
  }, [result.data, params]);

  return createElement(Vizbuilder, {
    allowedChartTypes: props.allowedChartTypes,
    className: "vizbuilder-view",
    datacap: props.datacap,
    defaultLocale: props.defaultLocale,
    measureConfig: props.measureConfig,
    onPeriodChange: props.onPeriodChange,
    queries,
    showConfidenceInt: props.showConfidenceInt,
    topojsonConfig: props.topojsonConfig,
    translations: props.translations,
    userConfig: props.userConfig
  });
};
