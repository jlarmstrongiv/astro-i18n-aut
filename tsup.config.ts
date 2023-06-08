import { defineConfig } from "tsup";

// __filename and __dirname shims
// - https://github.com/egoist/tsup/search?q=__filename

export default defineConfig(async (options) => {
  return {
    ...options,
    clean: true,
    dts: false,
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    // FUTURE: incremental builds when implemented https://github.com/egoist/tsup/issues/615
    // incremental: !options.watch,
    keepNames: true,
    minifyIdentifiers: false,
    minifySyntax: !options.watch,
    minifyWhitespace: !options.watch,
    onSuccess:
      "tsc --emitDeclarationOnly --declaration --declarationMap --declarationDir ./dist",
    outDir: "dist",
    shims: true,
    silent: !options.watch,
    sourcemap: true,
    splitting: false,
  };
});
