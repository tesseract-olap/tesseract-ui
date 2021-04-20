import path from "path";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import autoprefixer from "autoprefixer";
import cleanup from "rollup-plugin-cleanup";
import styles from "rollup-plugin-styles";

/** @returns {import("rollup").RollupOptions} */
export default cliArgs => {
  const environment = cliArgs.env || process.env.NODE_ENV || "development";
  const inDevelopment = environment === "development";
  const inProduction = environment === "production";

  const manifestPath = path.resolve("./package.json");
  const pkg = require(manifestPath);

  const extPackages = Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies
  });

  return {
    input: path.resolve("./src/index.js"),
    output: [
      {
        file: path.resolve(pkg.main),
        format: "cjs",
        assetFileNames: "[name][extname]",
        exports: "named",
        sourcemap: inDevelopment ? "hidden" : false
      },
      {
        file: path.resolve(pkg.module),
        format: "esm",
        assetFileNames: "[name][extname]",
        exports: "named",
        sourcemap: inDevelopment ? "hidden" : false
      }
    ],
    plugins: [
      json(),
      replace({
        preventAssignment: true,
        values: {
          ENVIRONMENT: JSON.stringify(environment)
        }
      }),
      resolve({
        extensions: [".mjs", ".js", ".jsx"],
        preferBuiltins: true
      }),
      babel({
        babelHelpers: "runtime",
        envName: environment,
        exclude: "node_modules/**",
        rootMode: "upward"
      }),
      styles({
        mode: ["extract", path.basename(pkg.style)],
        plugins: [autoprefixer()],
        sourcemap: inDevelopment
      }),
      commonjs({
        include: ["node_modules/**"]
      }),
      // inProduction && terser(),
      cleanup()
    ],
    external: id => extPackages.some(pkg => id.startsWith(pkg)),
    watch: {
      include: ["src/**"],
      exclude: "node_modules/**",
      clearScreen: !inProduction
    }
  };
};
