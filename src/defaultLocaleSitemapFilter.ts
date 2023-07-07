import type { UserI18nConfig } from "./integration";

export type UserDefaultLocaleSitemapFilter = Pick<
  UserI18nConfig,
  "defaultLocale"
>;

export function defaultLocaleSitemapFilter({
  defaultLocale,
}: UserDefaultLocaleSitemapFilter) {
  return function filter(page: string) {
    const pagePathname = new URL(page).pathname;
    return (
      pagePathname !== `/${defaultLocale}` &&
      !pagePathname.startsWith(`/${defaultLocale}/`)
    );
  };
}
