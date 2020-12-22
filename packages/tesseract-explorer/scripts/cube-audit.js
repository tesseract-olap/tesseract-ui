#!/usr/bin/env node

const {Client, DimensionType} = require("@datawheel/olap-client"),
      {merge} = require("d3-array"),
      {strip} = require("d3plus-text"),
      fs = require("fs"),
      path = require("path");

const ENDPOINT = process.argv[2];
if (!ENDPOINT) {
  console.error("Please pass a cube URL, example: npx cube-audit https://api.oec.world/tesseract/");
}

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

const timeDimensions = [
  "year", "quarter", "month", "week", "day", "date", "time",
  "ano", "cuarta", "mes", "semana", "dia", "fecha", "hora"
];
const timeRegex = new RegExp(timeDimensions.join("|"));

const geoDimensions = [
  "geo",
  "geography", "continent", "country", "region", "state", "province", "municipality", "city",
  "geografía", "continente", "país", "región", "estado", "provincia", "municipio", "ciudad"
];
const geoRegex = new RegExp(geoDimensions.join("|"));

/** */
async function run() {

  const client = await new Client.fromURL(ENDPOINT);

  const cubes = await client.getCubes();

  const now = new Date()
    .toLocaleString("en-US", {timeZone: "America/New_York"})
    .replace("T", " ")
    .replace(/\..*$/, "");

  let row = "# Cube Audit\n\n";
  row += `Data obtained from ${ENDPOINT} on ${now}.\n\n`;

  cubes
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(cube => {

      const {dimensions, measures, annotations} = cube;

      const dimensionSuggestions = dimensions
        .filter(({dimensionType}) => dimensionType === DimensionType.Standard)
        .reduce((arr, dimension) => {

          const {caption, name} = dimension;

          const levelNames = dimension.hierarchies
            .map(hierarchy => hierarchy.levels.map(level => [level.name, level.caption]))
            .map(merge);

          const testNames = [name, caption]
            .concat(merge(levelNames))
            .map(s => strip(s.toLowerCase()))
            .filter((d, i, arr) => arr.indexOf(d) === i);

          if (testNames.some(s => timeRegex.test(s))) arr.push({type: "Time", name});
          if (testNames.some(s => geoRegex.test(s))) arr.push({type: "Geographic", name});
          return arr;

        }, []);

      const cubeSuggestions = cubeAnnotations
        .filter(a => !annotations[a]);

      const measureSuggestions = measures
        .filter(measure => measureAnnotations.filter(a => !measure.annotations[a]).length);

      if (cubeSuggestions.length || measureSuggestions.length) {

        row += `## Cube: \`${cube.name}\`\n\n`;

        if (cubeSuggestions.length) {
          row += "### Suggested Cube Annotations\n\n";
          cubeSuggestions.forEach(a => row += `- [ ] ${a}\n`);
        }
        row += "\n";

        if (dimensionSuggestions.length) {
          let dimType;
          dimensionSuggestions.forEach(d => {
            if (d.type !== dimType) {
              if (dimType) row += "\n";
              dimType = d.type;
              row += `### Suggested ${dimType} Dimensions\n`;
              row += `The members in the following dimemsions may be ${dimType} based. If so, add \`type="${DimensionType[dimType]}"\` to the \`<Dimension>\`/\`<SharedDimension>\` in your schema files to enable ${dimType.toLowerCase()}-specific features in tesseract-ui and it's plugins.\n\n`;
            }
            row += `- [ ] ${d.name}\n`;
          });
        }
        row += "\n";

        if (measureSuggestions.length) {
          row += "### Suggested Measure Annotations\n\n";
          measureSuggestions.forEach(measure => {
            row += `#### ${measure.name}\n`;
            const missing = measureAnnotations.filter(a => !measure.annotations[a]);
            missing.forEach(a => row += `- [ ] ${a}\n`);
            row += "\n";
          });
        }

      }

      row += "----\n";
      row += "\n";
      row += "Full documentation for tesseract-ui annotations can be found here: https://github.com/tesseract-olap/tesseract-ui/tree/master/packages/tesseract-explorer#annotations";

    });

  fs.writeFile(path.join(process.cwd(), "cube-audit.md"), row, "utf8", err => {
    if (err) console.log(err);
    else console.log("created cubes-audit.md");
  });

}

run();
