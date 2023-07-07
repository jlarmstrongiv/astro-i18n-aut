import { defineMiddleware } from "astro/middleware";
import type { UserI18nConfig } from "./integration";

export type UserI18nMiddlewareConfig = Pick<UserI18nConfig, "defaultLocale">;

export function i18nMiddleware({ defaultLocale }: UserI18nMiddlewareConfig) {
  return defineMiddleware((context, next) => {
    const requestUrlPathname = new URL(context.request.url).pathname;
    // avoid catching urls that start with "/en" like "/enigma"
    if (requestUrlPathname === `/${defaultLocale}`) {
      return context.redirect(
        requestUrlPathname.replace(`/${defaultLocale}`, "/")
      );
    }
    // catch all "/en/**/*" urls
    if (requestUrlPathname.startsWith(`/${defaultLocale}/`)) {
      return context.redirect(
        requestUrlPathname.replace(`/${defaultLocale}/`, "/")
      );
    }
    return next();
  });
}
