import type { Plugin } from "vite";

// documentation https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

export function createVirtualPlugin(
  virtualModuleId: string = "virtual:astro-i18n-aut",
  json: any
): Plugin {
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin:" + virtualModuleId, // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(json)}`;
      }
    },
  };
}
