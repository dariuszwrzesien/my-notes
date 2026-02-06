# Architektura Microfrontendowa - Szczegółowy opis

## 🏗️ Jak to wszystko działa?

### Krok po kroku

#### 1. Start aplikacji

```bash
# Kolejność ma znaczenie!
cd design-system && npm run dev  # Port 5001
cd mfe-products && npm run dev    # Port 5002
cd mfe-profile && npm run dev     # Port 5003
cd host && npm run dev            # Port 5000
```

**Co się dzieje:**

- Każda aplikacja buduje się niezależnie
- Vite generuje `remoteEntry.js` dla każdego remote (DS, Products, Profile)
- Host startuje ostatni i "wie" gdzie szukać remotes

#### 2. Użytkownik otwiera http://localhost:5000

**Host ładuje się:**

```
1. Ładuje swój bundle (App.tsx, Navigation, Router)
2. NIE ładuje jeszcze MFE! (lazy)
3. Pokazuje nawigację
4. Redirect na /products
```

#### 3. Nawigacja do /products

**React Router:**

```typescript
<Route path="/products" element={
  <Suspense fallback={<Loading />}>
    <Products />  // lazy(() => import('products/App'))
  </Suspense>
}>
```

**Module Federation:**

```
1. Host: "Potrzebuję products/App"
2. Webpack/Vite: "Pobieram http://localhost:5002/assets/remoteEntry.js"
3. remoteEntry.js: "Oto moduł ./App"
4. Host: "Renderuję <Products />"
```

#### 4. Products MFE renderuje się

**Products importuje Design System:**

```typescript
import { Button } from "designSystem/Button";
```

**Module Federation:**

```
1. Products: "Potrzebuję designSystem/Button"
2. Webpack/Vite: "Pobieram http://localhost:5001/assets/remoteEntry.js"
3. remoteEntry.js: "Oto moduł ./Button"
4. Products: "Renderuję <Button />"
```

#### 5. Shared dependencies (React)

**Problem:** Products i Host oba używają React. Czy załadujemy React 2x?

**Rozwiązanie: Singleton**

```typescript
shared: {
  react: {
    singleton: true,  // TYLKO JEDNA instancja!
    requiredVersion: '^18.2.0'
  }
}
```

**Rezultat:** React jest załadowany raz, współdzielony przez wszystkich.

### Network waterfall

```
User navigates to /products
│
├─ Host bundle loaded (instant - już załadowany)
│
├─ products/remoteEntry.js (fetch z port 5002)
│  └─ products/App.js (lazy load)
│     │
│     └─ designSystem/remoteEntry.js (fetch z port 5001)
│        └─ designSystem/Button.js
│        └─ designSystem/Card.js
│        └─ designSystem/tokens.js
│
└─ Render complete!
```

**Czas:** ~200-500ms (w dev mode, prod byłby szybszy)

## 🎨 Design System - Dlaczego Module Federation?

### Porównanie opcji

#### Opcja A: NPM Package

```json
{
  "dependencies": {
    "@company/design-system": "^2.0.0"
  }
}
```

**Workflow:**

```
1. Change Button in DS
2. Publish @company/design-system@2.0.1
3. Update package.json w Products
4. npm install
5. Rebuild Products
6. Deploy Products
```

**Czas na update:** ~30-60 min (w najlepszym przypadku)

#### Opcja B: Module Federation

```typescript
remotes: {
  designSystem: "http://localhost:5001/assets/remoteEntry.js";
}
```

**Workflow:**

```
1. Change Button in DS
2. DS hot-reloads (Vite)
3. Refresh browser
4. Products widzi nowy Button ✨
```

**Czas na update:** ~5 sekund!

### W produkcji

**NPM Package:**

- ✅ Stabilny - wersja frozen
- ✅ Type safety
- ✅ Build-time optimization
- ❌ Wymaga rebuild wszystkich MFE
- ❌ Różne wersje DS w różnych MFE

**Module Federation:**

- ✅ Runtime updates
- ✅ Zawsze ta sama wersja DS dla wszystkich
- ✅ Zero rebuilds dla konsumentów
- ❌ Runtime dependency (DS musi działać)
- ❌ Type safety słabsze
- ❌ Większy initial load

### Hybrid approach (enterprise)

Najlepsze z obu światów:

```typescript
// package.json - dla type safety
{
  "devDependencies": {
    "@company/design-system": "^2.0.0"  // tylko types!
  }
}

// vite.config.ts - dla runtime
remotes: {
  designSystem: 'https://cdn.company.com/ds/2.0.0/remoteEntry.js'
}
```

**Rezultat:**

- TypeScript działa (czyta types z npm)
- Runtime ładuje z CDN (Module Federation)
- DS może być cached przez browser
- Rollback łatwy (zmień URL)

## 📡 Komunikacja między MFE

### 1. Props (Top-down)

```typescript
// Host
<Products userId={currentUser.id} onAddToCart={handleCart} />

// Products
interface ProductsProps {
  userId: string;
  onAddToCart: (productId: number) => void;
}
```

**Plusy:**

- ✅ Prosty
- ✅ Type-safe
- ✅ Łatwy debugging

**Minusy:**

- ❌ Tylko top-down
- ❌ Props drilling

**Kiedy używać:** Dane z Host → MFE

### 2. Custom Events

```typescript
// Products emituje
window.dispatchEvent(
  new CustomEvent("cart:updated", {
    detail: { itemsCount: cart.length },
  }),
);

// Host nasłuchuje
useEffect(() => {
  const handler = (e: CustomEvent) => {
    setCartCount(e.detail.itemsCount);
  };
  window.addEventListener("cart:updated", handler);
  return () => window.removeEventListener("cart:updated", handler);
}, []);
```

**Plusy:**

- ✅ MFE → Host communication
- ✅ Loose coupling
- ✅ Multiple subscribers

**Minusy:**

- ❌ Brak type safety (bez extra pracy)
- ❌ Trudniejszy debugging
- ❌ Global scope pollution

**Kiedy używać:** Events, broadcasts, notifications

### 3. Shared State (np. Zustand)

```typescript
// shared-store.ts (może być w Design System lub osobny package)
import create from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
}));

// Products
import { useCartStore } from "shared-store";
const addItem = useCartStore((state) => state.addItem);

// Profile (pokazuje liczbę itemów)
import { useCartStore } from "shared-store";
const items = useCartStore((state) => state.items);
```

**Plusy:**

- ✅ Type-safe
- ✅ Reaktywny
- ✅ MFE ↔ MFE communication
- ✅ Dobry DX

**Minusy:**

- ❌ Tight coupling
- ❌ Shared dependency
- ❌ Trudniejsze testowanie

**Kiedy używać:** Globalny stan (auth, cart, user preferences)

### 4. URL/Router (Recommended!)

```typescript
// Products
navigate("/checkout?productId=123");

// Checkout MFE
const { productId } = useParams();
```

**Plusy:**

- ✅ Natural separation
- ✅ Bookmarkable
- ✅ Browser back/forward works
- ✅ Zero coupling

**Minusy:**

- ❌ Tylko string serialization

**Kiedy używać:** Navigation, deep links

## 🔥 Najczęstsze problemy

### Problem 1: "React instance mismatch"

```
Error: Invalid hook call. Hooks can only be called inside function components.
```

**Przyczyna:** Dwie instancje React!

**Rozwiązanie:**

```typescript
// vite.config.ts - WSZĘDZIE to samo!
shared: {
  react: {
    singleton: true,  // ← WAŻNE!
    requiredVersion: '^18.2.0'
  }
}
```

### Problem 2: "Failed to fetch remote entry"

```
ChunkLoadError: Loading chunk products_App failed
```

**Przyczyny:**

1. Products MFE nie działa (port 5002 down)
2. Zły URL w remotes
3. CORS problem

**Rozwiązanie:**

```bash
# 1. Sprawdź czy działa
curl http://localhost:5002/assets/remoteEntry.js

# 2. Sprawdź config
remotes: {
  products: 'http://localhost:5002/assets/remoteEntry.js'  // ← poprawny path?
}

# 3. CORS musi być włączony
server: {
  cors: true  // ← w vite.config.ts
}
```

### Problem 3: TypeScript nie widzi typów

```typescript
import { Button } from "designSystem/Button"; // Module not found
```

**Rozwiązanie:**

```typescript
// src/types/remotes.d.ts
declare module "designSystem/Button" {
  export const Button: FC<ButtonProps>;
}
```

### Problem 4: Hot reload nie działa

**Przyczyna:** Vite HMR nie przechodzi przez Module Federation

**Rozwiązanie:**

- Design System: Hot reload działa ✅
- Products standalone (port 5002): Hot reload działa ✅
- Products w Host: Musisz refresh browser ❌

To jest normalny trade-off MFE.

## 🎯 Best Practices

### 1. Error Boundaries

```typescript
// ZAWSZE owijaj MFE w Error Boundary
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <RemoteMFE />
  </Suspense>
</ErrorBoundary>
```

### 2. Loading states

```typescript
// NIE:
const Products = lazy(() => import('products/App'));

// TAK:
const Products = lazy(() =>
  import('products/App').catch(() => ({
    default: () => <div>Failed to load Products</div>
  }))
);
```

### 3. Version sync

```bash
# Wszyscy używają tych samych wersji!
react: ^18.2.0  ← TO SAMO wszędzie
react-dom: ^18.2.0  ← TO SAMO wszędzie
```

### 4. Port management

```
5000 - Host
5001 - Design System
5002 - Products
5003 - Profile
5004 - Cart
... i tak dalej
```

Dokumentuj to! (w README)

### 5. Standalone mode

Każdy MFE powinien mieć swój `index.html` do testowania w izolacji.

```typescript
// mfe-products/src/main.tsx
// Standalone entry point - tylko dla developmentu
```

## 🚀 Production deployment

### Strategia 1: Niezależne deploymenty

```
DS:       https://cdn.company.com/design-system/v2.0.0/
Products: https://cdn.company.com/products/v1.5.2/
Profile:  https://cdn.company.com/profile/v1.3.0/
Host:     https://app.company.com/
```

**Config w Host:**

```typescript
remotes: {
  designSystem: `${import.meta.env.VITE_DS_URL}/remoteEntry.js`,
  products: `${import.meta.env.VITE_PRODUCTS_URL}/remoteEntry.js`,
  profile: `${import.meta.env.VITE_PROFILE_URL}/remoteEntry.js`,
}
```

**CI/CD:**

```yaml
# products-pipeline.yml
- build
- test
- deploy to S3/CDN
- invalidate CloudFront cache
# Host NIE musi być redeployowany! ✨
```

### Strategia 2: Versioned URLs

```typescript
// Host wie o konkretnych wersjach
remotes: {
  products: "https://cdn.company.com/products/1.5.2/remoteEntry.js";
}
```

**Rollback:**

```typescript
// Zmień tylko string!
remotes: {
  products: "https://cdn.company.com/products/1.5.1/remoteEntry.js"; // rollback
}
```

### Strategia 3: Service Discovery

```typescript
// Host pobiera config z API
const config = await fetch("/api/microfrontends/config");
// { products: "https://...", profile: "https://..." }

// Dynamic remotes
const Products = lazy(() => loadRemoteModule(config.products, "./App"));
```

---

To jest sporo informacji, ale to fundament! Przeczytaj powoli, uruchom projekt, eksperymentuj.

**Next steps:** Spróbuj dodać trzeci MFE (np. Cart) samodzielnie!
