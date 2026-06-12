import dts from "unplugin-dts/vite";
import {defineConfig} from "vite";

import pkg from "./package.json";

export default defineConfig({
  plugins: [dts({bundleTypes: true})],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["cjs", "es"],
      fileName: (format) => {
        if (format === "es") return "index.esm.js";
        if (format === "cjs") return "index.cjs.js";
        return `index.${format}.js`;
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
      output: {
        exports: "named",
      },
    },
  },
  define: {
    "process.env.BUILD_VERSION": JSON.stringify(pkg.version),
  },
});
