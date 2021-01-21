const {Client, DimensionType} = require("@datawheel/olap-client");
const sortBy = require("lodash/sortBy");
const flatMap = require("lodash/flatMap");
const deburr = require("lodash/deburr");
const {strip} = require("d3plus-text");
const {Logger} = require("./logger");

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

module.exports = {
  auditorFactory,
  auditServer: async (server, callback) => {
    const auditServer = await auditorFactory({loggingLevel: "info", server});
    return auditServer(callback);
  }
};

/**
 * @param {object} options
 * @param {string} options.loggingLevel
 * @param {import("axios").AxiosRequestConfig} options.server
 */
async function auditorFactory(options) {
  const logger = new Logger(options.loggingLevel);
  const client = await Client.fromURL(options.server);
  const status = await client.checkStatus();

  return auditServer;

  /**
   * Runs the auditor against the configured server
   * @param {(cubeReport: any) => void} [cubeCallback]
   */
  async function auditServer(cubeCallback) {
    const report = {
      date: new Date()
        .toLocaleString("en-US", {timeZone: "America/New_York"})
        .replace("T", " ")
        .replace(/\..*$/, ""),
      server: status,
    };

    const cubes = await client.getCubes();
    const sortedCubes = sortBy(cubes, cube => cube.name);

    if (typeof cubeCallback === "function") {
      for (const cube of sortedCubes) {
        const cubeValidationResult = await validateCube(cube);
        cubeCallback(cubeValidationResult);
      }
      return report;
    }
    else {
      return {
        ...report,
        cubes: await Promise.all(sortedCubes.map(validateCube))
      };
    }
  }

  /**
   * @param {import("@datawheel/olap-client").Cube} cube
   * @returns {Promise<CubeReport>}
   */
  async function validateCube(cube) {
    const {annotations, dimensions, measures, name} = cube;
    logger.debug("Validating cube:", name);

    /** @type {Issue[]} */
    const cubeIssues = cubeAnnotations
      .filter(ann => !annotations[ann])
      .map(missAnn => ({
        description: "Missing annotation: ".concat(missAnn),
        entity: "cube",
        level: "high",
        name,
      }));

    const dimensionIssues = await asyncValidation(dimensions, validateDimension);
    const measureIssues = await asyncValidation(measures, validateMeasure);

    return {
      name,
      issueCount: cubeIssues.length + dimensionIssues.length + measureIssues.length,
      cubeIssues,
      dimensionIssues,
      measureIssues,
    };
  }

  /**
   * @param {import("@datawheel/olap-client").Measure} measure
   * @returns {Promise<Issue[]>}
   */
  async function validateMeasure(measure) {
    const {annotations, name} = measure;
    logger.debug("- Measure:", name);

    return measureAnnotations
      .filter(ann => !annotations[ann])
      .map(missAnn => ({
        description: "Missing annotation: ".concat(missAnn),
        entity: "measure",
        level: "high",
        name,
      }));
  }

  /**
   * @param {import("@datawheel/olap-client").Dimension} dimension
   * @returns {Promise<Issue[]>}
   */
  async function validateDimension(dimension) {
    logger.debug("- Dimension:", dimension.name);

    const issues = [];

    if (dimension.dimensionType === DimensionType.Standard) {
      const testNames = flatMap(
        [dimension, ...dimension.levelIterator],
        item => [item.name, item.caption].map(s => strip(s.toLowerCase()))
      );

      const dimType = testNames.some(s => timeRegex.test(s))
        ? "Time"
        : testNames.some(s => geoRegex.test(s))
          ? "Geographic"
          : undefined;

      if (dimType) issues.push({
        description: `This dimension may be ${dimType} based. If so, add \`type="${DimensionType[dimType]}"\` to the \`<Dimension>\`/\`<SharedDimension>\` in your schema files to enable ${dimType.toLowerCase()}-specific features in tesseract-ui and it's plugins.`,
        entity: "dimension",
        level: "middle",
        name: dimension.name,
      });
    }

    for (const level of dimension.levelIterator) {
      const levelIssues = await validateLevel(level);
      issues.push(...levelIssues);
    }

    return issues;
  }

  /**
   * @param {import("@datawheel/olap-client").Level} level
   * @returns {Promise<Issue[]>}
   */
  async function validateLevel(level) {
    logger.debug("- Level:", level.fullName);

    const issues = [];

    let suspect;
    try {
      const members = await client.getMembers(level);
      suspect = members.find(member => /\d[\+\-\*\/\%]\d/.test(member.key + ""));
    }
    catch (e) {
      logger.error("ERROR", `Unable to get member list\n  Cube: ${level.cube.name}\n  Level: ${level.fullName}`);
    }

    if (suspect) {
      const {cube} = level;
      const query = cube.query
        .addMeasure(cube.measures[0])
        .addDrilldown(level)
        .addCut(level, [suspect.key + ""])
        .setOption("debug", true);

      try {
        await client.execQuery(query);
      }
      catch (e) {
        issues.push({
          description: `The level "${level.name}" contains at least a member that matches \`{digit}-{digit}\`, which is failing on a cut. Ensure the level has a \`key_type="text"\` attribute.`,
          entity: "level",
          level: "low",
          name: level.fullName
        });
      }
    }

    return issues;
  }
}

/**
 * @template T
 * @param {T[]} list
 * @param {(item: T) => Promise<Issue[]>} validator
 */
async function asyncValidation(list, validator) {
  /** @type {Issue[]} */
  const results = [];
  for (const item of list) {
    const result = await validator(item);
    results.push(...result);
  }
  return results;
}

/**
 * @typedef CubeReport
 * @property {string} name The name of the cube this report refers to.
 * @property {number} issueCount The total amount of issues
 * @property {Issue[]} cubeIssues The list of issues related to this cube overall
 * @property {Issue[]} dimensionIssues The list of issues related to this cube's dimensions
 * @property {Issue[]} measureIssues The list of issues related to this cube's measures
 */

/**
 * @typedef Issue
 * @property {string} description A text explaining the issue, and optionally a way to solve it.
 * @property {string} entity The object in the cube abstraction with the problem.
 * @property {string} level The priority level of the problem.
 * @property {string} name The name of the object in the abstraction.
 */
