# Testing & Debugging Guide

## 🧪 Testowanie w różnych trybach

### 1. Standalone Mode (izolowane testowanie MFE)

Każdy MFE można testować osobno bez Host:

```bash
# Design System
cd design-system
npm run dev
# Otwórz: http://localhost:5001
# Zobaczysz: Component Preview

# Products MFE
cd mfe-products
npm run dev
# Otwórz: http://localhost:5002
# Zobaczysz: Products page (z DS)

# Profile MFE
cd mfe-profile
npm run dev
# Otwórz: http://localhost:5003
# Zobaczysz: Profile page (z DS)
```

**Zalety:**

- ✅ Szybki feedback loop
- ✅ Brak zależności od Host
- ✅ Idealny do developmentu

**Testy:**

- [ ] Komponent renderuje się
- [ ] Stany działają (cart, edit mode)
- [ ] Style są poprawne
- [ ] Brak błędów w konsoli

### 2. Integrated Mode (pełna aplikacja)

```bash
# Terminal 1
cd design-system && npm run dev

# Terminal 2
cd mfe-products && npm run dev

# Terminal 3
cd mfe-profile && npm run dev

# Terminal 4
cd host && npm run dev

# Otwórz: http://localhost:5000
```

**Testy:**

- [ ] Routing działa (klikaj nawigację)
- [ ] Lazy loading działa (zobacz Network tab)
- [ ] Shared components wyglądają jednakowo
- [ ] Brak duplikacji React (zobacz console warning)

### 3. Error Scenarios (testowanie błędów)

#### Scenariusz A: MFE nie działa

```bash
# Uruchom tylko Host i DS (bez Products)
cd design-system && npm run dev
cd host && npm run dev
# Otwórz: http://localhost:5000
# Kliknij Products
```

**Oczekiwany rezultat:**

- Error Boundary pokazuje się
- User widzi "Failed to load Products"
- App nie crashuje całkowicie

#### Scenariusz B: Design System nie działa

```bash
# Uruchom Host i Products (bez DS)
cd mfe-products && npm run dev
cd host && npm run dev
# Otwórz: http://localhost:5000/products
```

**Oczekiwany rezultat:**

- ChunkLoadError w konsoli
- Loading forever lub Error Boundary

#### Scenariusz C: Różne wersje React

Edytuj `mfe-products/package.json`:

```json
{
  "dependencies": {
    "react": "^17.0.0" // zmień na starą wersję
  }
}
```

```bash
cd mfe-products && npm install && npm run dev
```

**Oczekiwany rezultat:**

- Ostrzeżenie o version mismatch
- Możliwe błędy hooks

## 🔍 Debugging

### Chrome DevTools - Network Tab

1. Otwórz DevTools (F12)
2. Network tab
3. Odśwież stronę
4. Filtruj "remoteEntry"

**Co zobaczysz:**

```
remoteEntry.js  (from localhost:5001) - Design System
remoteEntry.js  (from localhost:5002) - Products
remoteEntry.js  (from localhost:5003) - Profile
```

**Analiza:**

- Sprawdź Response (czy 200 OK?)
- Sprawdź Size (czy rozsądny?)
- Sprawdź Timing (ile trwało?)

### React DevTools - Components

1. Zainstaluj React DevTools
2. Otwórz Components tab
3. Znajdź `<Suspense>` boundaries

**Co zobaczysz:**

```
App
└─ BrowserRouter
   └─ Navigation
   └─ Routes
      └─ Suspense
         └─ Products (lazy loaded)
            └─ Card (from Design System)
            └─ Button (from Design System)
```

### Console Debugging

#### Sprawdź co jest załadowane:

```javascript
// W konsoli przeglądarki:
console.log(window.__FEDERATION__);
// Zobaczysz info o Module Federation

// Sprawdź React:
console.log(React.version);
// Powinno być "18.2.0" wszędzie
```

#### Custom debug mode:

Dodaj do `host/src/App.tsx`:

```typescript
useEffect(() => {
  console.log("Host mounted");

  // Log navigation
  window.addEventListener("popstate", () => {
    console.log("Navigation:", location.pathname);
  });

  // Log MFE loads
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes("remoteEntry")) {
        console.log("MFE loaded:", entry.name, `${entry.duration}ms`);
      }
    });
  });
  observer.observe({ entryTypes: ["resource"] });
}, []);
```

## 🧪 Eksperymenty do przeprowadzenia

### Eksperyment 1: Hot reload w Design System

1. Uruchom wszystkie aplikacje
2. Otwórz `design-system/src/components/Button.tsx`
3. Zmień kolor:
   ```typescript
   backgroundColor: "hotpink"; // było: colors.primary
   ```
4. Zapisz

**Obserwuj:**

- DS strona (5001): Instant hot reload ✅
- Products standalone (5002): Refresh browser → nowy kolor ✅
- Host (5000): Refresh browser → nowy kolor ✅

**Wniosek:** Module Federation działa w runtime!

### Eksperyment 2: Dodaj nowy token

1. Otwórz `design-system/src/tokens/index.ts`
2. Dodaj:
   ```typescript
   export const colors = {
     ...existing,
     danger: "#dc2626", // NEW!
   };
   ```
3. Użyj w Products:

   ```typescript
   // mfe-products/src/App.tsx
   import { colors } from 'designSystem/tokens';

   <div style={{ backgroundColor: colors.danger }}>
     New color!
   </div>
   ```

**Obserwuj:**

- TypeScript może narzekać (brak types)
- Runtime działa natychmiast

**Fix types:**

```typescript
// mfe-products/src/types/remotes.d.ts
declare module "designSystem/tokens" {
  export const colors: {
    // ... existing
    danger: string; // ADD
  };
}
```

### Eksperyment 3: Komunikacja między MFE

1. W `mfe-products/src/App.tsx` dodaj:

   ```typescript
   const addToCart = (productId: number) => {
     setCart([...cart, productId]);

     // Emit event
     window.dispatchEvent(
       new CustomEvent("cart:updated", {
         detail: { itemsCount: cart.length + 1 },
       }),
     );
   };
   ```

2. W `host/src/components/Navigation.tsx` dodaj:

   ```typescript
   const [cartCount, setCartCount] = useState(0);

   useEffect(() => {
     const handler = (e: any) => {
       console.log('Cart updated!', e.detail);
       setCartCount(e.detail.itemsCount);
     };
     window.addEventListener('cart:updated', handler);
     return () => window.removeEventListener('cart:updated', handler);
   }, []);

   // W JSX:
   <div>Cart: {cartCount}</div>
   ```

**Obserwuj:**

- Kliknij "Add to cart" w Products
- Cart count update w Navigation
- Console log z event

**Wniosek:** Custom events działają!

### Eksperyment 4: Error Boundary test

1. W `mfe-products/src/App.tsx` dodaj button:

   ```typescript
   <Button onClick={() => { throw new Error('Test error!'); }}>
     Throw Error
   </Button>
   ```

2. Kliknij button

**Obserwuj:**

- Error Boundary catches error
- User widzi fallback UI
- Reszta aplikacji (Navigation) działa

**Wniosek:** Izolacja błędów działa!

### Eksperyment 5: Memory leak detection

1. Otwórz Chrome DevTools → Memory tab
2. Take heap snapshot
3. Nawiguj Products → Profile → Products (10x)
4. Take another heap snapshot
5. Compare

**Szukaj:**

- Detached DOM nodes
- Event listeners (nie powinny rosnąć)
- React components (nie powinny leakować)

## 📊 Performance Analysis

### Lighthouse Audit

1. Otwórz DevTools → Lighthouse
2. Generate report
3. Sprawdź:
   - Performance score
   - Time to Interactive
   - Total Bundle Size

**Typowe wyniki (dev mode):**

- Performance: ~60-70 (dev nie jest zoptymalizowany)
- TTI: 2-3s
- Bundle: ~1-2MB (z React dev)

**W production (po `npm run build`):**

- Performance: >90
- TTI: <1s
- Bundle: <500KB

### Bundle Analysis

Dodaj do każdego `vite.config.ts`:

```typescript
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    // ... existing
    visualizer({ open: true }),
  ],
});
```

```bash
cd mfe-products && npm run build
# Otwiera bundle analysis w przeglądarce
```

**Szukaj:**

- Duplicate dependencies
- Large packages
- Unused code

## 🐛 Typowe problemy i rozwiązania

### Problem: "React is not defined"

**Przyczyna:** Singleton nie działa

**Fix:**

```typescript
// vite.config.ts - sprawdź WSZĘDZIE
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true }
}
```

### Problem: "Cannot read property 'call' of undefined"

**Przyczyna:** Remote nie załadowany

**Debug:**

1. Sprawdź Network tab (czy 200?)
2. Sprawdź URL w remotes config
3. Sprawdź czy remote działa standalone

### Problem: Styles konfliktują się

**Przyczyna:** Global CSS clash

**Fix:**

- Użyj CSS Modules
- Lub scoped classes
- Lub CSS-in-JS

### Problem: TypeScript errors w IDE

**Przyczyna:** Brak types dla remotes

**Fix:**

```typescript
// src/types/remotes.d.ts
declare module "designSystem/Button" {
  // ... types
}
```

## ✅ Checklist przed commitem

- [ ] Wszystkie 4 aplikacje startują bez błędów
- [ ] Routing działa (nawigacja Products ↔ Profile)
- [ ] Design System components renderują się poprawnie
- [ ] Brak błędów w konsoli
- [ ] Brak memory leaks (sprawdź DevTools)
- [ ] Error Boundaries działają
- [ ] Types są poprawne (brak TS errors)
- [ ] README jest up-to-date

## 🎯 Metryki sukcesu

Twój microfrontend setup jest zdrowy jeśli:

### Performance

- [ ] TTI < 3s (dev) / < 1s (prod)
- [ ] FCP < 2s
- [ ] No layout shifts
- [ ] remoteEntry.js < 100KB each

### Reliability

- [ ] Error rate < 0.1%
- [ ] Zero cross-MFE crashes
- [ ] Graceful degradation gdy MFE down

### Developer Experience

- [ ] HMR < 5s
- [ ] Build time < 30s per MFE
- [ ] Clear error messages
- [ ] Easy to debug

### Architecture

- [ ] MFE mogą być deployed niezależnie
- [ ] < 5 shared dependencies
- [ ] Zero circular dependencies
- [ ] Clear ownership boundaries

---

**Pro tip:** Zapisuj powyższe metryki w spreadsheet i trackuj over time. Jeśli metryki się pogarszają, to znak że coś idzie nie tak.
