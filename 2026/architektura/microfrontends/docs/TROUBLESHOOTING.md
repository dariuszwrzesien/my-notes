# 🔧 Troubleshooting - Module Federation

## Quick Fix: "Failed to fetch remoteEntry.js"

### Problem

```
Uncaught TypeError: Failed to fetch dynamically imported module:
http://localhost:5001/assets/remoteEntry.js
```

### Root Cause

The `@originjs/vite-plugin-federation@1.3.5` does NOT generate `remoteEntry.js` in **development mode** (`npm run dev`). The remote entry is only available when running the **built/preview** version.

### Solution

#### Option 1: Use Preview Mode (Recommended for Module Federation)

```bash
# Stop current dev servers (Ctrl+C)

# Build all applications
cd design-system && npm run build && cd ..
cd mfe-products && npm run build && cd ..
cd mfe-profile && npm run build && cd ..
cd host && npm run build && cd ..

# Run preview servers (serves the built versions)
cd design-system && npm run preview  # Terminal 1
cd mfe-products && npm run preview   # Terminal 2
cd mfe-profile && npm run preview    # Terminal 3
cd host && npm run preview           # Terminal 4

# OR use the script:
./start-preview.sh
```

#### Option 2: Upgrade to newer federation plugin (if available)

Check for newer versions that support dev mode HMR:

```bash
npm install @originjs/vite-plugin-federation@latest --save-dev
```

### Why Dev Mode Doesn't Work

With `@originjs/vite-plugin-federation@1.3.5`:

1. **Dev mode** (`npm run dev`): Vite serves files on-the-fly via HMR. The `remoteEntry.js` is NOT generated as a static file - the `/assets/remoteEntry.js` path returns the HTML index page instead.

2. **Preview mode** (`npm run preview`): Vite serves the built `dist/` folder where `remoteEntry.js` actually exists at `dist/assets/remoteEntry.js`.

### Verification

Check if remoteEntry.js is accessible:

```bash
# In DEV mode - this WILL FAIL:
curl http://localhost:5001/assets/remoteEntry.js
# Returns: HTML content (wrong!)

# In PREVIEW mode - this works:
curl http://localhost:5001/assets/remoteEntry.js
# Returns: JavaScript module (correct!)
```

## Alternative Solution: Dynamic Imports

If you still want to use synchronous-looking imports at the top of your files, that's the **separate issue** below.

### Solution Pattern

#### ❌ BEFORE (Broken)

```typescript
// host/src/App.tsx
import { colors } from "designSystem/tokens"; // ← SYNCHRONOUS!

function App() {
  return <div style={{ color: colors.primary }}>...</div>;
}
```

#### ✅ AFTER (Fixed)

```typescript
// host/src/App.tsx
import React from "react";

function App() {
  const [colors, setColors] = React.useState(null);

  React.useEffect(() => {
    // Dynamic import with error handling
    import("designSystem/tokens")
      .then((module) => setColors(module.colors))
      .catch((err) => {
        console.error("Failed to load design system:", err);
        setColors({ primary: "#3b82f6" }); // Fallback
      });
  }, []);

  if (!colors) return <div>Loading...</div>;

  return <div style={{ color: colors.primary }}>...</div>;
}
```

## Why Synchronous Imports Fail

Module Federation is **asynchronous** by nature:

1. Browser makes HTTP request to `localhost:5001`
2. Downloads `remoteEntry.js`
3. Parses and executes the remote module
4. Returns the exported component/value

**Top-level imports** expect this to happen **synchronously**, which is impossible for remote modules!

## Fix Patterns

### Pattern 1: State + useEffect (for values)

```typescript
const [tokens, setTokens] = useState(null);

useEffect(() => {
  import("designSystem/tokens")
    .then((m) => setTokens(m))
    .catch((err) => setTokens(fallbackTokens));
}, []);
```

### Pattern 2: Lazy + Suspense (for components)

```typescript
import { lazy, Suspense } from "react";

const Button = lazy(() =>
  import("designSystem/Button").then(m => ({ default: m.Button }))
);

function App() {
  return (
    <Suspense fallback={<button>Loading...</button>}>
      <Button>Click me</Button>
    </Suspense>
  );
}
```

### Pattern 3: Fallback values

```typescript
const DEFAULT_COLORS = {
  primary: "#3b82f6",
  bgPrimary: "#ffffff",
};

const [colors, setColors] = useState(DEFAULT_COLORS);

useEffect(() => {
  import("designSystem/tokens")
    .then((m) => setColors(m.colors))
    .catch(() => console.warn("Using fallback colors"));
}, []);
```

## Diagnostic Commands

### Check if all servers are running

```bash
lsof -i :5000  # Host
lsof -i :5001  # Design System
lsof -i :5002  # Products MFE
lsof -i :5003  # Profile MFE
```

### Verify remoteEntry.js is accessible

```bash
curl -I http://localhost:5001/assets/remoteEntry.js
# Should return: HTTP/1.1 200 OK
```

### Find all synchronous imports (dangerous!)

```bash
cd host/src
grep -r "from ['\"]designSystem" .
grep -r "from ['\"]products" .
grep -r "from ['\"]profile" .
```

If you find any, they need to be converted to dynamic imports!

## Prevention Checklist

When importing from remote modules, ALWAYS ask:

- [ ] Am I using `import()` (dynamic)?
- [ ] Do I have error handling (`.catch()`)?
- [ ] Do I have a fallback value/component?
- [ ] Am I wrapping components with `<Suspense>`?
- [ ] Is the remote server actually running?

## Common Mistakes

### Mistake 1: Forgetting Suspense

```typescript
// ❌ Missing Suspense
const Button = lazy(() => import("designSystem/Button"));
return <Button />; // Will crash!

// ✅ With Suspense
return (
  <Suspense fallback={<div>Loading...</div>}>
    <Button />
  </Suspense>
);
```

### Mistake 2: No error handling

```typescript
// ❌ No catch
import("designSystem/tokens").then((m) => setTokens(m));

// ✅ With error handling
import("designSystem/tokens")
  .then((m) => setTokens(m))
  .catch((err) => {
    console.error(err);
    setTokens(FALLBACK);
  });
```

### Mistake 3: Wrong startup order

```bash
# ❌ Wrong - starting host first
cd host && npm run dev      # Port 5000
cd design-system && npm run dev  # Port 5001 (too late!)

# ✅ Correct - remotes first, host last
cd design-system && npm run dev  # Port 5001
cd mfe-products && npm run dev   # Port 5002
cd mfe-profile && npm run dev    # Port 5003
cd host && npm run dev           # Port 5000

# Or use the script:
./start-all.sh
```

## Related Issues

- **"Shared module is not available"** → Check React versions match
- **"Invalid hook call"** → Add `singleton: true` to shared config
- **CORS errors** → Ensure `cors: true` in vite.config.ts
- **White screen** → Check browser console, might be error in component

## Resources

- [Module Federation Docs](https://module-federation.github.io/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [FAQ.md](./FAQ.md) - Full troubleshooting guide
