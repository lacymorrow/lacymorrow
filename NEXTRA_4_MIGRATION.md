# Nextra 4.x Migration Issues & Fixes

## Problem
When upgrading from Nextra 2.x/3.x to Nextra 4.x, the `next.config.js` file failed with:
```
TypeError: require(...) is not a function
```

## Root Cause

Nextra 4.x changed its export structure:
- **Nextra 2.x/3.x**: Exported a function directly (CommonJS compatible)
- **Nextra 4.x**: Uses ES module with `"type": "module"` and exports via `export default`

When using CommonJS `require()` syntax, Nextra 4.x returns an object with a `default` property containing the actual function.

## The Fix

### Before (Nextra 2.x/3.x):
```javascript
const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});
```

### After (Nextra 4.x):
```javascript
const nextra = require("nextra");

const withNextra = nextra.default({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});
```

## Alternative Solutions

### Option 1: Use ES Module Syntax (Recommended for new projects)
Convert `next.config.js` to `next.config.mjs`:

```javascript
import nextra from "nextra";

const nextConfig = {
  // ... your config
};

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});

export default withNextra(nextConfig);
```

### Option 2: Use Dynamic Import (If you need to stay with .js)
```javascript
const nextConfig = {
  // ... your config
};

// At the end of the file
const nextra = await import("nextra");
const withNextra = nextra.default({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
});

module.exports = withNextra(nextConfig);
```

However, Next.js doesn't support top-level await in config files, so Option 1 is preferred.

## What We Missed

1. **Export Structure Change**: Nextra 4.x uses ES module default exports
2. **CommonJS Compatibility**: Need to access `.default` when using `require()`
3. **Documentation Gap**: The migration guide didn't clearly highlight this change

## Verification

To verify the fix works:
```bash
node -e "const nextra = require('nextra'); console.log(typeof nextra.default);"
# Should output: function
```

## Additional Notes

- Nextra 4.x requires Next.js 14+ (we're on 16.0.1 ✅)
- Nextra 4.x uses MDX v3
- All other configuration options remain the same
- The `theme.config.jsx` file doesn't need changes

## Summary

The fix was simple: change `require("nextra")` to `require("nextra").default` when using CommonJS syntax. This maintains compatibility with the existing `next.config.js` file structure while supporting Nextra 4.x's ES module export format.







