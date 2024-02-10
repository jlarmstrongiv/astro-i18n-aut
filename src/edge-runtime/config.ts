import virtualConfig from "virtual:astro-i18n-aut";

export const trailingSlash = virtualConfig.trailingSlash;
export const BASE_URL = virtualConfig.BASE_URL ? virtualConfig.BASE_URL : "/";
export const defaultLocale = virtualConfig.defaultLocale;
export const locales = virtualConfig.locales;
export const localeKeys = Object.keys(virtualConfig.locales);
export const redirectDefaultLocale = virtualConfig.redirectDefaultLocale;
export const build = virtualConfig.build;
