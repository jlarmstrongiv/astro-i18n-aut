import {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  BASE_URL as baseUrl,
  localeKeys,
  defaultLocale,
} from "./config";
import { removeHtmlExtension } from "./removeHtmlExtension";
import { removeTrailingSlash } from "./removeTrailingSlash";
import { resolveTrailingSlash } from "./resolveTrailingSlash";
/**
 * @returns url without locale prefix, "/es/about" => "/about"
 */
export function getUrlWithoutLocale(url: URL | string): string {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;
  const pathNameWithoutHtmlExtension = removeHtmlExtension(pathName);

  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl);

  // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
  let pathNameWithoutBaseUrl =
    baseUrl === "/"
      ? pathNameWithoutHtmlExtension
      : pathNameWithoutHtmlExtension.replace(baseUrlWithoutTrailingSlash, "");

  const possibleLocaleKey = pathNameWithoutBaseUrl.slice(1, 3);
  const pathNameWithoutBaseUrlStartsWithLocale = localeKeys
    .filter((key) => key !== defaultLocale)
    .includes(possibleLocaleKey);

  // avoid catching urls that start with "/en" like "/enigma"
  if (
    pathNameWithoutBaseUrl.length === 3 &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    return resolveTrailingSlash(baseUrl);
  }
  if (
    pathNameWithoutBaseUrl[0] === "/" &&
    pathNameWithoutBaseUrl[3] === "/" &&
    pathNameWithoutBaseUrlStartsWithLocale
  ) {
    // catch all "/fr/**/*" urls
    return resolveTrailingSlash(
      baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3)
    );
  }
  // otherwise, it must be a defaultLocale or other url
  return resolveTrailingSlash(
    baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl
  );
}
