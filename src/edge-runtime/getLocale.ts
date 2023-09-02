/**
 * @returns locale key or undefined if defaultLocale
 */
export function getLocale(url: URL | string): string | undefined {
  // support both string and url objects
  const pathName = typeof url === "string" ? url : url.pathname;
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  const baseUrl = import.meta.env.BASE_URL;

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

  // avoid catching urls that start with "/en" like "/enigma"
  if (pathNameWithoutBaseUrl.length === 3) {
    return pathNameWithoutBaseUrl.slice(1);
  }
  if (pathNameWithoutBaseUrl[0] === "/" && pathNameWithoutBaseUrl[3] === "/") {
    // catch all "/fr/**/*" urls
    return pathNameWithoutBaseUrl.slice(1, 3);
  }
  // otherwise, it must be a defaultLocale or other url
  return undefined;
}
