# Contributing

PRs welcome! Thank you for your contributions.

## PRs

If you are reporting or fixing a bug, please include:

- A reproducible example
- An explanation for the changes

A reproducible example is very helpful for investigating bugs. If I cannot reproduce the error, I cannot fix it.

An explanation of changes will make a strong case for merging the PR. If your PR is refactored, an explanation of the changes will also ensure that all of your fixes and features are still included.

## The How

Unfortunately, i18n is not a first-class concern for Astro. While Astro documents i18n in their [cookbook](https://docs.astro.build/en/recipes/i18n/), they do not support a `defaultLocale`.

The other community integrations that Astro links do not support all adapters:

- [**astro-i18next**](https://www.npmjs.com/package/astro-i18next) An Astro integration for i18next including some utility components.
- [**astro-i18n**](https://www.npmjs.com/package/astro-i18n) A TypeScript-first internationalization library for Astro.

Astro does not easily support two pages having the same content:

- Route variables `/[lang]/about` cannot be undefined or an empty string
- Middleware `request.url` is read-only, so it is not possible to retrieve content from a different url
- Configured redirects do not support route transitions like `'/article': '/blog/[...slug]'`, only `'/blog/[...slug]': '/articles/[...slug]'`
- The `injectRoute` method cannot inject an `entryPoint` that is already being used in the build command

We duplicate the `src/pages` folder multiple times and use `injectRoute` as a workaround. You can safely delete any `src/astro_tmp_pages_LOCALE` folders, but those will be automatically cleaned on every started and completed build.

Astro also does not support [Configured Redirects](https://docs.astro.build/en/core-concepts/routing/#configured-redirects-experimental) for non-existent routes, so middleware must be used with `src/astro_tmp_pages_DEFAULTLOCALE` to create redirects.
