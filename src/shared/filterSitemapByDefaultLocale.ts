import type { UserFilterSitemapByDefaultLocaleConfig } from "./configs";

// sitemap filter https://docs.astro.build/en/guides/integrations-guide/sitemap/#filter
export function filterSitemapByDefaultLocale({
  defaultLocale,
  base: baseUrl = "/",
}: UserFilterSitemapByDefaultLocaleConfig) {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  if (baseUrl[0] !== "/") {
    baseUrl = "/" + baseUrl;
  }

  const baseUrlWithoutTrailingSlash =
    baseUrl.at(-1) === "/" ? baseUrl.slice(0, -1) : baseUrl;

  return function filter(page: string) {
    const pathName = new URL(page).pathname;

    // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
    let pathNameWithoutBaseUrl =
      baseUrl === "/"
        ? pathName
        : pathName.replace(baseUrlWithoutTrailingSlash, "");

    const pathNameWithoutBaseUrlStartsWithDefaultLocale =
      pathNameWithoutBaseUrl.slice(1, 3) === defaultLocale;

    if (
      pathNameWithoutBaseUrl.length === 3 &&
      pathNameWithoutBaseUrlStartsWithDefaultLocale
    ) {
      return false;
    }
    // catch all "/en/**/*" urls
    if (
      pathNameWithoutBaseUrl[0] === "/" &&
      pathNameWithoutBaseUrl[3] === "/" &&
      pathNameWithoutBaseUrlStartsWithDefaultLocale
    ) {
      return false;
    }

    return true;
  };
}
