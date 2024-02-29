import {D3plusConfig} from "@datawheel/vizbuilder";
import {Measure} from "@datawheel/olap-client";

/**
 * Normalizes the Vizbuilder Component Property "measureConfig", which can
 * accept both a `(measure: OlapClient.Measure) => D3plusConfig` or a
 * `Record<string, D3plusConfig>, into the function form for internal use.
 */
export function measureConfigAccessor(
  config: Record<string, D3plusConfig> | ((item: Measure) => D3plusConfig)
): (item: Measure) => D3plusConfig {
  if (typeof config === "function") {
    return config;
  }
  return item => config[item.name];
}
