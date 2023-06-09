import path from "node:path";
import type { AstroConfig, AstroIntegration } from "astro";
import fg from "fast-glob";
import fs from "fs-extra";
import { logger } from "./logger/node";

// TODO: defaultLocale redirects
// - depends on https://github.com/withastro/astro/issues/7322
// export type ValidRedirectStatus = 300 | 301 | 302 | 303 | 304 | 307 | 308;

export interface I18nParameters {
  /**
   * glob pattern(s) to include
   * @defaultValue ["pages\/\*\*\/\*"]
   */
  include?: string | string[];
  /**
   * glob pattern(s) to exclude
   * @defaultValue ["pages\/api\/\*\*\/\*"]
   */
  exclude?: string | string[];
  /**
   * all language locales
   *
   * @example
   * ```ts
   * const locales = {
   *   en: "en-US", // the `defaultLocale` value must present in `locales` keys
   *   es: "es-ES",
   *   fr: "fr-CA",
   * };
   * ```
   */
  locales: Record<string, string>;
  /**
   * the default language locale
   *
   * the `defaultLocale` value must present in `locales` keys
   *
   * @example "en"
   */
  defaultLocale: string;
  // redirectStatus?: ValidRedirectStatus;
}

// injectRoute doesn't generate build pages https://github.com/withastro/astro/issues/5096
// workaround: copy pages folder when command === "build"

/**
 * The i18n integration for Astro
 *
 * See the full [astro-i18n-aut](https://github.com/jlarmstrongiv/astro-i18n-aut#readme) documentation
 */
export function i18n({
  include = ["pages/**/*"],
  exclude = ["pages/api/**/*"],
  locales,
  defaultLocale,
}: // redirectStatus,
I18nParameters): AstroIntegration {
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
        ensureValidConfig(config);

        let included: string[] = ensurePathsHaveConfigSrcDirPathname(
          typeof include === "string" ? [include] : include,
          config.srcDir.pathname
        );
        let excluded: string[] = ensurePathsHaveConfigSrcDirPathname(
          typeof exclude === "string" ? [exclude] : exclude,
          config.srcDir.pathname
        );

        const pagesPath = path.join(config.srcDir.pathname, "pages");

        const pagesPathTmpRoot = path.join(
          config.srcDir.pathname,
          // tmp filename from https://github.com/withastro/astro/blob/e6bff651ff80466b3e862e637d2a6a3334d8cfda/packages/astro/src/core/routing/manifest/create.ts#L279
          "astro_tmp_pages"
        );
        await forEachNonDefaultLocale(locales, defaultLocale, (locale) => {
          pagesPathTmp[locale] = `${pagesPathTmpRoot}_${locale}`;
        });

        if (command === "build") {
          await removePagesPathTmp();
          await Promise.all(
            Object.keys(locales)
              .filter((locale) => locale !== defaultLocale)
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
          const relativePath = parsedPath.dir.replace(pagesPath, "");
          const extname = parsedPath.ext.slice(1).toLowerCase();

          // warn on files that cannot be translated with specific and actionable warnings
          // astro pages file types https://docs.astro.build/en/core-concepts/astro-pages/#supported-page-files
          // any file that is not included as an astro page file types, will be automatically warned about by astro
          if (extname !== "astro") {
            warnIsInvalidPage(
              extname,
              path.join(relativePath, parsedPath.base),
              config.srcDir.pathname
            );
            continue;
          }

          await forEachNonDefaultLocale(locales, defaultLocale, (locale) => {
            const entryPoint =
              command === "build"
                ? path.join(pagesPathTmp[locale], relativePath, parsedPath.base)
                : path.join(pagesPath, relativePath, parsedPath.base);

            const pattern = path.join(
              config.base,
              locale,
              relativePath,
              parsedPath.name.endsWith("index")
                ? relativePath
                : parsedPath.name,
              config.build.format === "directory" ? "/" : ""
            );

            injectRoute({
              entryPoint,
              pattern,
            });
          });
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

function ensureValidConfig(config: AstroConfig) {
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
    config.trailingSlash =
      config.build.format === "directory" ? "always" : "never";
    logger.warn(
      "astro-i18n-aut",
      `setting config.trailingSlash = "${config.trailingSlash}"`
    );
  }
}

function ensurePathsHaveConfigSrcDirPathname(
  filePaths: string[],
  configSrcDirPathname: string
) {
  return filePaths.map((filePath) => {
    if (!filePath.includes(configSrcDirPathname)) {
      return path.join(configSrcDirPathname, filePath);
    }
    return filePath;
  });
}

async function forEachNonDefaultLocale(
  locales: Record<string, string>,
  defaultLocale: string,
  asyncFunction: (locale: string) => Promise<void> | void
) {
  for (const locale of Object.keys(locales)) {
    // by default, astro handles the defaultLocale
    if (locale === defaultLocale) {
      continue;
    }
    // we handle the other locale pages
    await asyncFunction(locale);
  }
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
