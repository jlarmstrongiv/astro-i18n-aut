export function removeHtmlExtension(url: string) {
  return url.endsWith(".html") ? url.slice(0, -".html".length) : url;
}
