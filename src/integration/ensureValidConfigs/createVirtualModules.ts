import type { AstroConfig } from "astro";
import type {
  I18nConfig,
  VirtualAstroi18nautConfig,
} from "../../shared/configs";
import virtual from "vite-plugin-virtual";

// worker plugins are separate https://github.com/vitejs/vite/issues/8520

export function createVirtualModules(
  config: AstroConfig,
  i18nConfig: I18nConfig
): void {
  config.vite.plugins ??= [];
  config.vite.worker ??= {};
  config.vite.worker.plugins ??= [];

  const virtualAstroi18nautConfig: VirtualAstroi18nautConfig = {
    defaultLocale: i18nConfig.defaultLocale,
    locales: i18nConfig.locales,
    redirectDefaultLocale: i18nConfig.redirectDefaultLocale,
    BASE_URL: getBaseUrl(config),
    trailingSlash: config.trailingSlash,
    build: {
      format: config.build.format,
    },
  };

  const virtualPlugins = virtual({
    "virtual:astro-i18n-aut/config": virtualAstroi18nautConfig,
  });

  config.vite.plugins.push(virtualPlugins);
  config.vite.worker.plugins.push(virtualPlugins);
}

function getBaseUrl(config: AstroConfig): string {
  let base = config.base;

  // astro `BASE_URL` always starts with `/` and respects `config.trailingSlash`
  if (!base.startsWith("/")) {
    base = "/" + base;
  }

  // The value of import.meta.env.BASE_URL respects your trailingSlash config
  // and will include a trailing slash
  // if you explicitly include one
  // or if trailingSlash: "always" is set.
  // If trailingSlash: "never" is set,
  // BASE_URL will not include a trailing slash,
  // even if base includes one.
  if (config.trailingSlash === "always") {
    if (!base.endsWith("/")) {
      base = base + "/";
    }
  }

  if (config.trailingSlash === "ignore") {
    if (base.endsWith("/")) {
      base = base.slice(0, -1);
    }
  }

  return base;
}
