import type { ValidRedirectStatus } from "astro";
import { defineMiddleware } from "astro/middleware";
import { defaultI18nMiddlewareConfig } from "../shared/configs";
import type {
  UserI18nMiddlewareConfig,
  I18nMiddlewareConfig,
} from "../shared/configs";

const redirectDefaultLocaleDisabledMiddleware = defineMiddleware((_, next) =>
  next()
);

export function i18nMiddleware(
  userI18nMiddlewareConfig: UserI18nMiddlewareConfig
) {
  const i18nMiddlewareConfig: I18nMiddlewareConfig = Object.assign(
    defaultI18nMiddlewareConfig,
    userI18nMiddlewareConfig
  );
  const { defaultLocale, redirectDefaultLocale } = i18nMiddlewareConfig;

  if (redirectDefaultLocale === false) {
    return redirectDefaultLocaleDisabledMiddleware;
  }

  let status: ValidRedirectStatus | undefined;
  if (typeof redirectDefaultLocale === "number") {
    status = redirectDefaultLocale;
  }

  return defineMiddleware((context, next) => {
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
}
