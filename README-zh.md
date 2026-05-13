# `astro-i18n-aut` Astro 的 i18n 集成 🧑‍🚀

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
  为所有 Astro 宇航员用心打造 ❤️ 🧑‍🚀
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/astro-i18n-aut"><img src="https://img.shields.io/npm/dt/astro-i18n-aut.svg" alt="总下载量"></a>
  <a href="https://www.npmjs.com/package/astro-i18n-aut?activeTab=versions"><img src="https://img.shields.io/npm/v/astro-i18n-aut.svg" alt="最新版本"></a>
  <a href="https://github.com/jlarmstrongiv/astro-i18n-aut/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/astro-i18n-aut.svg" alt="许可证"></a>
</p>

---

## 动机

为 Astro 提供一个国际化（i18n）集成，它：

- 支持 `defaultLocale`
- 避免模板文件重复
- 适用于静态网站生成（SSG）和服务器端渲染（SSR）

## 安装

```bash
npm install astro-i18n-aut
```

## 快速开始

### 1. 配置 Astro

在 `astro.config.mjs` 中添加集成：

```javascript
import { defineConfig } from 'astro/config';
import { i18n } from 'astro-i18n-aut/integration';

export default defineConfig({
  integrations: [
    i18n({
      defaultLocale: 'zh-CN',
      locales: {
        'zh-CN': 'zh-CN',
        'en': 'en',
        'ja': 'ja',
      },
    }),
  ],
});
```

### 2. 创建翻译文件

在 `src/i18n/` 目录下创建翻译文件：

```json
// src/i18n/zh-CN.json
{
  "welcome": "欢迎",
  "description": "这是一个 Astro i18n 集成示例"
}
```

```json
// src/i18n/en.json
{
  "welcome": "Welcome",
  "description": "This is an Astro i18n integration example"
}
```

### 3. 在页面中使用

```astro
---
import { useTranslations } from 'astro-i18n-aut';

const t = useTranslations(Astro.url);
---

<html>
<head>
  <title>{t('welcome')}</title>
</head>
<body>
  <h1>{t('welcome')}</h1>
  <p>{t('description')}</p>
</body>
</html>
```

## 功能特性

### 🌐 自动路由生成

自动为每种语言生成路由：

- `/zh-CN/` - 中文
- `/en/` - 英文
- `/ja/` - 日文

### 📁 文件结构

```
src/
├── pages/
│   ├── index.astro          # 自动重定向到默认语言
│   ├── zh-CN/
│   │   └── index.astro      # 中文页面
│   ├── en/
│   │   └── index.astro      # 英文页面
│   └── ja/
│       └── index.astro      # 日文页面
├── i18n/
│   ├── zh-CN.json           # 中文翻译
│   ├── en.json              # 英文翻译
│   └── ja.json              # 日文翻译
└── components/
    └── LanguageSwitcher.astro # 语言切换组件
```

### 🔧 高级配置

```javascript
import { defineConfig } from 'astro/config';
import { i18n } from 'astro-i18n-aut/integration';

export default defineConfig({
  integrations: [
    i18n({
      // 默认语言
      defaultLocale: 'zh-CN',
      
      // 支持的语言
      locales: {
        'zh-CN': 'zh-CN',
        'en': 'en',
        'ja': 'ja',
      },
      
      // 是否生成默认语言的前缀
      // 例如：/about vs /zh-CN/about
      prefixDefaultLocale: false,
      
      // 排除的路径
      exclude: ['/api/**', '/admin/**'],
      
      // 重定向配置
      redirect: {
        // 访问根路径时重定向到默认语言
        '/': '/zh-CN',
      },
    }),
  ],
});
```

### 🎯 语言切换组件

```astro
---
// src/components/LanguageSwitcher.astro
import { getLocaleFromUrl, getLocalizedPath } from 'astro-i18n-aut';

const currentLocale = getLocaleFromUrl(Astro.url);
const locales = ['zh-CN', 'en', 'ja'];

function getLanguageName(locale: string) {
  const names = {
    'zh-CN': '中文',
    'en': 'English',
    'ja': '日本語',
  };
  return names[locale] || locale;
}
---

<nav>
  {locales.map((locale) => (
    <a
      href={getLocalizedPath(Astro.url.pathname, locale)}
      class={currentLocale === locale ? 'active' : ''}
    >
      {getLanguageName(locale)}
    </a>
  ))}
</nav>
```

### 📱 SEO 优化

自动添加 `hreflang` 标签：

```html
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh-CN/" />
<link rel="alternate" hreflang="en" href="https://example.com/en/" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

## 最佳实践

### 1. 翻译文件组织

```
src/i18n/
├── zh-CN/
│   ├── common.json      # 通用翻译
│   ├── home.json        # 首页翻译
│   └── about.json       # 关于页面翻译
├── en/
│   ├── common.json
│   ├── home.json
│   └── about.json
└── ja/
    ├── common.json
    ├── home.json
    └── about.json
```

### 2. 使用 TypeScript

```typescript
// src/i18n/index.ts
export type Locale = 'zh-CN' | 'en' | 'ja';

export const locales: Locale[] = ['zh-CN', 'en', 'ja'];

export const defaultLocale: Locale = 'zh-CN';

export function getLanguageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    'zh-CN': '中文',
    'en': 'English',
    'ja': '日本語',
  };
  return names[locale];
}
```

### 3. 动态加载翻译

```astro
---
import { getLocaleFromUrl } from 'astro-i18n-aut';

const locale = getLocaleFromUrl(Astro.url);
const translations = await import(`../i18n/${locale}.json`);
---

<html>
<body>
  <h1>{translations.welcome}</h1>
</body>
</html>
```

## 常见问题

### 如何添加新语言？

1. 在 `astro.config.mjs` 的 `locales` 中添加新语言
2. 创建对应的翻译文件
3. 创建对应语言的页面目录

### 如何处理默认语言？

默认语言的行为可以通过 `prefixDefaultLocale` 配置：

- `false`：默认语言不带前缀（`/about`）
- `true`：默认语言带前缀（`/zh-CN/about`）

### 如何排除某些路径？

使用 `exclude` 配置排除不需要国际化的路径：

```javascript
i18n({
  exclude: ['/api/**', '/admin/**', '/health'],
})
```

## 许可证

MIT

---

> 项目地址：[jlarmstrongiv/astro-i18n-aut](https://github.com/jlarmstrongiv/astro-i18n-aut)
> npm 包：[astro-i18n-aut](https://www.npmjs.com/package/astro-i18n-aut)
