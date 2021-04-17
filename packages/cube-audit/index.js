const {Client, DimensionType} = require("@datawheel/olap-client");
const sortBy = require("lodash/sortBy");
const flatMap = require("lodash/flatMap");
const flatten = require("lodash/flatten");
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
  auditServer,
};

/**
 * @param {OlapClient.ServerConfig} server
 * @param {(report: CubeReport) => void} [callback]
 * @returns {Promise<AuditorResult>}
 */
async function auditServer(server, callback) {
  const auditServer = await auditorFactory({loggingLevel: "info", server});
  return auditServer(callback);
}

/**
 * @param {AuditorFactoryOptions} options
 * @returns {Promise<Auditor>}
 */
async function auditorFactory(options) {
  const logger = new Logger(options.loggingLevel);
  const client = await Client.fromURL(options.server);
  const status = await client.checkStatus();

  /** @type {Auditor} */
  const auditor = async (callback) => {
    const report = {
      date: new Date()
        .toLocaleString("en-US", {timeZone: "America/New_York"})
        .replace("T", " ")
        .replace(/\..*$/, ""),
      server: status,
    };

    const cubes = await client.getCubes();
    const sortedCubes = sortBy(cubes, cube => cube.name);
    const meta = {logger, client};

    if (typeof callback === "function") {
      for (const cube of sortedCubes) {
        const validationResult = await cubeValidator(cube, meta);
        callback(validationResult);
      }
      return report;
    }
    else {
      const validatedCubes = sortedCubes.map(cube => cubeValidator(cube, meta));
      return {
        ...report,
        cubes: await Promise.all(validatedCubes)
      };
    }
  };

  return auditor;
}

/**
 * @param {OlapClient.Cube} cube
 * @returns {Promise<CubeReport>}
 */
async function cubeValidator(cube, {logger, client}) {
  const {annotations, dimensions, measures, name} = cube;
  logger.debug("Validating cube:", name);

  const levelCache = new Map();
  const propertyCache = new Map();

  /** @type {Issue[]} */
  const cubeIssues = cubeAnnotations
    .filter(ann => !annotations[ann])
    .map(missAnn => ({
      description: `Missing annotation: \`${missAnn}\``,
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

  /**
   * @param {OlapClient.Measure} measure
   * @returns {Promise<Issue[]>}
   */
  async function validateMeasure(measure) {
    const {annotations, name} = measure;
    logger.debug("- Measure:", name);

    return measureAnnotations
      .filter(ann => !annotations[ann])
      .map(missAnn => ({
        description: `Missing annotation: \`${missAnn}\``,
        entity: "measure",
        level: "high",
        name,
      }));
  }

  /**
   * @param {OlapClient.Dimension} dimension
   * @returns {Promise<Issue[]>}
   */
  async function validateDimension(dimension) {
    logger.debug("- Dimension:", dimension.name);

    /** @type {Issue[]} */
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

      if (dimType) {
        issues.push({
          description: `This dimension may be ${dimType} based.`,
          solution: `${dimType}-related dimensions must be declared in the schema file, using the \`type="${DimensionType[dimType]}"\` attribute on its \`<Dimension>\`/\`<SharedDimension>\` node, in order to enable specific features in tesseract-ui and it's plugins.`,
          entity: "dimension",
          level: "middle",
          name: dimension.name,
        });
      }
    }

    for (const level of dimension.levelIterator) {
      const levelIssues = await validateLevel(level);
      issues.push(...levelIssues);
    }

    return issues;
  }

  /**
   * @param {OlapClient.Level} level
   * @returns {Promise<Issue[]>}
   */
  async function validateLevel(level) {
    logger.debug("- Level:", level.fullName);

    /** @type {Issue[]} */
    const issues = [];

    const cachedLevel = levelCache.get(level.uniqueName);
    if (cachedLevel) {
      issues.push({
        description: `This level needs an uniqueName across its cube. Currently clashes with the uniqueName for "${cachedLevel.fullName}".`,
        solution: `Change one (or all) level name to something unique across the cube, or setup a uniqueName on tesseract's logiclayer.json file.`,
        entity: "level",
        level: "low",
        name: level.fullName
      });
    }
    levelCache.set(level.uniqueName, level);

    const members = await client.getMembers(level).catch(() => {
      logger.error("ERROR", `Unable to get member list\n  Cube: ${level.cube.name}\n  Level: ${level.fullName}`);
    });
    const suspect = members.find(member => /\d[\+\-\*\/\%]\d/.test(member.key + ""));
    if (suspect) {
      const {cube} = level;
      const query = cube.query
        .addMeasure(cube.measures[0])
        .addDrilldown(level)
        .addCut(level, [suspect.key + ""])
        .setOption("debug", true);

      await client.execQuery(query).catch(() => {
        issues.push({
          description: `This level contains at least a member that matches the pattern \`{digit}-{digit}\`, which makes the query fail if used on a cut.`,
          solution: `Ensure the \`<Level />\` in the schema contains a \`key_type="text"\` attribute.`,
          entity: "level",
          level: "low",
          name: level.fullName
        });
      });
    }

    const propValidation = level.properties.map(validateProperty);
    const propIssues = await Promise.all(propValidation);
    issues.push(...flatten(propIssues));

    return issues;
  }

  /**
   * @param {OlapClient.Property} prop
   * @returns {Promise<Issue[]>}
   */
  async function validateProperty(prop) {
    logger.debug("- Property:", prop.fullName);

    /** @type {Issue[]} */
    const issues = [];

    const cachedProp = propertyCache.get(prop.uniqueName);
    if (cachedProp) {
      issues.push({
        description: `The property "${prop.name}", belonging to level "${prop.level.fullName}", needs an uniqueName across its cube. It currently clashes with "${cachedProp.uniqueName}" from level "${cachedProp.level.fullName}".`,
        solution: `Change the property name to something unique across the cube, or setup a uniqueName on tesseract's logiclayer.json file.`,
        entity: "property",
        level: "low",
        name: prop.fullName
      });
    }
    propertyCache.set(prop.uniqueName, prop);

    if (prop.name in prop.cube.measuresByName) {
      issues.push({
        description: `The property "${prop.name}", belonging to level "${prop.level.fullName}", has the same name as a measure, which causes conflicts when using certain functions.`,
        solution: `Use a different property name.`,
        entity: "property",
        level: "low",
        name: prop.fullName
      });
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
  const results = list.map(validator);
  return Promise.all(results).then(flatten);
}
