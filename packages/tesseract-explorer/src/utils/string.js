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
${Object.keys(datum).map(key => `  "${key}": ${typeof datum[key]};`).join("\n")}
}
`;
}

/**
 * @param {object} params
 * @param {string} params.configInterface
 * @param {string[]} params.levelNames
 * @param {string} params.rowLevelName
 * @param {string} params.valMeasureName
 * @param {string} params.chartConfig
 */
export function buildChartConfig(params) {
  return `// region chart-config
/** @type {Partial<${params.configInterface}<Datum>>} */
let config;
const measureName = "${params.valMeasureName}";
const levelNames = ${JSON.stringify(params.levelNames, null, 2)};
const levelName = levelNames[0];
// endregion

${params.chartConfig.replace(
    /\/\/\sregion chart-config[\s\S]+\/\/\sendregion[\s\n\t]+/,
    ""
  )}`;
}

/**
 * Retrieves the caption property from a OlapClient entity object.
 * @param {import("./types").Annotated & {caption?: string; name: string;}} item
 * @param {string} [locale]
 */
export function getCaption(item, locale = "en") {
  return getAnnotation(item, "caption", locale) || item.caption || item.name;
}

/**
 * Retrieves the (maybe localized) value of an `Annotated` object.
 * @param {import("./types").Annotated} item
 * @param {string} key
 * @param {string} locale
 * @returns {string | undefined}
 */
export function getAnnotation(item, key, locale = "xx") {
  const ann = item.annotations;
  return ann[`${key}_${locale}`] || ann[`${key}_${locale.slice(0, 2)}`] || ann[key];
}

/**
 * Parses a string into a integer; if value is not an integer, returns default.
 * @template T
 * @param {string | undefined} value
 * @param {T} elseValue
 */
export function parseNumeric(value, elseValue) {
  return value && Number.isFinite(value) && !Number.isNaN(value)
    ? Number.parseFloat(value)
    : elseValue;
}
