/* eslint-disable comma-dangle */
/* eslint-disable lines-around-comment */

import {format, formatAbbreviate} from "d3plus-format";
import {useEffect, useRef, useState} from "react";
import {useSettings} from "./settings";

export const defaultFormatters = {
  undefined: n => n,
  identity: n => `${n}`,
  Decimal: new Intl.NumberFormat(undefined, {useGrouping: false}).format,
  Dollars: new Intl.NumberFormat(undefined, {style: "currency", currency: "USD"}).format,
  Human: n => formatAbbreviate(n, "en-US"),
  Milliards: new Intl.NumberFormat(undefined, {useGrouping: true}).format
};

export const basicFormatterKeys = ["Decimal", "Milliards", "Human"];

/**
 * React Hook to get a list of available formatters and store the user preferences.
 * @param {OlapClient.PlainMeasure[]} measures
 * @returns {FormatterHookContext}
 */
export function useFormatter(measures) {
  const {formatters} = useSettings();

  const [currentFormats, setCurrentFormats] = useState({});
  const originKeys = useRef({});

  useEffect(() => {
    /** @type {[string, string | undefined][]} */
    const tuplesRefKey = measures.map(item => {
      const {annotations: ann} = item;
      return [item.name, ann.format_template || ann.units_of_measurement];
    });
    const record = Object.fromEntries(tuplesRefKey);
    originKeys.current = record;
    setCurrentFormats(record);
  }, [measures]);

  const setFormat = (ref, formatter) => setCurrentFormats({
    ...currentFormats,
    [ref]: formatter
  });

  const getAvailableKeys = ref => {
    const originKey = originKeys.current[ref];
    return originKey ? [originKey].concat(basicFormatterKeys) : basicFormatterKeys;
  };

  const getFormatterKey = ref => currentFormats[ref] || originKeys.current[ref];

  const getFormatter = key => {
    if ((/^[A-Z]{3}$/).test(key)) {
      return formatters[key] || new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: key
      }).format;
    }
    try {
      return formatters[key] || defaultFormatters[key] || format(key);
    }
    catch {
      console.error(`Formatter not configured: "${key}"`);
      return defaultFormatters.identity;
    }
  };

  return {
    getAvailableKeys,
    getFormatter,
    getFormatterKey,
    setFormat,
  };
}

/**
 * @typedef FormatterHookContext
 * @property {(ref: string) => string[]} getAvailableKeys
 * @property {(ref: string) => string | undefined} getFormatterKey
 * @property {(key: string) => TessExpl.Formatter} getFormatter
 * @property {(ref: string, key: string) => void} setFormat
 */
