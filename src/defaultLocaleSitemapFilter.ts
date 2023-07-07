import type { UserDefaultLocaleSitemapFilterConfig } from "./configs";

// sitemap filter https://docs.astro.build/en/guides/integrations-guide/sitemap/#filter
export function defaultLocaleSitemapFilter({
  defaultLocale,
}: UserDefaultLocaleSitemapFilterConfig) {
  return function filter(page: string) {
    const pagePathname = new URL(page).pathname;
    return (
      // avoid catching urls that start with "/en" like "/enigma"
      pagePathname !== `/${defaultLocale}` &&
      // catch all "/en/**/*" urls
      !pagePathname.startsWith(`/${defaultLocale}/`)
    );
  };
}
