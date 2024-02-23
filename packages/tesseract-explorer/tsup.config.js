// @ts-check
import {defineConfig} from "tsup";
import pkg from "./package.json";

export default defineConfig(options => ({
  clean: !options.watch,
  entry: ["src/index.ts"],
  env: {
    BUILD_VERSION: pkg.version,
  },
  dts: options.watch ? false : {
    resolve: false,
  },
  format: ["cjs", "esm"],
  outExtension({format}) {
    return {js: `.${format}.js`};
  },
  shims: true,
  sourcemap: !!options.watch,
  splitting: false,
  treeshake: true
}));
