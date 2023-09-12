import type { AstroIntegration } from "astro";

export type UpdateConfig = Parameters<
  NonNullable<AstroIntegration["hooks"]["astro:config:setup"]>
>["0"]["updateConfig"];
