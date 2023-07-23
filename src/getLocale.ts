/**
 * @returns locale key or undefined if defaultLocale
 */
export function getLocale(url: URL): string | undefined {
  // avoid catching urls that start with "/en" like "/enigma"
  if (url.pathname.length === 3) {
    return url.pathname.slice(1);
  }
  if (url.pathname[0] === "/" && url.pathname[3] === "/") {
    // catch all "/fr/**/*" urls
    return url.pathname.slice(1, 3);
  }
  // otherwise, it must be a defaultLocale or other url
  return undefined;
}

/**
 * @returns locale key or undefined if defaultLocale
 */
export function getLocaleFromSlug(slug: string): string | undefined {

  if(slug?.length > 0 && slug[0] === "/") {
    slug = slug.slice(1);
  }

  const pathSlices = slug.split("/");
  if (pathSlices.length > 1) {
    return pathSlices[0];
  }

  return undefined;
}
