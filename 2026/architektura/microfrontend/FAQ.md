# ❓ Frequently Asked Questions (FAQ)

## Podstawowe pytania

### 1. Czy to produkcyjne rozwiązanie?

**Nie.** To jest edukacyjny projekt demonstracyjny. W produkcji potrzebowałbyś:

- Testy (unit, integration, E2E)
- CI/CD pipeline
- Monitoring i error tracking
- Performance optimization
- Security hardening
- Production build configuration

### 2. Dlaczego Vite a nie Webpack?

**Vite jest szybszy w dev mode:**

- Hot reload: ~200ms (Vite) vs ~5s (Webpack)
- Cold start: ~1s (Vite) vs ~10s (Webpack)
- Modern, ESM-native

**Ale:**

- Webpack ma dojrzalszą implementację Module Federation
- W produkcji różnica jest mniejsza

**Dla tego projektu:** Vite = lepszy DX dla nauki.

### 3. Czy mogę używać różnych wersji React w MFE?

**Technicznie tak, ale NIE RÓB TEGO.**

```typescript
// ❌ ŹĹLE
Host:    React 18.2.0
Products: React 18.3.0  // Będzie konflikt!
```

**Dlaczego źle:**

- Hooks przestaną działać
- Context nie będzie współdzielony
- Dziwne bugi

**Rozwiązanie:**

```typescript
// ✅ DOBRZE - ta sama wersja wszędzie
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.2.0',
    strictVersion: true  // Wymusza exact version
  }
}
```

### 4. Czy mogę mieszać React i Vue?

**Tak, ale to zaawansowane.**

Zobacz `REAL_WORLD_CASES.md` → Banking Dashboard case study.

**Pros:**

- Team autonomy
- Legacy code migration

**Cons:**

- Większy bundle (React + Vue)
- Trudniejsze sharowanie komponentów
- Więcej complexity

**Rekomendacja:** Trzymaj się jednego frameworka jeśli możesz.

## Techniczne pytania

### 5. Co to jest remoteEntry.js?

**Manifest** Module Federation. Zawiera:

- Lista eksportowanych modułów
- Metadata o dependencies
- Runtime code do ładowania modułów

```javascript
// Simplified example
window.products = {
  get: (module) => {
    switch (module) {
      case "./App":
        return () => import("./src/App");
    }
  },
};
```

### 6. Czy lazy loading działa zawsze?

**Nie zawsze automatycznie.**

**Działa:**

```typescript
// React Router + lazy
const Products = lazy(() => import("products/App"));
```

**Nie działa automatycznie:**

```typescript
// Direct import - ładuje od razu
import Products from "products/App";
```

### 7. Jak działa singleton dla React?

```typescript
shared: {
  react: {
    singleton: true;
  }
}
```

**Co się dzieje:**

1. Host ładuje React 18.2.0
2. Products chce załadować React
3. Module Federation: "Już mam React, użyj tego"
4. Products używa React z Host

**Rezultat:** Tylko jedna instancja React w pamięci! ✅

### 8. Co jeśli remote nie odpowiada (down)?

**Zależy od implementacji:**

**Z Error Boundary (ten projekt):**

```typescript
<ErrorBoundary fallback={<Error />}>
  <Products />
</ErrorBoundary>
```

→ User widzi error message, app działa

**Bez Error Boundary:**

```typescript
<Products />  // crash całej aplikacji! 💥
```

**Best practice:** ZAWSZE używaj Error Boundary.

## Architektoniczne pytania

### 9. Ile MFE powinienem mieć?

**Reguła kciuka:**

```
Number of MFE = Number of teams + 1 (host)
```

**Przykłady:**

- 3 teams → 4 apps (Host + 3 MFE)
- 10 teams → 11 apps (Host + 10 MFE)

**Za mało MFE (< 3):**

- Nie ma sensu, używaj modularnego monolitu

**Za dużo MFE (> 20):**

- Overhead za duży
- Trudny management
- Rozważ grupowanie

### 10. Jak komunikować między MFE?

**4 opcje (ranked):**

**1. URL/Routing (najlepsze)** ⭐

```typescript
navigate("/checkout?productId=123");
```

✅ Natural, bookmarkable, no coupling

**2. Props (dla parent-child)**

```typescript
<Products userId={user.id} />
```

✅ Simple, type-safe

**3. Custom Events (dla broadcasts)**

```typescript
window.dispatchEvent(new CustomEvent("cart:updated"));
```

✅ Loose coupling, ⚠️ trudniejszy debug

**4. Shared State (ostatnia opcja)**

```typescript
const useSharedStore = create(...);
```

⚠️ Tight coupling, ❌ trudne testy

**Rekomendacja:** Używaj #1 i #2, unikaj #4.

### 11. NPM package vs Module Federation dla Design System?

| Feature     | NPM Package       | Module Federation |
| ----------- | ----------------- | ----------------- |
| Type safety | ✅ Pełna          | ⚠️ Słabsza        |
| Hot updates | ❌ Wymaga rebuild | ✅ Runtime        |
| Stability   | ✅ Frozen version | ⚠️ Live updates   |
| Bundle size | ⚠️ Duplikacja     | ✅ Shared         |
| Best for    | Production        | Development       |

**Rekomendacja dla produkcji:**

- Small team: NPM package
- Large team: Module Federation + versioning
- Enterprise: Hybrid (NPM types + MF runtime)

### 12. Kiedy NIE używać microfrontendów?

**Red flags:**

- 🚩 Team < 5 osób
- 🚩 Prosta aplikacja (< 10 stron)
- 🚩 Wszystko jest tight coupled
- 🚩 Brak DevOps/infra support
- 🚩 "Bo to modne"

**Użyj zamiast:**

- Modularny monolit
- Feature flags
- Code splitting

## Performance pytania

### 13. Czy MFE są wolniejsze niż monolit?

**Tak, trochę.**

**Overhead:**

- Network requests dla remoteEntry.js (3x w tym projekcie)
- Parse time dla każdego remote
- Module resolution runtime

**Typowo:**

- Monolit TTI: ~1s
- MFE TTI: ~1.5s
- Overhead: ~500ms

**Ale:**

- MFE mają lepszy code splitting
- Lazy loading pomaga
- W praktyce różnica minimalna jeśli dobrze zoptymalizowane

### 14. Jak zmniejszyć bundle size?

**1. Shared dependencies:**

```typescript
shared: ["react", "react-dom", "lodash", "date-fns"];
```

**2. Tree shaking:**

```typescript
// ❌ import _ from 'lodash';  // 70KB
// ✅ import debounce from 'lodash/debounce';  // 2KB
```

**3. Dynamic imports wewnątrz MFE:**

```typescript
const HeavyComponent = lazy(() => import("./Heavy"));
```

**4. Code splitting:**

```typescript
// Vite automatycznie splituje, ale możesz wymusić:
import(/* webpackChunkName: "heavy" */ "./Heavy");
```

**5. Analyze bundle:**

```bash
npm run build
npx vite-bundle-visualizer
```

## Development pytania

### 15. Dlaczego hot reload nie działa w Host dla MFE?

**To normalne ograniczenie Module Federation.**

**Co działa:**

- Design System standalone: HMR ✅
- Products standalone: HMR ✅
- Host własny kod: HMR ✅

**Co nie działa:**

- Host → Products (zmiana w Products): Musisz refresh ❌

**Workaround:**
Podczas developmentu testuj MFE standalone (port 5002).

### 16. Jak debugować "Module not found"?

**Checklist:**

1. ✅ Czy remote działa? `curl http://localhost:5002/assets/remoteEntry.js`
2. ✅ Czy URL w `vite.config.ts` poprawny?
3. ✅ Czy port nie jest zajęty?
4. ✅ Czy `exposes` ma ten moduł?
5. ✅ Czy TypeScript types są aktualne?

**Debug:**

```javascript
// W konsoli przeglądarki
console.log(window.__FEDERATION__);
```

### 17. Jak dodać trzeci MFE?

**Steps:**

1. **Skopiuj mfe-products jako szablon:**

```bash
cp -r mfe-products mfe-cart
cd mfe-cart
```

2. **Zmień package.json:**

```json
{
  "name": "@demo/mfe-cart"
  // ...
}
```

3. **Zmień vite.config.ts:**

```typescript
export default defineConfig({
  // ...
  server: {
    port: 5004, // Nowy port!
  },
});
```

4. **Dodaj do Host remotes:**

```typescript
// host/vite.config.ts
remotes: {
  cart: 'http://localhost:5004/assets/remoteEntry.js',
  // ...
}
```

5. **Dodaj routing:**

```typescript
// host/src/router.tsx
const Cart = lazy(() => import('cart/App'));

<Route path="/cart" element={<Cart />} />
```

Done! 🎉

## Deployment pytania

### 18. Jak deployować na production?

**Option 1: Static hosting (Vercel, Netlify)**

```bash
# Build każdej aplikacji
cd design-system && npm run build
cd ../mfe-products && npm run build
cd ../mfe-profile && npm run build
cd ../host && npm run build

# Deploy każdej do osobnego URL
# DS:       https://ds.myapp.com
# Products: https://products.myapp.com
# Profile:  https://profile.myapp.com
# Host:     https://myapp.com

# Update remotes w Host na production URLs
```

**Option 2: S3/CloudFront**

```
s3://my-bucket/
  design-system/v2.0.0/
  products/v1.5.0/
  profile/v1.3.0/
  host/
```

**Option 3: Containers (Docker)**

```yaml
# docker-compose.yml
services:
  design-system:
    build: ./design-system
    ports: ["5001:80"]

  products:
    build: ./mfe-products
    ports: ["5002:80"]

  # ...
```

### 19. Jak zrobić rollback?

**Z versioned URLs (najłatwiejsze):**

```typescript
// host/vite.config.ts
remotes: {
  products: 'https://cdn.com/products/1.5.1/remoteEntry.js',
  // Było: 1.5.2 (buggy)
}

// Rebuild Host, redeploy
// Products 1.5.2 dalej istnieje, ale nie jest używany
```

**Z latest URLs (trudniejsze):**

- Deploy old version na ten sam URL
- Invalidate CDN cache

## Bezpieczeństwo pytania

### 20. Czy MFE są bezpieczne?

**Zależy od implementacji.**

**Potencjalne ryzyki:**

1. **XSS przez remote:**

```javascript
// Złośliwy remote może wstrzyknąć:
<script>steal(document.cookie)</script>
```

**Mitigation:**

- Content Security Policy (CSP)
- Verify remote sources
- HTTPS only

2. **CORS:**

```typescript
// Production CORS config
server: {
  cors: {
    origin: ['https://myapp.com'],  // Nie '*'!
  }
}
```

3. **Secrets w bundle:**

```typescript
// ❌ NIE commituj:
const API_KEY = "secret123";

// ✅ Użyj env vars:
const API_KEY = import.meta.env.VITE_API_KEY;
```

## Inne pytania

### 21. Czy mogę użyć SSR (Server-Side Rendering)?

**Tak, ale to zaawansowane.**

Module Federation z SSR to możliwe (Next.js 13+ support), ale wykracza poza scope tego projektu.

**Resources:**

- Module Federation SSR examples
- Next.js Module Federation plugin

### 22. Jak testować MFE?

**3 poziomy:**

**1. Unit tests (każdy MFE osobno):**

```bash
cd mfe-products
npm test
```

**2. Integration tests (MFE + DS):**

```typescript
// Test Products + Design System
render(<Products />);
expect(screen.getByRole('button')).toBeInTheDocument();
```

**3. E2E tests (cała aplikacja):**

```typescript
// Playwright
test("user can add product to cart", async ({ page }) => {
  await page.goto("http://localhost:5000/products");
  await page.click("text=Add to cart");
  expect(await page.locator(".cart-count").textContent()).toBe("1");
});
```

### 23. Czy to skaluje?

**Tak, do punktu.**

**Works well:**

- 5-20 teams
- 5-30 MFE
- < 100 developers per team

**Starts to hurt:**

- > 50 MFE (management overhead)
- > 500 developers (coordination nightmare)
- Tight coupling między MFE

**At scale:**

- Potrzebujesz dedykowanego platform team
- Automatyzacja (service discovery, monitoring)
- Governance (contracts, versioning)

---

## Nie znalazłeś odpowiedzi?

1. Przeczytaj dokumentację (9 MD files)
2. Google: "Module Federation [twoje pytanie]"
3. GitHub: [module-federation/module-federation-examples](https://github.com/module-federation/module-federation-examples)
4. Stack Overflow: tag `module-federation`
5. Discord: Module Federation community

---

**Masz pytanie do dodania?** Dodaj do tego pliku!
