import {useEffect, useMemo, useState} from "react";
import PivotWorker from "../utils/pivot.worker.js";
import {useFormatter} from "./formatter";
import {useTranslation} from "./translation";

/**
 * Encapsulates the logic for the formatting in this component.
 * @param {import("@datawheel/olap-client").PlainMeasure[]} measures
 * @param {string} valueProperty
 */
export function useFormatParams(measures, valueProperty) {
  const {translate: t} = useTranslation();
  const fmt = useFormatter(measures);

  return useMemo(() => {
    const formatterKey = fmt.getFormatterKey(valueProperty) || "undefined";
    const formatter = fmt.getFormatter(formatterKey);
    return {
      formatExample: formatter(12345.6789),
      formatter,
      formatterKey,
      formatterKeyOptions: [{label: t("placeholders.none"), value: "undefined"}]
        .concat(fmt.getAvailableKeys(valueProperty)
          .map(key => ({label: fmt.getFormatter(key)(12345.6789), value: key}))
        ),
      setFormat: fmt.setFormat
    };
  }, [valueProperty, fmt]);
}

/**
 * @param {Record<string, any>[]} data
 * @param {string} colProp
 * @param {string} rowProp
 * @param {string} valProp
 * @param {import("../utils/types").JSONArrays | null} initialState
 * @returns {[import("../utils/types").JSONArrays | null, Error | null]}
 */
export function usePivottedData(data, colProp, rowProp, valProp, initialState = null) {
  const [pivottedData, setPivottedData] = useState(initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPivottedData(initialState);
    setError(null);

    serializeToArray(data, {colProp, rowProp, valProp})
      .then(setPivottedData, setError);

    return () => {
      setPivottedData(null);
      setError(null);
    };
  }, [data, colProp, rowProp, valProp]);

  return [pivottedData, error];
}

/**
 * @param {Record<string, any>[]} data
 * @param {{rowProp: string, colProp: string, valProp: string}} sides
 * @returns {Promise<import("../utils/types.js").JSONArrays>}
 */
function serializeToArray(data, sides) {
  return new Promise((resolve, reject) => {
    const worker = new PivotWorker();
    worker.onmessage = evt => {
      resolve(evt.data);
      worker.terminate();
    };
    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };

    try {
      worker.postMessage({data, sides});
    }
    catch (err) {
      reject(err);
    }
  });
}
