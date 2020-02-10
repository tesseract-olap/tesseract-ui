/**
 * Generates a short random string
 */
export function randomKey() {
  return Math.random().toString(16).slice(2);
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
