export function removeLeadingForwardSlashWindows(path: string) {
  return path.startsWith("/") && path[2] === ":" ? path.substring(1) : path;
}
