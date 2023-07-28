/**
 * @returns url without locale prefix, "/es/about" => "/about"
 */
export function getUrlWithoutLocale(url: URL): string {
  // avoid catching urls that start with "/en" like "/enigma"
  if (url.pathname.length === 3) {
    return "/";
  }
  if (url.pathname[0] === "/" && url.pathname[3] === "/") {
    // catch all "/fr/**/*" urls
    return url.pathname.slice(3);
  }
  // otherwise, it must be a defaultLocale or other url
  return url.pathname;
}
