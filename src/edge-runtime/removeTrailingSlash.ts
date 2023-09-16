export function removeTrailingSlash(url: string) {
  return url.at(-1) === "/" ? url.slice(0, -1) : url;
}
