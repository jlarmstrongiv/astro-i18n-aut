import type { AstroConfig } from "astro";
import { logger } from "../../astro/logger/node";

export function ensureValidTrailingSlashAndFormat(config: AstroConfig) {
  if (config.trailingSlash === "ignore" && config.output === "static") {
    logger.warn(
      "astro-i18n-aut",
      `avoid setting config.trailingSlash = "ignore" when config.output = "static"`
    );
    logger.warn(
      "astro-i18n-aut",
      `config.trailingSlash = "always" && config.build.format = "directory"`
    );
    logger.warn(
      "astro-i18n-aut",
      `config.trailingSlash = "never" && config.build.format = "file"`
    );
    logger.warn(
      "astro-i18n-aut",
      `setting config.trailingSlash = "${config.trailingSlash}"`
    );
    config.trailingSlash =
      config.build.format === "directory" ? "always" : "never";
  }
  if (config.trailingSlash === "always" && config.build.format === "file") {
    logger.warn(
      "astro-i18n-aut",
      `config.trailingSlash = "always" must always be used with config.build.format = "directory"`
    );
    logger.warn("astro-i18n-aut", `setting config.build.format = "directory"`);
    config.build.format = "directory";
  }
  if (config.trailingSlash === "never" && config.build.format === "directory") {
    logger.warn(
      "astro-i18n-aut",
      `config.trailingSlash = "never" must always be used with config.build.format = "file"`
    );
    logger.warn("astro-i18n-aut", `setting config.build.format = "file"`);
    config.build.format = "file";
  }
}
