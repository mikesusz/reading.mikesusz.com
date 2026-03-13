# Astro 5 → 6 Upgrade Guide

This document describes the changes required to upgrade an Astro 5 site to Astro 6, based on a real migration. Use it to guide an automated upgrade.

## 1. Install updated packages

`npx @astrojs/upgrade` may fail on the install step even though it correctly identifies the required versions. If it does, run the install command it prints manually. All integrations with major version bumps must be installed together with `astro@6`:

```
npm i astro@6 @astrojs/node@10 @astrojs/mdx@5 @astrojs/react@5
```

(Also bump `@astrojs/rss` and `@astrojs/sitemap` to their latest minor versions while you're at it.)

## 2. Zod: import from `zod` directly

`z` exported from `astro:content` is deprecated in Astro 6. Update the import in your content config:

```ts
// Before
import { defineCollection, z } from 'astro:content';

// After
import { defineCollection } from 'astro:content';
import { z } from 'zod';
```

## 3. Zod: replace `.or()` with `z.union()`

Astro 6 ships Zod v4, which removed the `.or()` method. Replace all usages:

```ts
// Before
z.string().or(z.date()).transform(...)

// After
z.union([z.string(), z.date()]).transform(...)
```

## 4. Move and update the content config file

Astro 6 removed legacy content collections. Two changes are required:

**a) Rename the file:**
- Old: `src/content/config.ts`
- New: `src/content.config.ts` (at the project root level, alongside `src/`)

**b) Add a `loader` to every collection** using the `glob` loader from `astro/loaders`:

```ts
// Before
import { defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: z.object({ ... })
});

// After
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ ... })
});
```

Add a `loader` with the correct `base` path for every collection. The old `src/content/config.ts` file should be deleted.

## 5. Replace `entry.slug` with `entry.id`

The `slug` property no longer exists on collection entries in Astro 6. Replace all references with `id`. This affects:

- Dynamic route files (`[...slug].astro`) — in `getStaticPaths()`
- Index pages that build links to entries
- Components that build links to entries
- RSS feed files

```ts
// Before
params: { slug: post.slug }
href={`/blog/${post.slug}/`}

// After
params: { slug: post.id }
href={`/blog/${post.id}/`}
```

Note: entry `id` values are the filename without extension (e.g. `my-post` for `my-post.md`), which matches the old `slug` behavior for flat collections.

## 6. Replace `entry.render()` with `render(entry)`

The instance method `entry.render()` was removed. Import `render` from `astro:content` and call it as a standalone function:

```ts
// Before
import { getCollection } from 'astro:content';
const { Content } = await post.render();

// After
import { getCollection, render } from 'astro:content';
const { Content } = await render(post);
```

## Checklist

- [ ] Packages installed: `astro@6`, `@astrojs/node@10`, `@astrojs/mdx@5`, `@astrojs/react@5`
- [ ] `z` imported from `zod`, not `astro:content`
- [ ] All `.or(z.*)` replaced with `z.union([...])`
- [ ] `src/content/config.ts` moved to `src/content.config.ts`
- [ ] Every collection has a `loader: glob(...)` defined
- [ ] All `entry.slug` replaced with `entry.id`
- [ ] All `entry.render()` replaced with `render(entry)` (imported from `astro:content`)
- [ ] `npm run build` completes with no errors and no `[...slug]` route conflict warnings
