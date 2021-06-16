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
  const {translate: t} = useTranslation();
  const fmt = useFormatter(measures);

  return useMemo(() => {
    const formatterKey = fmt.getFormatterKey(valueProperty) || "undefined";
    return {
      formatter: fmt.getFormatter(formatterKey),
      formatterKey,
      formatterKeyOptions: [{label: t("placeholders.none"), value: "undefined"}]
        .concat(fmt.getAvailableKeys(valueProperty)
          .map(key => ({label: fmt.getFormatter(key)(12345.6789), value: key}))
        ),
      setFormat: fmt.setFormat
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
