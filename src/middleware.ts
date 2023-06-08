import { defineMiddleware } from "astro/middleware";

export type ValidRedirectStatus = 300 | 301 | 302 | 303 | 304 | 307 | 308;

export interface I18nMiddlewareParameters {
  defaultLocale: string;
  status?: ValidRedirectStatus;
}
export function i18nMiddleware({
  defaultLocale,
  status = 308,
}: I18nMiddlewareParameters) {
  return defineMiddleware(({ request, redirect }, next) => {
    const url = new URL(request.url);
    if (url.pathname.slice(1, 3) === defaultLocale) {
      redirect("/", status);
    }
    return next();
  });
}
