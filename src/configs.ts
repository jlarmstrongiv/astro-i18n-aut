import type { ValidRedirectStatus } from "astro";

export interface UserI18nConfig {
  /**
   * glob pattern(s) to include
   * @defaultValue ["pages\/\*\*\/\*"]
   */
  include?: string | string[];
  /**
   * glob pattern(s) to exclude
   * @defaultValue ["pages\/api\/\*\*\/\*"]
   */
  exclude?: string | string[];
  /**
   * all language locales
   *
   * @example
   * ```ts
   * const locales = {
   *   en: "en-US", // the `defaultLocale` value must present in `locales` keys
   *   es: "es-ES",
   *   fr: "fr-CA",
   * };
   * ```
   */
  locales: Record<string, string>;
  /**
   * the default language locale
   *
   * the `defaultLocale` value must present in `locales` keys
   *
   * @example "en"
   */
  defaultLocale: string;
  /**
   * given the defaultLocale "en", whether
   * "/en/about" redirects to "/about"
   *
   * whether the url with the default locale
   * should redirect to the url without the locale
   *
   * if a status is given, such as 302,
   * redirectDefaultLocale will be truthy,
   * and all redirects will use that status
   *
   * @defaultValue true
   */
  redirectDefaultLocale?: boolean | ValidRedirectStatus;
}

export type UserI18nMiddlewareConfig = Pick<
  UserI18nConfig,
  "defaultLocale" | "redirectDefaultLocale"
>;

export type UserDefaultLocaleSitemapFilterConfig = Pick<
  UserI18nConfig,
  "defaultLocale"
>;

export type I18nConfig = Required<UserI18nConfig>;

export type I18nMiddlewareConfig = Required<UserI18nMiddlewareConfig>;

// opposite of RequiredFieldsOnly https://stackoverflow.com/a/68261391
type PartialFieldsOnly<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};

/**
 * The default values for I18nConfig
 */
export const defaultI18nConfig: Required<UserI18nConfig> = {
  defaultLocale: "en",
  locales: {
    en: "en-US",
    },
  include: ["pages/**/*"],
  exclude: ["pages/api/**/*"],
  redirectDefaultLocale: true,
};

/**
 * The default values for I18nMiddlewareConfig
 */
export const defaultI18nMiddlewareConfig: Required<
  UserI18nMiddlewareConfig
> = {
  defaultLocale: defaultI18nConfig.defaultLocale,
  redirectDefaultLocale: defaultI18nConfig.redirectDefaultLocale,
};
