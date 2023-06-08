# `astro-i18n-aut` The i18n integration for Astro 🧑‍🚀

<p align="center">
  <a href="https://github.com/jlarmstrongiv/astro-i18n-aut#readme" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jlarmstrongiv/astro-i18n-aut/main/logos/astro-i18n-aut-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jlarmstrongiv/astro-i18n-aut/main/logos/astro-i18n-aut-light.svg">
      <img alt="astro-i18n-aut" src="https://raw.githubusercontent.com/jlarmstrongiv/astro-i18n-aut/HEAD/logos/astro-i18n-aut-light.svg" width="400" height="225" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  Built with ❤️ for all Astro crewmates 🧑‍🚀
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/astro-i18n-aut"><img src="https://img.shields.io/npm/dt/astro-i18n-aut.svg" alt="Total Downloads"></a>
  <a href="https://github.com/astro-i18n-aut/astro-i18n-aut/releases"><img src="https://img.shields.io/npm/v/astro-i18n-aut.svg" alt="Latest Release"></a>
  <a href="https://github.com/jlarmstrongiv/astro-i18n-aut/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/astro-i18n-aut.svg" alt="License"></a>
</p>

---

## Motivation

Provide an internationalization (i18n) integration for Astro that:

- Supports the `defaultLocale`
- Avoids template file duplication
- Is adapter agnostic
- Is UI framework agnostic
- Is compatible with [`@astrojs/sitemap`](https://www.npmjs.com/package/@astrojs/sitemap)

## Quick start

### Install

Install via [npm](https://www.npmjs.com/package/astro-i18n-aut):

```shell
npm install astro-i18n-aut
```

### Configure

In your Astro [config](https://docs.astro.build/en/guides/configuring-astro/#supported-config-file-types) file:

```ts
import { defineConfig } from "astro/config";
import i18n from "astro-i18n-aut";
import sitemap from "@astrojs/sitemap";

const defaultLocale = "en";
const locales = {
  en: "en-US", // The `defaultLocale` value must present in `locales` keys
  es: "es-ES",
  fr: "fr-CA",
};

export default defineConfig({
  site: "https://example.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    i18n({
      locales,
      defaultLocale,
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
    }),
  ],
});
```

### Usage

Now that you have set up the config, each `.astro` page will have additional renders with your other languages. For example, `src/pages/about.astro` will render as:

- `/about.astro`
- `/es/about.astro`
- `/fr/about.astro`

Please note that the `getStaticPaths()` function will only run once. This limitation means that you cannot have translated urls, such as `/es/acerca-de` for `/about`. However, it also ensures compatibility with [`@astrojs/sitemap`](https://www.npmjs.com/package/@astrojs/sitemap).

The Astro frontmatter is re-run for every translated page. For example, the `Astro.url.pathname` can be `/about`, `/es/about`, `/fr/about`.

It is up to you to detect which language is being rendered. You can use Astro [content collections](https://docs.astro.build/en/guides/content-collections/) or any i18n UI framework, such as [`react-i18next`](https://www.npmjs.com/package/react-i18next), for your translations. Here is a pure `Hello World` example:

```astro
---
import Layout from "../layouts/Layout.astro";

const locale = Astro.url.pathname.slice(1, 3);

let title: string;
switch (locale) {
  case "es":
    title = "¡Hola Mundo!";
    break;
  case "fr":
    title = "Bonjour Monde!";
    break;
  default:
    title = "Hello World!";
}
---

<Layout title={title}>
  <h1>{title}</h1>
</Layout>
```

### Options

- `include`: glob pattern(s) to include (default: `["pages/**/*"]`)
- `exclude`: glob pattern(s) to exclude (default: `["pages/api/**"]`)

Other Astro page file types:

- ✅ `.astro`
- ❌ `.md`
- ❌ `.mdx` (with the MDX Integration installed)
- ❌ `.html`
- ❌ `.js` / `.ts` (as endpoints)

cannot be translated. If you choose to use them, please add them to the ignore glob patterns. For example, `["pages/api/**", "pages/**/*.md"]`

## License

MIT Licensed

## Contributing

PRs welcome! Thank you for your contributions.

### The How

Unfortunately, i18n is not a first-class concern for Astro. While Astro documents i18n in their [cookbook](https://docs.astro.build/en/recipes/i18n/), they do no support a `defaultLocale`.

The other community integrations that Astro links do not support all adapters:

- [**astro-i18next**](https://www.npmjs.com/package/astro-i18next) An Astro integration for i18next including some utility components.
- [**astro-i18n**](https://www.npmjs.com/package/astro-i18n) A TypeScript-first internationalization library for Astro.

Astro does not easily support two pages having the same content:

- Route variables `/[lang]/about` cannot be undefined or an empty string
- Middleware `request.url` is read-only, so it is not possible to retrieve content from a different url
- Configured redirects do not support route transitions like `'/article': '/blog/[...slug]'`, only `'/blog/[...slug]': '/articles/[...slug]'`
- The `injectRoute` method cannot inject an `entryPoint` that is already being used in the build command

We duplicate the `src/pages` folder and use `injectRoute` as a workaround. You can safely delete any `src/astro_tmp_pages_LOCALE` folders, but those will be automatically cleaned on every started and completed build.
