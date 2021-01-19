#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const getopts = require("getopts");
const { auditServer } = require(".");

const helpText = `Datawheel / Cube Audit script
Usage: npx @datawheel/cube-audit <server_url> [args]

Commands:
    server_url      The URL to the OLAP server to audit.

Arguments:
    -h, --help      Shows this information.
    -o, --output    The path to the file where to save the report.
                    Defaults to ./cube-audit.md
    -p, --password  The password in case of needing basic authentication.
    -u, --username  The username in case of needing basic authentication.
`;

const options = getopts(process.argv.slice(2), {
  alias: {
    help: "h",
    output: "o",
    password: "p",
    username: "u"
  },
  default: {
    "output": "cube-audit.md"
  },
  boolean: ["help"],
  string: [
    "output",
    "password",
    "username"
  ]
});

runCli(options);

async function runCli(options) {
  if (options.help || options._.includes("help")) {
    console.log(helpText);
    process.exit(0);
  }

  const url = options.url || options._[0];
  if (!url) {
    console.error("Please pass a server URL, example: npx @datawheel/cube-audit https://tesseract-olap.server/");
    process.exit(1);
  }

  const suggestions = [];
  const checkboxIssueShort = issue => `- [ ] ${issue.description}`;
  const checkboxIssueFull = issue => `- [ ] **${issue.entity} \`${issue.name}\`**: ${issue.description}`;

  const server = {
    url,
    auth: options.username && options.password
      ? { username: options.username, password: options.password }
      : undefined,
  };

  const report = await auditServer(server, cube => {
    console.log("Validating cube:", cube.name);
    if (cube.issueCount === 0) return;

    const result = [`\n## Cube: \`${cube.name}\``].concat(
      cube.cubeIssues.length > 0 ? "\n### Cube suggestions" : "",
      cube.cubeIssues.map(checkboxIssueShort),
      cube.dimensionIssues.length > 0 ? "\n### Dimension suggestions" : "",
      cube.dimensionIssues.map(checkboxIssueFull),
      cube.measureIssues.length > 0 ? "\n### Measure suggestions" : "",
      cube.measureIssues.map(checkboxIssueFull)
    );
    suggestions.push(...result);
  });

  const output = `# Cube Audit

Data obtained from ${report.server.url} on ${report.date}.
${suggestions.filter(Boolean).join("\n")}

---
Full documentation for tesseract-ui annotations can be found here: https://github.com/tesseract-olap/tesseract-ui/tree/master/packages/cube-audit#annotations
`;

  const targetPath = path.resolve(process.cwd(), options.output);
  fs.writeFile(targetPath, output, "utf8", err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Report created at", targetPath);
  });
}
