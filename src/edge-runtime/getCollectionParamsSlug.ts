import { defaultLocale } from "./config";

export function getCollectionParamsSlug(entries: unknown[]) {
  return entries.reduce<{ params: { slug: string } }[]>(
    (accumulator, entry) => {
      if (
        typeof entry === "object" &&
        entry !== null &&
        "slug" in entry &&
        typeof entry.slug === "string"
      ) {
        accumulator.push({
          params: { slug: entry.slug.replace(defaultLocale + "/", "") },
        });
      }
      return accumulator;
    },
    []
  );
}
