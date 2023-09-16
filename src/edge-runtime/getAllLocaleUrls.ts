import {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  BASE_URL as baseUrl,
  defaultLocale,
  localeKeys,
  trailingSlash,
} from "./config";
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
  const baseUrlWithoutTrailingSlash = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
  let pathNameWithoutBaseUrl =
    baseUrl === "/"
      ? pathName
      : pathName.replace(baseUrlWithoutTrailingSlash, "");

  // ensure consistent trailing slash
  if (trailingSlash === "always") {
    if (!pathNameWithoutBaseUrl.endsWith("/")) {
      pathNameWithoutBaseUrl = pathNameWithoutBaseUrl + "/";
    }
  }
  if (trailingSlash === "never") {
    if (
      pathNameWithoutBaseUrl !== "/" &&
      pathNameWithoutBaseUrl.endsWith("/")
    ) {
      pathNameWithoutBaseUrl = pathNameWithoutBaseUrl.slice(0, -1);
    }
  }

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
        record[locale] = baseUrl.endsWith("/")
          ? baseUrlWithoutTrailingSlash + "/" + locale + "/"
          : baseUrlWithoutTrailingSlash + "/" + locale;
        return record;
      }, {}),
      [defaultLocale]: baseUrl,
    };
  }
  if (pathNameWithoutBaseUrl[0] === "/" && pathNameWithoutBaseUrl[3] === "/") {
    // catch all "/fr/**/*" original urls
    return {
      ...localeKeys.reduce<Record<string, string>>((record, locale) => {
        record[locale] =
          baseUrlWithoutTrailingSlash +
          "/" +
          locale +
          pathNameWithoutBaseUrl.slice(3);
        return record;
      }, {}),
      [defaultLocale]:
        baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3),
    };
  }

  // otherwise, original url must be a defaultLocale or other url
  return {
    ...localeKeys.reduce<Record<string, string>>((record, locale) => {
      record[locale] =
        baseUrlWithoutTrailingSlash + "/" + locale + pathNameWithoutBaseUrl;
      return record;
    }, {}),
    [defaultLocale]: baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl,
  };
}
