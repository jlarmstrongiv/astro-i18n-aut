// modified, more specific Astro helper function
export function removeLeadingForwardSlashWindows(path: string) {
  return path.startsWith("/C:/") ? path.substring(1) : path;
}
