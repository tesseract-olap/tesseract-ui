import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import autoprefixer from "autoprefixer";

import {
  dependencies,
  peerDependencies,
  module as esModulePath,
  main as cjsModulePath
} from "./package.json";

const environment = process.env.NODE_ENV;
const inDevelopment = environment === "development";
const inProduction = environment === "production";
const sourcemap = inDevelopment ? "inline" : false;

const globals = {
  "@blueprintjs/core": "Blueprint.Core",
  "@blueprintjs/select": "Blueprint.Select",
  "@blueprintjs/table": "Blueprint.Table",
  "@datawheel/tesseract-client": "TesseractOlap",
  "classnames": "classNames",
  "form-urlencoded": "formurlencoded",
  "pluralize": "pluralize",
  "react-dom": "ReactDOM",
  "react-perfect-scrollbar": "react-perfect-scrollbar",
  "react-redux": "ReactRedux",
  "react": "React",
  "redux": "Redux",
  "url-join": "urljoin"
};
const external = Object.keys(globals);

const dependencyList = Object.keys({...dependencies, ...peerDependencies});
if (dependencyList.length !== external.length) {
  throw new Error("Remember to also update the dependencies in the rollup configuration.");
}

export default commandLineArgs => {
  return {
    input: "src/index.js",
    output: [
      {
        file: cjsModulePath,
        format: "umd",
        name: "TesseractExplorer",
        globals,
        esModule: false
      },
      {
        file: esModulePath,
        format: "esm",
        sourcemap
      }
    ],
    plugins: [
      replace({
        ENVIRONMENT: JSON.stringify(environment)
      }),
      resolve({
        extensions: [".mjs", ".js", ".jsx"]
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
        include: ["node_modules/**"],
        namedExports: {}
      })
    ],
    external,
    watch: {
      include: ["src/**"],
      exclude: "node_modules/**",
      clearScreen: !inProduction
    }
  };
};
