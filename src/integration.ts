import path from "node:path";
import type { AstroConfig, AstroIntegration } from "astro";
import dedent from "dedent";
import fg from "fast-glob";
import fs from "fs-extra";
import slash from "slash";
import { logger } from "./logger/node";
import { removeLeadingForwardSlashWindows } from "./internal-helpers/path";
import { defaultI18nConfig } from "./configs";
import type { UserI18nConfig, I18nConfig } from "./configs";

// injectRoute doesn't generate build pages https://github.com/withastro/astro/issues/5096
// workaround: copy pages folder when command === "build"

/**
 * The i18n integration for Astro
 *
 * See the full [astro-i18n-aut](https://github.com/jlarmstrongiv/astro-i18n-aut#readme) documentation
 */
export function i18n(userI18nConfig: UserI18nConfig): AstroIntegration {
  const i18nConfig: I18nConfig = Object.assign(
    defaultI18nConfig,
    userI18nConfig
  );

  const { defaultLocale, locales, exclude, include, redirectDefaultLocale } =
    i18nConfig;

  ensureValidLocales(locales, defaultLocale);

  let pagesPathTmp: Record<string, string> = {};
  async function removePagesPathTmp(): Promise<void> {
    await Promise.all(
      Object.values(pagesPathTmp).map((pagePathTmp) => fs.remove(pagePathTmp))
    );
  }

  return {
    name: "astro-i18n-integration",
    hooks: {
      "astro:config:setup": async ({ config, command, injectRoute }) => {
        await ensureValidConfigs(config, i18nConfig);
        const configSrcDirPathname = path.normalize(
          removeLeadingForwardSlashWindows(config.srcDir.pathname)
        );

        let included: string[] = ensureGlobsHaveConfigSrcDirPathname(
          typeof include === "string" ? [include] : include,
          configSrcDirPathname
        );
        let excluded: string[] = ensureGlobsHaveConfigSrcDirPathname(
          typeof exclude === "string" ? [exclude] : exclude,
          configSrcDirPathname
        );

        const pagesPath = path.join(configSrcDirPathname, "pages");

        const pagesPathTmpRoot = path.join(
          configSrcDirPathname,
          // tmp filename from https://github.com/withastro/astro/blob/e6bff651ff80466b3e862e637d2a6a3334d8cfda/packages/astro/src/core/routing/manifest/create.ts#L279
          "astro_tmp_pages"
        );
        for (const locale of Object.keys(locales)) {
          pagesPathTmp[locale] = `${pagesPathTmpRoot}_${locale}`;
        }

        if (command === "build") {
          await removePagesPathTmp();
          await Promise.all(
            Object.keys(locales)
              .filter((locale) => {
                if (redirectDefaultLocale === false) {
                  return locale !== defaultLocale;
                } else {
                  return true;
                }
              })
              .map((locale) => fs.copy(pagesPath, pagesPathTmp[locale]))
          );
        }

        const entries = fg.stream(included, {
          ignore: excluded,
          onlyFiles: true,
        });
        // typing https://stackoverflow.com/a/68358341
        let entry: string;
        // @ts-expect-error
        for await (entry of entries) {
          const parsedPath = path.parse(entry);
          const relativePath = path.relative(pagesPath, parsedPath.dir);
          const extname = parsedPath.ext.slice(1).toLowerCase();

          // warn on files that cannot be translated with specific and actionable warnings
          // astro pages file types https://docs.astro.build/en/core-concepts/astro-pages/#supported-page-files
          // any file that is not included as an astro page file types, will be automatically warned about by astro
          if (extname !== "astro") {
            warnIsInvalidPage(
              extname,
              path.join(relativePath, parsedPath.base),
              configSrcDirPathname
            );
            continue;
          }

          for (const locale of Object.keys(locales)) {
            // ignore defaultLocale if redirectDefaultLocale is false
            if (redirectDefaultLocale === false && locale === defaultLocale) {
              continue;
            }

            const entryPoint =
              command === "build"
                ? path.join(pagesPathTmp[locale], relativePath, parsedPath.base)
                : path.join(pagesPath, relativePath, parsedPath.base);

            const pattern = slash(
              path.join(
                config.base,
                locale,
                relativePath,
                parsedPath.name.endsWith("index")
                  ? relativePath
                  : parsedPath.name,
                config.build.format === "directory" ? "/" : ""
              )
            );

            injectRoute({
              entryPoint,
              pattern,
            });
          }
        }
      },
      "astro:build:done": async () => {
        await removePagesPathTmp();
      },
      "astro:server:done": async () => {
        await removePagesPathTmp();
      },
    },
  };
}

function ensureValidLocales(
  locales: Record<string, string>,
  defaultLocale: string
) {
  if (!Object.keys(locales).includes(defaultLocale)) {
    const errorMessage = `locales ${JSON.stringify(
      locales
    )} does not include "${defaultLocale}"`;
    logger.error("astro-i18n-aut", errorMessage);
    throw new Error(errorMessage);
  }
}

async function ensureValidConfigs(config: AstroConfig, i18nConfig: I18nConfig) {
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

  // use @ts-ignore to avoid errors when
  // redirects is no longer experimental
  if (
    // @ts-ignore
    config.experimental.redirects === false &&
    i18nConfig.redirectDefaultLocale !== false
  ) {
    logger.warn(
      "astro-i18n-aut",
      `setting config.experimental.redirects = true`
    );
    // avoids error from https://web.archive.org/web/20230707092911/https://github.com/withastro/astro/blob/main/packages/astro/src/core/endpoint/index.ts
    // @ts-ignore
    config.experimental.redirects = true;
  }

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
        dedent`
          import { sequence } from "astro/middleware";
          import { i18nMiddleware } from "astro-i18n-aut";

          const i18n = i18nMiddleware({ defaultLocale: "en" });

          export const onRequest = sequence(i18n);
        `
      );
    }
  }
}

function ensureGlobsHaveConfigSrcDirPathname(
  filePaths: string[],
  configSrcDirPathname: string
) {
  return filePaths.map((filePath) => {
    filePath = path.normalize(removeLeadingForwardSlashWindows(filePath));

    if (filePath.includes(configSrcDirPathname)) {
      filePath = path.relative(configSrcDirPathname, filePath);
    }

    // fast-glob prefers unix paths https://www.npmjs.com/package/fast-glob#how-to-write-patterns-on-windows
    filePath = path.posix.join(
      fg.convertPathToPattern(configSrcDirPathname),
      slash(filePath)
    );

    return filePath;
  });
}

let hasWarnedIsInvalidPage = false;
function warnIsInvalidPage(
  extname: string,
  filePath: string,
  configSrcDirPathname: string
): boolean {
  // astro pages file types https://docs.astro.build/en/core-concepts/astro-pages/#supported-page-files
  if (["js", "ts", "md", "mdx", "html"].includes(extname)) {
    if (hasWarnedIsInvalidPage === false) {
      logger.warn(
        "astro-i18n-aut",
        `exclude or remove non-astro files from "${configSrcDirPathname}pages", as they cannot be translated`
      );
      hasWarnedIsInvalidPage = true;
    }
    logger.warn(
      "astro-i18n-aut",
      path.join(configSrcDirPathname, "pages", filePath)
    );
    return true;
  }
  return false;
}
