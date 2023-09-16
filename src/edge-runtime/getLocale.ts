import {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  BASE_URL as baseUrl,
  defaultLocale,
  localeKeys,
} from "./config";
import { removeTrailingSlash } from "./removeTrailingSlash";

/**
 * @returns locale key
 * @example
 * ```ts
 * getLocale("/es/about") // "es"
 * ```
 * @example
 * ```ts
 * getLocale("/about") // "en"
 * ```
 */
export function getLocale(url: URL | string): string {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`

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

  // avoid catching urls that start with "/en" like "/enigma"
  if (
    pathNameWithoutBaseUrl.length === 3 &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    return possibleLocaleKey;
  }
  if (
    pathNameWithoutBaseUrl[0] === "/" &&
    pathNameWithoutBaseUrl[3] === "/" &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    // catch all "/fr/**/*" urls
    return possibleLocaleKey;
  }
  // otherwise, it must be a defaultLocale or other url
  return defaultLocale;
}
