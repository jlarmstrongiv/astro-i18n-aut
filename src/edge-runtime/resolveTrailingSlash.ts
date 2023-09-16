import { trailingSlash } from "./config";

export function resolveTrailingSlash(url: URL | string): string {
  let pathName = typeof url === "string" ? url : url.pathname;

  if (trailingSlash === "always") {
    if (pathName.at(-1) !== "/") {
      pathName = pathName + "/";
    }
  } else if (trailingSlash === "never") {
    if (pathName !== "/" && pathName.at(-1) === "/") {
      pathName = pathName.slice(0, -1);
    }
  }
  return pathName;
}
