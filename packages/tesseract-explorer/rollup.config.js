import path from "path";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import autoprefixer from "autoprefixer";
import cleanup from "rollup-plugin-cleanup";
import {string} from "rollup-plugin-string";
import styles from "rollup-plugin-styles";

import pkg from "./package.json";

const environment = process.env.NODE_ENV;
const inDevelopment = environment === "development";
const inProduction = environment === "production";

const extPackages = Object.keys({...pkg.dependencies, ...pkg.peerDependencies});
const sourcemap = inDevelopment ? "hidden" : false;

/** @return {import("rollup").RollupOptions} */
export default commandLineArgs => ({
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      assetFileNames: "[name][extname]",
      exports: "named",
      sourcemap
    },
    {
      file: pkg.module,
      format: "esm",
      assetFileNames: "[name][extname]",
      exports: "named",
      sourcemap
    }
  ],
  plugins: [
    json(),
    replace({
      ENVIRONMENT: JSON.stringify(environment)
    }),
    resolve({
      extensions: [".mjs", ".js", ".jsx"],
      preferBuiltins: true
    }),
    string({
      include: ["**/*.d.ts"]
    }),
    styles({
      mode: ["extract", path.basename(pkg.style)],
      plugins: [autoprefixer()],
      sourcemap: inDevelopment
    }),
    babel({
      babelHelpers: "runtime",
      exclude: "node_modules/**"
    }),
    commonjs({
      include: ["node_modules/**"]
    }),
    cleanup()
  ],
  external: id => extPackages.some(pkg => id.startsWith(pkg)),
  watch: {
    include: ["src/**"],
    exclude: "node_modules/**",
    clearScreen: !inProduction
  }
});
