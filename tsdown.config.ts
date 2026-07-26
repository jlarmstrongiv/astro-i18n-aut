import { defineConfig } from "tsdown";

export default defineConfig((options) => {
  return {
    clean: true,
    dts: {
      sourcemap: true,
    },
    entry: {
      "integration/index": "src/integration/index.ts",
      "edge-runtime/index": "src/edge-runtime/index.ts",
      "middleware/index": "src/middleware/index.ts",
    },
    deps: {
      // provided at runtime by the integration's vite plugin
      neverBundle: ["virtual:astro-i18n-aut"],
    },
    // emit .js/.d.ts for esm and .cjs/.d.cts for cjs, matching package.json exports
    fixedExtension: false,
    format: ["esm", "cjs"],
    outputOptions: {
      exports: "named",
    },
    keepNames: true,
    minify: options.watch
      ? false
      : {
          compress: true,
          mangle: false,
          removeWhitespace: true,
        },
    outDir: "dist",
    shims: true,
    silent: !options.watch,
    sourcemap: true,
  };
});
