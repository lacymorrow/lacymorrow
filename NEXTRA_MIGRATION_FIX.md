# Nextra 4.x Migration - What We Missed

## Critical Issue Discovered

**Nextra 4.x dropped support for Pages Router** - it only works with Next.js App Router. This project uses Pages Router (`src/pages/`), making Nextra 4.x incompatible.

## What Happened

1. **Package Upgrade**: Nextra was upgraded from 2.x/3.x to 4.6.0
2. **Breaking Change**: Nextra 4.x requires App Router (not Pages Router)
3. **Configuration API Changed**: The `theme` and `themeConfig` options were removed/changed
4. **Export Format Changed**: Nextra 4.x uses ES module exports (`export default`) instead of CommonJS

## The Solution

**Downgraded to Nextra 3.3.1** (latest 3.x version) which:
- ✅ Supports Pages Router
- ✅ Uses the same config format as before
- ✅ Compatible with Next.js 16

## Changes Made

1. **package.json**: Changed Nextra from `^4.6.0` to `^3.3.1`
2. **next.config.js**: Reverted to original CommonJS format:
   ```javascript
   const withNextra = require("nextra")({
     theme: "nextra-theme-docs",
     themeConfig: "./theme.config.jsx",
     defaultShowCopyCode: true,
   });
   ```

## Next Steps

Run:
```bash
pnpm install
```

This will install Nextra 3.3.1 and restore compatibility.

## Migration Path to Nextra 4.x (Future)

If you want to upgrade to Nextra 4.x in the future, you'll need to:

1. **Migrate to App Router**:
   - Move `src/pages/` → `src/app/`
   - Convert `_app.mdx` → `layout.tsx`
   - Convert `_document.jsx` → `layout.tsx`
   - Update all routing conventions

2. **Update Configuration**:
   - Nextra 4.x uses a different config format
   - Themes are imported differently
   - Uses ES modules

3. **Test Thoroughly**:
   - All MDX pages need to work with App Router
   - Navigation and routing
   - Custom components

## Summary

**Root Cause**: Nextra 4.x is incompatible with Pages Router
**Fix**: Downgrade to Nextra 3.3.1
**Status**: ✅ Fixed - ready to install and test







