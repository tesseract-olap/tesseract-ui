import {ViewProps} from "@datawheel/tesseract-explorer";
import {QueryResult, Struct, Vizbuilder, VizbuilderProps} from "@datawheel/vizbuilder";
import React, {useMemo} from "react";

type Constraint = Struct.FilterItem["constraint1"];

/**
 * Main Vizbuilder component wrapper.
 */
export function VizbuilderView(props: ViewProps & Omit<VizbuilderProps, "queries"> & {
  formatters: Record<string, (value: number) => string>;
}) {
  const {
    cube, params, result,
    className = "vizbuilder-view",
    formatters = {},
    ...otherProps
  } = props;

  const queries: QueryResult = useMemo(() => ({
    cube,
    dataset: result.data,
    params: {
      locale: params.locale || "en",
      booleans: params.booleans,
      cuts: mapActives(params.cuts, (item): Struct.CutItem => ({
        dimension: item.dimension,
        hierarchy: item.hierarchy,
        level: item.level,
        members: item.members
      })),
      drilldowns: mapActives(params.drilldowns, (item): Struct.DrilldownItem => ({
        caption: item.captionProperty,
        dimension: item.dimension,
        hierarchy: item.hierarchy,
        level: item.level,
        properties: item.properties.map(item => item.name)
      })),
      filters: mapActives(params.filters, (item): Struct.FilterItem => ({
        constraint1: [item.conditionOne[0], item.conditionOne[2]] as Constraint,
        constraint2: item.conditionTwo
          ? [item.conditionTwo[0], item.conditionTwo[2]] as Constraint
          : undefined,
        formatter: formatters[item.measure],
        joint: item.joint,
        measure: item.measure
      })),
      measures: mapActives(params.measures, (item): Struct.MeasureItem => ({
        formatter: formatters[item.name],
        measure: item.name
      }))
    }
  }), [cube, result.data, params]);

  return <Vizbuilder className={className} queries={queries} {...otherProps} />;
}

VizbuilderView.defaultProps = {
  version: process.env.BUILD_VERSION
};

/**
 * Iterates over the values of a hashmap object, takes only the actives, and
 * returns an array with the transformation results.
 */
function mapActives<T extends {active: boolean, key: string}, U>(
  dict: Record<string, T>,
  mapFn: (item: T, index: number, list: T[]) => U
): U[] {
  return Object.values(dict).filter(item => item.active).map(mapFn);
}
