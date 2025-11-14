# Nextra 4.x Migration Issue - Pages Router Incompatibility

## Critical Discovery

**Nextra 4.x requires Next.js App Router**, but this project uses **Pages Router** (`src/pages/` directory structure).

## The Problem

1. **Nextra 4.x Breaking Change**: Dropped support for Pages Router, only supports App Router
2. **Current Setup**: Project uses Pages Router (`src/pages/_app.mdx`, `src/pages/index.mdx`, etc.)
3. **Configuration Error**: The `theme` and `themeConfig` options don't exist in Nextra 4.x API

## Solutions

### Option 1: Downgrade to Nextra 3.x (Recommended for Quick Fix)

Nextra 3.x still supports Pages Router. This is the quickest path to restore functionality.

```bash
pnpm remove nextra nextra-theme-docs
pnpm add nextra@^3.1.0 nextra-theme-docs@^3.1.0
```

Then revert `next.config.js` to:
```javascript
const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});
```

**Pros**: 
- Minimal changes required
- Keeps existing Pages Router structure
- Quick fix

**Cons**:
- Using older version
- May have compatibility issues with Next.js 16/React 19

### Option 2: Migrate to App Router (Major Refactor)

This would require:
1. Moving all `src/pages/*` to `src/app/*` directory structure
2. Converting `_app.mdx` to `layout.tsx`
3. Converting `_document.jsx` to `layout.tsx` metadata
4. Updating all routing to App Router conventions
5. Updating Nextra 4.x configuration format

**Pros**:
- Latest Nextra features
- Future-proof
- Better Next.js 16 integration

**Cons**:
- Significant refactoring required
- Potential breaking changes across entire site
- Time-consuming

## Recommendation

**Downgrade to Nextra 3.x** for now to get the site working quickly, then plan a proper migration to App Router + Nextra 4.x as a separate project.

## Next Steps

1. Test Nextra 3.x compatibility with Next.js 16
2. If incompatible, consider staying on Next.js 15 with Nextra 3.x
3. Or proceed with full App Router migration







