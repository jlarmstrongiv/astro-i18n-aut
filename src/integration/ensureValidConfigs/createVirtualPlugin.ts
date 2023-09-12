import type { Plugin } from "vite";

// documentation https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

export function createVirtualPlugin(
  virtualModuleId: string,
  json: any
): Plugin {
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin:" + virtualModuleId, // required, will show up in warnings and errors
    // @ts-expect-error
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    // @ts-expect-error
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(json)}`;
      }
    },
  };
}
