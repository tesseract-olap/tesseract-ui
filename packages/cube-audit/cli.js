#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const flatMap = require("lodash/flatMap");
const { auditServer } = require(".");

runCli(process.argv[2]);

/** */
async function runCli(serverUrl) {
  if (!serverUrl) {
    console.error("Please pass a cube URL, example: npx cube-audit https://tesseract-olap.server/");
    return;
  }

  const report = await auditServer(serverUrl);

  const checkboxIssueShort = issue => `- [ ] ${issue.description}`;
  const checkboxIssueFull = issue => `- [ ] **${issue.entity} \`${issue.name}\`**: ${issue.description}`;

  const suggestions = flatMap(
    report.cubes.filter(cube => cube.issueCount > 0),
    cube => [`\n## Cube: \`${cube.name}\``].concat(
      cube.cubeIssues.length > 0 ? "\n### Cube suggestions" : "",
      cube.cubeIssues.map(checkboxIssueShort),
      cube.dimensionIssues.length > 0 ? "\n### Dimension suggestions" : "",
      cube.dimensionIssues.map(checkboxIssueFull),
      cube.measureIssues.length > 0 ? "\n### Measure suggestions" : "",
      cube.measureIssues.map(checkboxIssueFull)
    )
  );

  const output = `# Cube Audit

Data obtained from ${report.server.url} on ${report.date}.
${suggestions.filter(Boolean).join("\n")}

---
Full documentation for tesseract-ui annotations can be found here: https://github.com/tesseract-olap/tesseract-ui/tree/master/packages/cube-audit#annotations
`;

  const targetPath = path.resolve(process.cwd(), "cube-audit.md");
  fs.writeFile(targetPath, output, "utf8", err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Report created at", targetPath);
  });
}
