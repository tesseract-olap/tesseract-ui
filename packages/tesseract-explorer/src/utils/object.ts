import type {PlainCube} from "@datawheel/olap-client";
import {filterMap} from "./array";
import {getCaption, parseNumeric} from "./string";
import type {AnyResultColumn, QueryParams} from "./structs";
import type {Annotated} from "./types";

/**
 * Wraps `Object.keys` for reusability.
 */
export function getKeys<T>(map: {[s: string]: T}): string[] {
  return Object.keys(map);
}

/**
 * Wraps `Object.values` for reusability.
 */
export function getValues<T>(map: {[s: string]: T}): T[] {
  return Object.values(map);
}

/**
 * Safe method to check if an object contains a property.
 */
export function hasOwnProperty(obj: any, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

/**
 * Parse and convert order value from an schema object
 * (that supports annotations) to an integer value.
 * If null return a big number: 99
 */
export function getOrderValue<T extends Annotated>(schemaObject: T) {
  const value = schemaObject.annotations.order || "NaN";
  return parseNumeric(value, 99);
}

/**
 * Checks the structure of an array of data and returns an object that describes
 * the types, ranges and values in it.
 */
export function describeData(
  cube: PlainCube,
  params: QueryParams,
  data: Record<string, any>[]
): Record<string, AnyResultColumn> {
  const {locale} = params;

  const measureMap = new Map(cube.measures.map(msr => [msr.name, msr]));
  const measures = filterMap(Object.values(params.measures), item =>
    measureMap.get(item.name) || null
  );

  const dimensionMap = new Map(
    cube.dimensions.map(dim => [dim.name, new Map(
      dim.hierarchies.map(hie => [hie.name, new Map(
        hie.levels.map(lvl => [lvl.name, lvl])
      )])
    )])
  );
  const drilldowns = filterMap(Object.values(params.drilldowns), item => {
    const hierarchyMap = dimensionMap.get(item.dimension);
    const levelMap = hierarchyMap?.get(item.hierarchy);
    const level = levelMap?.get(item.level);
    if (!level) return null;
    const properties = filterMap(item.properties, prop => prop.active
      ? level.properties.find(item => item.name === prop.name) || null
      : null
    );
    return [level, ...properties];
  }).flat(1);

  const entityFinder = (name: string) => {
    const nameWoId = name.replace(/^ID\s|\sID$/, "");
    return (
      drilldowns.find(item => item.uniqueName === name) ||
      measures.find(item => item.name === name) ||
      drilldowns.find(item => item.name === name) ||
      drilldowns.find(item => item.uniqueName === nameWoId) ||
      measures.find(item => item.name === nameWoId) ||
      drilldowns.find(item => item.name === nameWoId)
    );
  };

  return Object.fromEntries(
    filterMap<string, [string, AnyResultColumn]>(Object.keys(data[0]), key => {
      const entity = entityFinder(key);
      if (!entity) return null;
      const typeSet = new Set(data.map(item => typeof item[key]));
      /* eslint-disable indent, operator-linebreak */
      const valueType =
        typeSet.size === 1 ?
          typeSet.has("number") ? "number" :
          typeSet.has("boolean") ? "boolean" :
          /* else */ "string" :
        typeSet.has("number") ? "number" : "string";
      /* eslint-enable indent, operator-linebreak */
      const isId = key !== entity.name;
      return [key, {
        label: key,
        localeLabel: getCaption(entity, locale) + (isId ? " ID" : "") || key,
        entity,
        entityType: entity._type,
        isId,
        range: valueType === "number" ? getDomain(data, key) : undefined,
        valueType
      } as AnyResultColumn];
    })
  );
}

/**
 * Calculates the range of the values for a specific key in a dataset.
 * The array needs to be sliced because the amount of acceptable arguments
 * to the Math.max/Math.min functions is limited, and varies across browsers.
 */
function getDomain(data: Record<string, number>[], key: string): [number, number] {
  const iterations = Math.ceil(data.length / 30000);
  let max = -Infinity, min = Infinity;
  for (let index = 0; index < iterations; index++) {
    const slice = data.slice(index * 30000, (index + 1) * 30000);
    const values = slice.map(item => item[key]);
    min = Math.min(min, ...values);
    max = Math.max(max, ...values);
  }
  return [min, max];
}
