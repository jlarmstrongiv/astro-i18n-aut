import type { AstroConfig } from "astro";
import type { I18nConfig } from "../../shared/configs";
import path from "path";
import fs from "fs-extra";
import dedent from "dedent";
import { logger } from "../../astro/logger/node";
import { removeLeadingForwardSlashWindows } from "../../astro/internal-helpers/path";

export async function ensureValidRedirectMiddleware(
  config: AstroConfig,
  i18nConfig: I18nConfig
) {
  if (i18nConfig.redirectDefaultLocale) {
    const configSrcDirPathname = path.normalize(
      removeLeadingForwardSlashWindows(config.srcDir.pathname)
    );

    // all possible locations of middleware
    const defaultMiddlewarePath = path.join(
      configSrcDirPathname,
      "middleware/index.ts"
    );
    const middlewarePaths = [
      path.join(configSrcDirPathname, "middleware.js"),
      path.join(configSrcDirPathname, "middleware.ts"),
      path.join(configSrcDirPathname, "middleware/index.js"),
      defaultMiddlewarePath,
    ];

    // check if middleware exists
    const pathsExist = await Promise.all(
      middlewarePaths.map((middlewarePath) => fs.exists(middlewarePath))
    );
    const pathExists = pathsExist.includes(true);

    // warn and create middleware if it does not exist
    if (pathExists === false) {
      logger.warn("astro-i18n-aut", `cannot find any Astro middleware files:`);
      middlewarePaths.forEach((middlewarePath) => {
        logger.warn("astro-i18n-aut", `- ${middlewarePath}`);
      });
      logger.warn(
        "astro-i18n-aut",
        `creating ${defaultMiddlewarePath} with defaultLocale = "en"`
      );
      await fs.outputFile(
        defaultMiddlewarePath,
        dedent(`
          import { sequence } from "astro/middleware";
          import { i18nMiddleware } from "astro-i18n-aut";

          export const onRequest = sequence(i18nMiddleware);
        `)
      );
    }
  }
}
