import { trailingSlash } from "./config";

export function resolveTrailingSlash(url: string) {
  if (url[0] !== "/") {
    url = "/" + url;
  }
  if (trailingSlash === "always") {
    if (url.at(-1) !== "/") {
      url = url + "/";
    }
  } else if (trailingSlash === "never") {
    if (url !== "/" && url.at(-1) === "/") {
      url = url.slice(0, -1);
    }
  }
  return url;
}
