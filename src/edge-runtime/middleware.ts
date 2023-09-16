import type { ValidRedirectStatus } from "astro";
import { defineMiddleware } from "astro/middleware";
import {
  defaultLocale,
  redirectDefaultLocale,
  BASE_URL as baseUrl,
} from "./config";
import { removeTrailingSlash } from "./removeTrailingSlash";
import { resolveTrailingSlash } from "./resolveTrailingSlash";

export const i18nMiddleware = defineMiddleware((context, next) => {
  if (redirectDefaultLocale === false) {
    return next();
  }

  let status: ValidRedirectStatus | undefined;
  if (typeof redirectDefaultLocale === "number") {
    status = redirectDefaultLocale;
  }

  const pathName = new URL(context.request.url).pathname;

  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl);

  // remove baseUrlWithoutTrailingSlash from pathNameWithoutBaseUrl
  let pathNameWithoutBaseUrl =
    baseUrl === "/"
      ? pathName
      : pathName.replace(baseUrlWithoutTrailingSlash, "");

  const pathNameWithoutBaseUrlStartsWithDefaultLocale =
    pathNameWithoutBaseUrl.slice(1, 3) === defaultLocale;

  // avoid catching urls that start with "/en" like "/enigma"
  if (
    pathNameWithoutBaseUrl.length === 3 &&
    pathNameWithoutBaseUrlStartsWithDefaultLocale
  ) {
    return context.redirect(resolveTrailingSlash(baseUrl), status);
  }
  // catch all "/en/**/*" urls
  if (
    pathNameWithoutBaseUrl[0] === "/" &&
    pathNameWithoutBaseUrl[3] === "/" &&
    pathNameWithoutBaseUrlStartsWithDefaultLocale
  ) {
    return context.redirect(
      resolveTrailingSlash(
        baseUrlWithoutTrailingSlash + pathNameWithoutBaseUrl.slice(3)
      ),
      status
    );
  }
  // otherwise, it must be a defaultLocale or other url
  return next();
});
