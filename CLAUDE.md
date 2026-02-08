# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio website for Lacy Morrow at lacymorrow.com. Built with Next.js (Pages Router) and Nextra v2 for documentation-style page rendering. Content is primarily MDX files.

## Commands

```bash
pnpm dev          # Start dev server (uses --webpack flag; Turbopack config exists but webpack is forced via scripts)
pnpm build        # Production build + next-sitemap postbuild
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
```

## Architecture

### Nextra v2 + Pages Router

This is a **Pages Router** site using [Nextra v2](https://nextra.site) (`nextra` + `nextra-theme-docs`). The Nextra theme is configured in `theme.config.jsx`. Despite `src/app/` existing, those files are unused (`old.layout.tsx`, `old.page.tsx`) — all routing goes through `src/pages/`.

### Content Structure

Pages are mostly `.mdx` files organized by section:
- `src/pages/index.mdx` — Home (raw layout, no navbar/sidebar/footer)
- `src/pages/work/` — Professional experience (companies, clients, drones)
- `src/pages/play/` — Projects & experiments (art, flash, JS/React/PHP/Python packages, VS Code extensions)
- `src/pages/about/` — Archive, mentions, donate
- `src/pages/contact.mdx` — Contact form

Navigation and page titles are controlled by `_meta.json` files in each directory.

### MDX Component System

All MDX pages receive a shared component map via `_app.mdx` → `src/components/mdx/mdxComponents.jsx`. This map provides:
- **Nextra components**: `Callout`, `Card`, `Cards`, `FileTree`, `Steps`, `Tabs`, `Bleed`
- **mdx-embed** components: `YouTube`, `CodePen`, `Gist`, `Spotify`, `Tweet`, etc.
- **Custom components**: `Flash`, `FlashArt`, `Readme`, `GithubLink`, `DownloadLink`, `View3d`, `Lead`, `Thick`, `Center`
- **Sandpack**: Live code editor embeds
- **shadcn/ui**: Accordion components

To use any of these in MDX, just reference them directly — no import needed.

### Key Directories

- `src/components/ui/` — shadcn/ui components (New York style, CSS variables, `@/lib/utils` for `cn()`)
- `src/components/blocks/` — Composite UI blocks (marquee, carousel, project cards)
- `src/components/pages/` — Page-specific components (home banner, contact form)
- `src/components/layout/` — Footer, nav, socials, image grid
- `src/components/github/` — GitHub card and README rendering
- `src/components/flash/` — Flash/Ruffle embeds for legacy Flash content
- `src/config/` — Site config, strings, icon definitions
- `src/utils/` — Standalone utility functions
- `src/lib/` — `cn()` utility, Resend email client, console banner
- `src/styles/` — Global SCSS (`globals.scss`), page-specific CSS, animations

### API Route

Single API route at `src/pages/api/sendmail.ts` — sends contact form emails via Resend.

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Tech Stack Details

- **React 18** (pinned to 18.3.1, not React 19)
- **Next.js 16** with `--webpack` flag (Turbopack disabled in scripts despite config)
- **Tailwind CSS 3** with shadcn/ui design tokens (HSL CSS variables)
- **TypeScript** with strict mode (`ignoreBuildErrors: true` in next.config for build tolerance)
- **SCSS** for global styles
- **Prettier** with tailwindcss plugin, single quotes, trailing commas

## Environment Variables

- `RESEND_API_KEY` — For contact form email sending
- `RECEIVING_EMAIL` — Email recipient (defaults to lacymorrow0@gmail.com)
- `SITE_URL` — For sitemap generation (defaults to https://lacymorrow.com)
