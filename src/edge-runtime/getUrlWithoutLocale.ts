import {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  BASE_URL as baseUrl,
  localeKeys,
  trailingSlash,
  defaultLocale,
} from "./config";
/**
 * @returns url without locale prefix, "/es/about" => "/about"
 */
export function getUrlWithoutLocale(url: URL | string): string {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;

  // remove trailingSlash from baseUrl if it exists
  const baseUrlWithoutTrailingSlash = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
  let pathNameWithoutBaseUrl =
    baseUrl === "/"
      ? pathName
      : pathName.replace(baseUrlWithoutTrailingSlash, "");
  if (trailingSlash === "always") {
    if (!pathNameWithoutBaseUrl.endsWith("/")) {
      pathNameWithoutBaseUrl = pathNameWithoutBaseUrl + "/";
    }
  }
  if (trailingSlash === "never") {
    if (pathNameWithoutBaseUrl.endsWith("/")) {
      pathNameWithoutBaseUrl = pathNameWithoutBaseUrl.slice(0, -1);
    }
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
    return baseUrl;
  }
  if (pathNameWithoutBaseUrl[0] === "/" && pathNameWithoutBaseUrl[3] === "/") {
    // catch all "/fr/**/*" urls
    return baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3);
  }
  // otherwise, it must be a defaultLocale or other url
  if (trailingSlash === "always") {
    if (!pathName.endsWith("/")) {
      return pathName + "/";
    }
  }
  if (trailingSlash === "never") {
    if (pathName.endsWith("/")) {
      return pathName.slice(0, -1);
    }
  }
  return pathName;
}
