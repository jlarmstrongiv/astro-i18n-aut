import {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  BASE_URL as baseUrl,
  defaultLocale,
  localeKeys,
} from "./config";
import { resolveTrailingSlash } from "./resolveTrailingSlash";
import { removeTrailingSlash } from "./removeTrailingSlash";
/**
 * @returns url with chosen locale prefix
 *  * @example
 * ```ts
 * getAllLocaleUrls("/es/about") // { en: "/about", "es": "/es/about" }
 * ```
 * @example
 * ```ts
 * getAllLocaleUrls("/about") // { en: "/about", "es": "/es/about" }
 * ```
 */
export function getAllLocaleUrls(url: URL | string): Record<string, string> {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;

  // remove trailingSlash from baseUrl if it exists
  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl);

  // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
  let pathNameWithoutBaseUrl =
    baseUrl === "/"
      ? pathName
      : pathName.replace(baseUrlWithoutTrailingSlash, "");

  const possibleLocaleKey = pathNameWithoutBaseUrl.slice(1, 3);
  const pathNameWithoutBaseUrlStartsWithLocale = localeKeys
    .filter((key) => key !== defaultLocale)
    .includes(possibleLocaleKey);

  // avoid catching original urls that start with "/en" like "/enigma"
  if (
    pathNameWithoutBaseUrl.length === 3 &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    return {
      ...localeKeys.reduce<Record<string, string>>((record, locale) => {
        record[locale] = resolveTrailingSlash(
          baseUrlWithoutTrailingSlash + "/" + locale + "/"
        );
        return record;
      }, {}),
      [defaultLocale]: resolveTrailingSlash(baseUrl),
    };
  }
  if (
    pathNameWithoutBaseUrl[0] === "/" &&
    pathNameWithoutBaseUrl[3] === "/" &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    // catch all "/fr/**/*" original urls
    return {
      ...localeKeys.reduce<Record<string, string>>((record, locale) => {
        record[locale] = resolveTrailingSlash(
          baseUrlWithoutTrailingSlash +
            "/" +
            locale +
            pathNameWithoutBaseUrl.slice(3)
        );
        return record;
      }, {}),
      [defaultLocale]: resolveTrailingSlash(
        baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3)
      ),
    };
  }

  // otherwise, original url must be a defaultLocale or other url
  return {
    ...localeKeys.reduce<Record<string, string>>((record, locale) => {
      record[locale] = resolveTrailingSlash(
        baseUrlWithoutTrailingSlash + "/" + locale + pathNameWithoutBaseUrl
      );
      return record;
    }, {}),
    [defaultLocale]: resolveTrailingSlash(
      baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl
    ),
  };
}
