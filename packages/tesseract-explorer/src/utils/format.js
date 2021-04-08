import {regroup, splitName} from "./transform";
import {isFilterItem} from "./validation";
import {formatAbbreviate} from "d3plus-format";
import { useEffect, useMemo, useState } from "react";

export const defaultFormatters = {
  identity: n => `${n}`,
  Decimal: new Intl.NumberFormat(undefined, {useGrouping: false}).format,
  Dollars: new Intl.NumberFormat(undefined, {style: "currency", currency: "USD"}).format,
  Human: n => formatAbbreviate(n, "en-US"),
  Milliards: new Intl.NumberFormat(undefined, {useGrouping: true}).format
};

/**
 * React Hook to get a list of available formatters and store the user preferences.
 * @param {import("@datawheel/olap-client").AdaptedMeasure[]} measures
 * @returns {[Record<string, string | undefined>, Record<string, string | undefined>, React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>]}
 */
export function useFormatter(measures) {
  /** @type {Record<string, string | undefined>} */
  const formatTemplates = useMemo(() => {
    /** @type {Map<string, any>} */
    const map = regroup(
      measures,
      result => result[0].annotations.format_template ||
                result[0].annotations.units_of_measurement,
      item => item.name
    );
    return Object.fromEntries([...map.entries()]);
  }, [measures]);

  const [userFormats, setUserFormats] = useState(formatTemplates);

  useEffect(() => {
    setUserFormats(formatTemplates);
  }, [formatTemplates]);

  return [formatTemplates, userFormats, setUserFormats];
}

/**
 * Simplifies a fullname for UI display.
 * The returned value mustn't be used as identifier, as is not reversable.
 * @param {string | string[]} nameParts
 * @param {string} joint
 */
export function abbreviateFullName(nameParts, joint = "/") {
  if (!nameParts) {
    return "";
  }

  if (typeof nameParts === "string") {
    nameParts = splitName(nameParts);
  }

  const target = [];
  let n = nameParts.length;
  while (n--) {
    const token = nameParts[n];
    if (target.indexOf(token) === -1) {
      target.unshift(token);
    }
  }

  return target.join(joint);
}

/**
 * @param {TessExpl.Struct.FilterItem} filter
 * @returns {string}
 */
export function summaryFilter(filter) {
  if (!isFilterItem(filter)) return "";
  return `${filter.measure} ${filter.comparison} ${filter.interpretedValue}`;
}

/**
 * @param {TessExpl.Struct.GrowthItem} growth
 */
export function summaryGrowth(growth) {
  return {
    level: abbreviateFullName(growth.level),
    measure: growth.measure
  };
}

/**
 * @param {TessExpl.Struct.RcaItem} rca
 */
export function summaryRca(rca) {
  return {
    level1: abbreviateFullName(rca.level1),
    level2: abbreviateFullName(rca.level2),
    measure: rca.measure
  };
}

/**
 * @param {TessExpl.Struct.TopkItem} topk
 */
export function summaryTopk(topk) {
  return {
    amount: topk.amount,
    level: abbreviateFullName(topk.level),
    measure: topk.measure,
    order: topk.order
  };
}
