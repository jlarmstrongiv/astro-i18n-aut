import type { AstroConfig } from "astro";
import type {
  I18nConfig,
  VirtualAstroi18nautConfig,
} from "../../shared/configs";
import { createVirtualPlugin } from "./createVirtualPlugin";

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

  const virtualPlugin = createVirtualPlugin(
    "virtual:astro-i18n-aut",
    virtualAstroi18nautConfig
  );
  config.vite.plugins.push(virtualPlugin);
  config.vite.worker.plugins.push(virtualPlugin);

  // exclude virtual modules from optimizeDeps https://github.com/storybookjs/builder-vite/issues/311#issuecomment-1092577628
  config.vite.optimizeDeps ??= {};
  config.vite.optimizeDeps.exclude ??= [];
  config.vite.optimizeDeps.exclude.push("virtual:astro-i18n-aut");
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