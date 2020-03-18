import autoprefixer from "autoprefixer";
import babel from "rollup-plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";

const environment = process.env.NODE_ENV;
const inDevelopment = environment === "development";
const inProduction = environment === "production";

const sourcemap = inDevelopment ? "inline" : false;

/** @return {import("rollup").RollupOptions} */
export default commandLineArgs => ({
  input: "src/index.js",
  output: [
    {
      exports: "named",
      file: pkg.main,
      format: "cjs",
      sourcemap
    },
    {
      exports: "named",
      file: pkg.module,
      format: "esm",
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
    postcss({
      extract: "./dist/explorer.css",
      minimize: inProduction,
      plugins: [autoprefixer()],
      sourcemap: inDevelopment
    }),
    babel({
      exclude: "node_modules/**"
    }),
    commonjs({
      include: ["node_modules/**"]
    }),
    cleanup()
  ],
  external: Object.keys({...pkg.dependencies, ...pkg.peerDependencies}),
  watch: {
    include: ["src/**"],
    exclude: "node_modules/**",
    clearScreen: !inProduction
  }
});
