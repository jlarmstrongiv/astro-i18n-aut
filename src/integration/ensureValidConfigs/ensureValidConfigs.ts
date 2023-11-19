import type { AstroConfig, AstroIntegrationLogger } from "astro";
import type { UpdateConfig } from "./UpdateConfig";
import type { I18nConfig } from "../../shared/configs";
import { ensureValidTrailingSlashAndFormat } from "./ensureValidTrailingSlashAndFormat";
import { createVirtualModules } from "./createVirtualModules";

export async function ensureValidConfigs(
  config: AstroConfig,
  updateConfig: UpdateConfig,
  i18nConfig: I18nConfig,
  logger: AstroIntegrationLogger
) {
  ensureValidTrailingSlashAndFormat(config, updateConfig, logger);
  createVirtualModules(config, updateConfig, i18nConfig);
}
