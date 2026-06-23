/**
 * Generates a short random string
 */
export function randomKey() {
  return Math.random().toString(16).slice(2);
}

/** */
export function decodeUrlFromBase64(str) {
  const decodedStr = (str + "===".slice((str.length + 3) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  return window.atob(decodedStr);
}

/** */
export function buildDatumTypes(datum) {
  return `interface Datum {
${Object.keys(datum)
  .map((key) => `  "${key}": ${typeof datum[key]};`)
  .join("\n")}
}
`;
}

/**
 */
export function buildChartConfig(params: {
  configInterface: string;
  levelNames: string[];
  rowLevelName: string;
  valMeasureName: string;
  chartConfig: string;
}) {
  return `// region chart-config
/** @type {Partial<${params.configInterface}<Datum>>} */
let config;
const measureName = "${params.valMeasureName}";
const levelNames = ${JSON.stringify(params.levelNames, null, 2)};
const levelName = levelNames[0];
// endregion

${params.chartConfig.replace(
  /\/\/\sregion chart-config[\s\S]+\/\/\sendregion[\s\n\t]+/,
  "",
)}`;
}

/**
 * Retrieves the caption property from a OlapClient entity object.
 */
export function getCaption(
  item: import("./types").Annotated & {
    caption?: string;
    uniqueName?: string;
    name: string;
  },
  locale?: string | undefined,
): string {
  return (
    getAnnotation(item, "caption", locale) || item.caption || item.uniqueName || item.name
  );
}

/**
 * Retrieves the (maybe localized) value of an `Annotated` object.
 */
export function getAnnotation(
  item: import("./types").Annotated,
  key: string,
  locale?: string,
): string | undefined {
  const ann = item.annotations;
  return ann[`${key}_${locale}`] || ann[`${key}_${locale?.slice(0, 2)}`] || ann[key];
}

/**
 * Parses a string into a integer; if value is not an integer, returns default.
 */
export function parseNumeric<T>(value: string | undefined, elseValue: T): number | T {
  return value && Number.isFinite(value) && !Number.isNaN(value)
    ? Number.parseFloat(value)
    : elseValue;
}
