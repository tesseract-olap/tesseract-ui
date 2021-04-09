import {format} from "d3plus-format";
import {useEffect, useMemo, useState} from "react";
import {useSettings} from "../hooks/settings";
import {regroup} from "./transform";

/**
 * React Hook to get a list of available formatters and store the user preferences.
 * @param {import("@datawheel/olap-client").AdaptedMeasure[]} measures
 * @returns {[Record<string, string | undefined>, Record<string, string | undefined>, React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>]}
 */
export function useFormatter(measures) {
  const {formatters} = useSettings();

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

  const getFormatter = key => {
    if ((/^[A-Z]{3}$/).test(key)) {
      return new Intl.NumberFormat(undefined, {style: "currency", currency: key}).format;
    }
    return formatters[key] || defaultFormatters[key] || format(key);
  };

  const [userFormats, setUserFormats] = useState(formatTemplates);

  useEffect(() => {
    setUserFormats(formatTemplates);
  }, [formatTemplates]);

  return {formatTemplates, getFormatter, userFormats, setUserFormats};
}
