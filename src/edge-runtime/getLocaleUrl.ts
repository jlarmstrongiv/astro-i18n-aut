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
 * getLocaleUrl("/es/about", "en") // "/about"
 * ```
 *  * @example
 * ```ts
 * getLocaleUrl("/es/about", "fr") // "/fr/about"
 * ```
 * @example
 * ```ts
 * getLocaleUrl("/about", "es") // "/es/about"
 * ```
 */
/**
 * @returns url with chosen locale prefix
 *  * @example
 * ```ts
 * getLocaleUrl("/es/about", "en") // "/about"
 * ```
 *  * @example
 * ```ts
 * getLocaleUrl("/es/about", "fr") // "/fr/about"
 * ```
 * @example
 * ```ts
 * getLocaleUrl("/about", "es") // "/es/about"
 * ```
 */
export function getLocaleUrl(url: URL | string, locale: string): string {
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
    if (locale === defaultLocale) {
      return resolveTrailingSlash(baseUrl);
    }

    return resolveTrailingSlash(
      baseUrlWithoutTrailingSlash + "/" + locale + "/"
    );
  }
  if (pathNameWithoutBaseUrlStartsWithLocale) {
    // catch all "/fr/**/*" original urls
    if (locale === defaultLocale) {
      return resolveTrailingSlash(
        baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3)
      );
    }
    return resolveTrailingSlash(
      baseUrlWithoutTrailingSlash +
        "/" +
        locale +
        pathNameWithoutBaseUrl.slice(3)
    );
  }
  // otherwise, original url must be a defaultLocale or other url
  if (locale === defaultLocale) {
    return resolveTrailingSlash(
      baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl
    );
  }
  return resolveTrailingSlash(
    baseUrlWithoutTrailingSlash + "/" + locale + pathNameWithoutBaseUrl
  );
}
