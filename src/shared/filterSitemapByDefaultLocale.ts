import type { UserFilterSitemapByDefaultLocaleConfig } from "./configs";

// sitemap filter https://docs.astro.build/en/guides/integrations-guide/sitemap/#filter
export function filterSitemapByDefaultLocale({
  defaultLocale,
  base: baseUrl = "/",
}: UserFilterSitemapByDefaultLocaleConfig) {
  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  if (!baseUrl.startsWith("/")) {
    baseUrl = "/" + baseUrl;
  }

  return function filter(page: string) {
    const pathName = new URL(page).pathname;

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
      pathNameWithoutBaseUrl = pathName.replace(
        baseUrlWithoutTrailingSlash,
        ""
      );
    }

    return (
      // avoid catching urls that start with "/en" like "/enigma"
      pathNameWithoutBaseUrl !== "/" + defaultLocale &&
      // catch all "/en/**/*" urls
      !pathNameWithoutBaseUrl.startsWith("/" + defaultLocale + "/")
    );
  };
}
