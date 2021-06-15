/* eslint-disable comma-dangle */
/* eslint-disable lines-around-comment */

import {format, formatAbbreviate} from "d3plus-format";
import {useCallback, useEffect, useRef, useState} from "react";
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

  /** @type {(refKey: string, formatter: string) => void} */
  const setFormat = useCallback((refKey, formatter) => setCurrentFormats({
    ...currentFormats,
    [refKey]: formatter
  }), [currentFormats]);

  return {
    getAvailableKeys(ref) {
      const originKey = originKeys.current[ref];
      return originKey ? [originKey].concat(basicFormatterKeys) : basicFormatterKeys;
    },
    getFormatter(key) {
      if ((/^[A-Z]{3}$/).test(key)) {
        return formatters[key] || (key => {
          const options = {style: "currency", currency: key};
          const formatter = new Intl.NumberFormat(undefined, options).format;
          formatters[key] = formatter;
          return formatter;
        })(key);
      }
      try {
        return formatters[key] || defaultFormatters[key] || format(key);
      }
      catch {
        console.error(`Formatter not configured: "${key}"`);
        return defaultFormatters.identity;
      }
    },
    getFormatterKey(ref) {
      return currentFormats[ref] || originKeys.current[ref];
    },
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
