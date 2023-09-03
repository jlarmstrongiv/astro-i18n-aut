import type { AstroConfig } from "astro";
import type { I18nConfig } from "../../shared/configs";
import { ensureValidTrailingSlashAndFormat } from "./ensureValidTrailingSlashAndFormat";
import { ensureValidRedirectMiddleware } from "./ensureValidRedirectMiddleware";
import { createVirtualModules } from "./createVirtualModules";

export async function ensureValidConfigs(
  config: AstroConfig,
  i18nConfig: I18nConfig
) {
  ensureValidTrailingSlashAndFormat(config);
  await ensureValidRedirectMiddleware(config, i18nConfig);
  createVirtualModules(config, i18nConfig);
}
