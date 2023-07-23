export { i18n, i18n as default } from "./integration";
export { i18nMiddleware } from "./middleware";
export { defaultLocaleSitemapFilter } from "./defaultLocaleSitemapFilter";
export { getLocale, getLocaleFromSlug } from "./getLocale";
export { getLocaleUrlPrefix } from "./getLocaleUrlPrefix";
export { getUrlWithoutLocale, getUrlWithoutLocaleFromSlug } from "./getUrlWithoutLocale";
export { defaultI18nConfig, defaultI18nMiddlewareConfig } from "./configs";
export type {
  UserI18nConfig,
  UserI18nMiddlewareConfig,
  UserDefaultLocaleSitemapFilterConfig,
} from "./configs";
