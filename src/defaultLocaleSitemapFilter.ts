import type { UserI18nConfig } from "./integration";

export type UserDefaultLocaleSitemapFilter = Pick<
  UserI18nConfig,
  "defaultLocale"
>;

// sitemap filter https://docs.astro.build/en/guides/integrations-guide/sitemap/#filter
export function defaultLocaleSitemapFilter({
  defaultLocale,
}: UserDefaultLocaleSitemapFilter) {
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
