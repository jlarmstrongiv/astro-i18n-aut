/**
 * @returns url without locale prefix, "/es/about" => "/about"
 */
export function getUrlWithoutLocale(url: URL | string): string {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  const baseUrl = import.meta.env.BASE_URL;

  // remove trailingSlash from baseUrl if it exists
  const baseUrlWithoutTrailingSlash = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
  const pathNameWithoutBaseUrl =
    baseUrl === "/"
      ? pathName
      : pathName.replace(baseUrlWithoutTrailingSlash, "");

  // avoid catching urls that start with "/en" like "/enigma"
  if (pathNameWithoutBaseUrl.length === 3) {
    return baseUrl;
  }
  if (pathNameWithoutBaseUrl[0] === "/" && pathNameWithoutBaseUrl[3] === "/") {
    // catch all "/fr/**/*" urls
    return baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3);
  }
  // otherwise, it must be a defaultLocale or other url
  return pathName;
}
