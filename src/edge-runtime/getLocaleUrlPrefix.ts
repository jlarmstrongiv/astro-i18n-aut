import {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  BASE_URL as baseUrl,
  localeKeys,
  defaultLocale,
} from "./config";

/**
 * @returns locale prefix or an empty string if defaultLocale
 * @example
 * ```ts
 * getLocaleUrlPrefix("/es/about") // "/es"
 * ```
 * @example
 * ```ts
 * getLocale("/about") // ""
 * ```
 */
export function getLocaleUrlPrefix(url: URL | string): string {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;

  let pathNameWithoutBaseUrl: string;
  if (baseUrl === "/") {
    // there is no baseUrl set
    pathNameWithoutBaseUrl = pathName;
  } else {
    // remove trailingSlash from baseUrl if it exists
    let baseUrlWithoutTrailingSlash = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;

    // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
    pathNameWithoutBaseUrl = pathName.replace(baseUrlWithoutTrailingSlash, "");
  }

  const possibleLocaleKey = pathNameWithoutBaseUrl.slice(1, 3);
  const pathNameWithoutBaseUrlStartsWithLocale = localeKeys
    .filter((key) => key !== defaultLocale)
    .includes(possibleLocaleKey);

  // avoid catching urls that start with "/en" like "/enigma"
  if (
    pathNameWithoutBaseUrl.length === 3 &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    return "/" + possibleLocaleKey;
  }
  if (pathNameWithoutBaseUrl[0] === "/" && pathNameWithoutBaseUrl[3] === "/") {
    // catch all "/fr/**/*" urls
    return "/" + possibleLocaleKey;
  }
  // otherwise, it must be a defaultLocale or other url
  return "";
}
