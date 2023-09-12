import type { AstroConfig } from "astro";
import type { UpdateConfig } from "./UpdateConfig";
import type { I18nConfig } from "../../shared/configs";
import { ensureValidTrailingSlashAndFormat } from "./ensureValidTrailingSlashAndFormat";
import { ensureValidRedirectMiddleware } from "./ensureValidRedirectMiddleware";
import { createVirtualModules } from "./createVirtualModules";

export async function ensureValidConfigs(
  config: AstroConfig,
  updateConfig: UpdateConfig,
  i18nConfig: I18nConfig
) {
  ensureValidTrailingSlashAndFormat(config, updateConfig);
  await ensureValidRedirectMiddleware(config, i18nConfig);
  createVirtualModules(config, updateConfig, i18nConfig);
}
