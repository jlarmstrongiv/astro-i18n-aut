import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { defineConfig } from "astro/config";
import type { UpdateConfig } from "./UpdateConfig";

export function ensureValidTrailingSlashAndFormat(
  config: AstroConfig,
  updateConfig: UpdateConfig,
  logger: AstroIntegrationLogger
) {
  if (config.trailingSlash === "ignore" && config.output === "static") {
    logger.warn(
      `avoid setting config.trailingSlash = "ignore" when config.output = "static"`
    );
    logger.warn(
      `config.trailingSlash = "always" && config.build.format = "directory"`
    );
    logger.warn(
      `config.trailingSlash = "never" && config.build.format = "file"`
    );
    logger.warn(`setting config.trailingSlash = "${config.trailingSlash}"`);
    updateConfig(
      defineConfig({
        trailingSlash: config.build.format === "directory" ? "always" : "never",
      })
    );
  }
  if (config.trailingSlash === "always" && config.build.format === "file") {
    logger.warn(
      `config.trailingSlash = "always" must always be used with config.build.format = "directory"`
    );
    logger.warn(`setting config.build.format = "directory"`);
    updateConfig(
      defineConfig({
        build: {
          format: "directory",
        },
      })
    );
  }
  if (config.trailingSlash === "never" && config.build.format === "directory") {
    logger.warn(
      `config.trailingSlash = "never" must always be used with config.build.format = "file"`
    );
    logger.warn(`setting config.build.format = "file"`);
    updateConfig(
      defineConfig({
        build: {
          format: "file",
        },
      })
    );
  }
}
