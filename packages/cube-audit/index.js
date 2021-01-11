const {Client, DimensionType} = require("@datawheel/olap-client");
const sortBy = require("lodash/sortBy");
const flatMap = require("lodash/flatMap");
const deburr = require("lodash/deburr");
const {strip} = require("d3plus-text");

const cubeAnnotations = [
  "source_name",
  "source_description",
  "source_link",
  "dataset_name",
  "dataset_link",
  "dataset_description"
];

const measureAnnotations = [
  "aggregation_method",
  "format_template",
  "description"
];

const regexFromList = list => new RegExp(list.map(deburr).join("|"), "i");

const timeRegex = regexFromList([
  "year", "quarter", "month", "week", "day", "date", "time",
  "ano", "cuarta", "mes", "semana", "dia", "fecha", "hora"
]);

const geoRegex = regexFromList([
  "geo",
  "geography", "continent", "country", "region", "state", "province", "municipality", "city",
  "geografía", "continente", "país", "región", "estado", "provincia", "municipio", "ciudad"
]);

module.exports = {auditServer};

/**
 * @param {string | import("axios").AxiosRequestConfig} server
 */
async function auditServer(server) {
  const client = await Client.fromURL(server);
  const status = await client.checkStatus();

  const cubes = await client.getCubes();
  const sortedCubes = sortBy(cubes, cube => cube.name);

  return {
    date: new Date()
      .toLocaleString("en-US", {timeZone: "America/New_York"})
      .replace("T", " ")
      .replace(/\..*$/, ""),
    server: status,
    cubes: flatMap(sortedCubes, validateCube)
  };
}

/**
 * @param {import("@datawheel/olap-client").Cube} cube
 */
function validateCube(cube) {
  const {dimensions, measures, annotations} = cube;

  const cubeIssues = cubeAnnotations
    .filter(ann => !annotations[ann])
    .map(missAnn => ({
      description: "Missing annotation: ".concat(missAnn),
      entity: "cube",
      level: "high",
      name: cube.name,
    }));

  const dimensionIssues = flatMap(dimensions, validateDimension);
  const measureIssues = flatMap(measures, validateMeasure);

  return {
    name: cube.name,
    issueCount: cubeIssues.length + dimensionIssues.length + measureIssues.length,
    cubeIssues,
    dimensionIssues,
    measureIssues,
  };
}

/**
 * @param {import("@datawheel/olap-client").Measure} measure
 */
function validateMeasure(measure) {
  const {annotations} = measure;
  return measureAnnotations
    .filter(ann => !annotations[ann])
    .map(missAnn => ({
      description: "Missing annotation: ".concat(missAnn),
      entity: "measure",
      level: "high",
      name: measure.name,
    }));
}

/**
 * @param {import("@datawheel/olap-client").Dimension} dimension
 */
function validateDimension(dimension) {
  if (dimension.dimensionType !== DimensionType.Standard) {
    const testNames = flatMap(
      [dimension, ...dimension.levelIterator],
      item => [item.name, item.caption].map(s => strip(s.toLowerCase()))
    );

    const dimType = testNames.some(s => timeRegex.test(s))
      ? "Time"
      : testNames.some(s => geoRegex.test(s))
        ? "Geographic"
        : undefined;

    if (dimType) return {
      description: `This dimension may be ${dimType} based. If so, add \`type="${DimensionType[dimType]}"\` to the \`<Dimension>\`/\`<SharedDimension>\` in your schema files to enable ${dimType.toLowerCase()}-specific features in tesseract-ui and it's plugins.`,
      entity: "dimension",
      level: "middle",
      name: dimension.name,
    };
  }

  // flatMap will invisibly merge this empty array as if never existed
  return [];
}
