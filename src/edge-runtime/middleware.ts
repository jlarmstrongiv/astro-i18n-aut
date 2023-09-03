import type { ValidRedirectStatus } from "astro";
import { defineMiddleware } from "astro/middleware";
import {
  defaultLocale,
  redirectDefaultLocale,
  BASE_URL as baseUrl,
} from "./config";

export const i18nMiddleware = defineMiddleware((context, next) => {
  if (redirectDefaultLocale === false) {
    return next();
  }

  let status: ValidRedirectStatus | undefined;
  if (typeof redirectDefaultLocale === "number") {
    status = redirectDefaultLocale;
  }

  const pathName = new URL(context.request.url).pathname;

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
    pathNameWithoutBaseUrl = pathName.replace(baseUrlWithoutTrailingSlash, "");
  }

  // avoid catching urls that start with "/en" like "/enigma"
  if (pathNameWithoutBaseUrl === "/" + defaultLocale) {
    return context.redirect(pathName.replace("/" + defaultLocale, "/"), status);
  }
  // catch all "/en/**/*" urls
  if (pathNameWithoutBaseUrl.startsWith("/" + defaultLocale + "/")) {
    return context.redirect(
      pathName.replace("/" + defaultLocale + "/", "/"),
      status
    );
  }
  // otherwise, it must be a defaultLocale or other url
  return next();
});
