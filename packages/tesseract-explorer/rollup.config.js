import {terser} from "rollup-plugin-terser";
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
const isDevelopment = environment === "development";
const isProduction = environment === "production";
const sourcemap = isDevelopment ? "inline" : false;

const globals = {
  "@blueprintjs/core": "Blueprint.Core",
  "@blueprintjs/select": "Blueprint.Select",
  "@blueprintjs/table": "Blueprint.Table",
  "@datawheel/tesseract-client": "TesseractOlap",
  "classnames": "classNames",
  "pluralize": "pluralize",
  "react-perfect-scrollbar": "react-perfect-scrollbar",
  "react-dom": "ReactDOM",
  "react-redux": "ReactRedux",
  "react": "React",
  "redux": "Redux"
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
        extensions: [".mjs", ".js", ".jsx", ".json"]
      }),
      postcss({
        extract: true,
        sourcemap: isDevelopment,
        minimize: !isDevelopment,
        plugins: [autoprefixer()]
      }),
      babel({
        exclude: "node_modules/**"
      }),
      commonjs({
        include: ["node_modules/**"],
        namedExports: {}
      }),
      isProduction &&
        terser({
          keep_classnames: true,
          keep_fnames: true,
          mangle: {
            reserved: external
          }
        })
    ],
    external,
    watch: {
      include: ["src/**"],
      exclude: "node_modules/**",
      clearScreen: true
    }
  };
};
