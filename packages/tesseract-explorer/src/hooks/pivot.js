import {useEffect, useMemo, useState} from "react";
import {serializeToArray} from "../utils/pivot";
import {useFormatter} from "./formatter";
import {useTranslation} from "./translation";

/**
 * Encapsulates the logic for the formatting in this component.
 * @param {OlapClient.PlainMeasure[]} measures
 * @param {string} valueProperty
 */
export function useFormatParams(measures, valueProperty) {
  const {
    getAvailableKeys,
    getFormatter,
    getFormatterKey,
    setFormat
  } = useFormatter(measures);

  const {translate: t} = useTranslation();

  return useMemo(() => {
    const formatterKey = getFormatterKey(valueProperty) || "undefined";
    return {
      formatter: getFormatter(formatterKey),
      formatterKey,
      formatterKeyOptions: [{label: t("placeholders.none"), value: "undefined"}]
        .concat(getAvailableKeys(valueProperty)
          .map(key => ({label: getFormatter(key)(12345.6789), value: key}))
        ),
      setFormat
    };
  }, [valueProperty]);
}

/**
 * @param {Record<string, any>[]} data
 * @param {string} colProp
 * @param {string} rowProp
 * @param {string} valProp
 * @param {JSONArrays | null} initialState
 */
export function usePivottedData(data, colProp, rowProp, valProp, initialState = null) {
  const [pivottedData, setPivottedData] = useState(initialState);

  useEffect(() => {
    serializeToArray(data, {colProp, rowProp, valProp}).then(setPivottedData);
    return () => setPivottedData(null);
  }, [data, colProp, rowProp, valProp]);

  return pivottedData;
}
