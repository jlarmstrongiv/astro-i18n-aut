import type { ValidRedirectStatus } from "astro";
import { defineMiddleware } from "astro/middleware";
import { defaultLocale, redirectDefaultLocale } from "./config";

export const i18nMiddleware = defineMiddleware((context, next) => {
  if (redirectDefaultLocale === false) {
    return next();
  }

  let status: ValidRedirectStatus | undefined;
  if (typeof redirectDefaultLocale === "number") {
    status = redirectDefaultLocale;
  }

  const requestUrlPathname = new URL(context.request.url).pathname;
  // avoid catching urls that start with "/en" like "/enigma"
  if (requestUrlPathname === `/${defaultLocale}`) {
    return context.redirect(
      requestUrlPathname.replace(`/${defaultLocale}`, "/"),
      status
    );
  }
  // catch all "/en/**/*" urls
  if (requestUrlPathname.startsWith(`/${defaultLocale}/`)) {
    return context.redirect(
      requestUrlPathname.replace(`/${defaultLocale}/`, "/"),
      status
    );
  }
  // otherwise, it must be a defaultLocale or other url
  return next();
});
