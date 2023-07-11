/**
 * @returns locale prefix "/es" or "" if defaultLocale
 */
export function getLocalePrefix(url: URL): string {
  // avoid catching urls that start with "/en" like "/enigma"
  if (url.pathname.length === 3) {
    return url.pathname;
  }
  if (url.pathname[0] === "/" && url.pathname[3] === "/") {
    // catch all "/fr/**/*" urls
    return url.pathname.slice(0, 3);
  }
  // otherwise, it must be a defaultLocale or other url
  return "";
}
