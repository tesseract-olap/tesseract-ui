import formUrlEncode from "form-urlencoded";
import {SERIAL_BOOLEAN} from "../enums";
import {asArray, filterMap} from "./array";
import {CutItem, DrilldownItem, FilterItem, MeasureItem, QueryParams, buildCut, buildDrilldown, buildFilter, buildMeasure} from "./structs";
import {keyBy, parseName, stringifyName} from "./transform";
import {isActiveCut, isActiveItem} from "./validation";

export interface SerializedQuery {
  cube: string;
  drilldowns: string[];
  measures: string[];
  booleans?: number;
  cuts?: string[];
  filters?: string[];
  locale?: string;
  preview?: 1 | undefined;
}

/**
 *
 */
export function serializePermalink(params: QueryParams): string {
  return formUrlEncode(serializeStateToSearchParams(params), {
    ignorenull: true,
    skipIndex: false,
    sorted: true
  });
}

/**
 *
 */
function serializeStateToSearchParams(query: QueryParams): SerializedQuery {
  const cuts = filterMap(Object.values(query.cuts), item =>
    isActiveCut(item) ? serializeCut(item) : null
  );

  const drilldowns = filterMap(Object.values(query.drilldowns), item =>
    isActiveItem(item) ? serializeDrilldown(item) : null
  );

  const filters = filterMap(Object.values(query.filters), item =>
    isActiveItem(item) ? serializeFilter(item) : null
  );

  const measures = filterMap(Object.values(query.measures), item =>
    isActiveItem(item) ? serializeMeasure(item) : null
  );

  const booleans = Object.keys(query.booleans).reduce((sum, key) => {
    const value = query.booleans[key] && SERIAL_BOOLEAN[key.toUpperCase()];
    return sum + (value || 0);
  }, 0);

  return {
    cube: query.cube,
    drilldowns,
    measures,
    booleans: booleans > 0 ? booleans : undefined,
    cuts: cuts.length > 0 ? cuts : undefined,
    filters: filters.length > 0 ? filters : undefined,
    locale: query.locale ? query.locale : undefined,
    preview: query.isPreview ? 1 : undefined
  };

  /**
   */
  function serializeCut(item: CutItem): string {
    return [stringifyName(item)].concat(item.members).join(",");
  }

  /**
   */
  function serializeDrilldown(item: DrilldownItem): string {
    return [stringifyName(item)].concat(
      filterMap(item.properties, prop =>
        isActiveItem(prop) ? prop.name : null
      )
    ).join(",");
  }

  /**
   */
  function serializeFilter(item: FilterItem): string {
    return `${item.measure},${item.comparison},${item.interpretedValue}`;
  }

  /**
   *
   * @param {import("./structs").MeasureItem} item
   * @returns
   */
  function serializeMeasure(item) {
    return `${item.key}`;
  }
}

/**
 *
 */
export function parseStateFromSearchParams(query: SerializedQuery): QueryParams {
  const getKey = i => i.key;

  /** @type {Record<string, TessExpl.Struct.CutItem>} */
  const cuts = Object.create(null);

  /** @type {Record<string, TessExpl.Struct.DrilldownItem>} */
  const drilldowns = Object.create(null);

  return {
    booleans: parseBooleans(query.booleans || 0),
    cube: query.cube,
    cuts: asArray(query.cuts).reduce(cutReducer, cuts),
    drilldowns: asArray(query.drilldowns).reduce(drilldownReducer, drilldowns),
    filters: keyBy(asArray(query.filters).map(parseFilter), getKey),
    isPreview: query.preview === 1,
    locale: query.locale,
    measures: keyBy(asArray(query.measures).map(parseMeasure), getKey),
    pagiLimit: 0,
    pagiOffset: 0,
    sortDir: "desc",
    sortKey: undefined
  };

  /**
   */
  function cutReducer(cuts: Record<string, CutItem>, item: string) {
    const [fullName, ...members] = item.split(",");
    const cut = buildCut({...parseName(fullName), active: true, members});

    // fullName is normalized into descriptor, so this is better for comparison
    const matchingCut = Object.values(cuts).find(item =>
      item.dimension === cut.dimension &&
      item.hierarchy === cut.hierarchy &&
      item.level === cut.level
    );
    if (matchingCut) {
      const memberSet = new Set([...matchingCut.members, ...cut.members]);
      cut.members = [...memberSet].sort();
    }
    cuts[cut.key] = cut;

    return cuts;
  }

  /**
   */
  function drilldownReducer(drilldowns: Record<string, DrilldownItem>, item: string) {
    const [fullName, ...props] = item.split(",");
    const nameParts = parseName(fullName);
    const properties = props.map(name => ({active: true, level: nameParts.level, name}));
    const ddn = buildDrilldown({...nameParts, active: true, properties, key: fullName});
    drilldowns[ddn.key] = ddn;
    return drilldowns;
  }

  /**
   */
  function parseBooleans(item: number): Record<string, boolean> {
    const booleans: Record<string, boolean> = Object.create(null);

    Object.keys(SERIAL_BOOLEAN).forEach(key => {
      const value = item & SERIAL_BOOLEAN[key];
      if (value > 0) {
        booleans[key.toLowerCase()] = true;
      }
    });

    return booleans;
  }

  /**
   */
  function parseFilter(item: string): FilterItem {
    const [measure, comparison, inputtedValue] = item.split(",");
    return buildFilter({
      active: true,
      comparison,
      inputtedValue,
      interpretedValue: Number.parseFloat(inputtedValue),
      measure
    });
  }

  /**
   */
  function parseMeasure(item: string): MeasureItem {
    return buildMeasure({
      active: true,
      key: item,
      name: item
    });
  }
}
