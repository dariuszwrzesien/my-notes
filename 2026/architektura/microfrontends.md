# Microfrontends - architektura rozproszonych aplikacji frontendowych

Microfrontends to architektoniczne podejście do budowy aplikacji webowych, w którym frontend jest podzielony na mniejsze, niezależne aplikacje, każda odpowiedzialna za konkretny obszar biznesowy. Podobnie jak microservices w backendzie, microfrontendy umożliwiają niezależny rozwój, testowanie i deployment poszczególnych części systemu.

## Uruchomienie projektu przykładowego

Projekt używa **Vite** z pluginem **@originjs/vite-plugin-federation**. W katalogu `microfrontend`:

```bash
# Instalacja zależności
chmod +x install-all.sh
./install-all.sh

# Uruchomienie wszystkich aplikacji (development)
chmod +x start-all.sh
./start-all.sh

# Lub tryb preview (production build)
chmod +x start-preview.sh
./start-preview.sh
```

Serwery deweloperskie uruchomią się na portach:

- Design System: `http://localhost:5001`
- Products MFE: `http://localhost:5002`
- Profile MFE: `http://localhost:5003`
- **Host (główna aplikacja)**: `http://localhost:5000` ← Otwórz ten!

Nawigacja: **Products** | **Profile** – widoki są lazy-loadowane z osobnych mikrofrontendów.

## Architektura systemu

```
┌─────────────────────────────────────────────┐
│            HOST APPLICATION                 │
│         (Shell / Container)                 │
│                                             │
│  ┌──────────────┐    ┌──────────────┐      │
│  │ MFE Products │    │ MFE Profile  │      │
│  │ (lazy load)  │    │ (lazy load)  │      │
│  └──────┬───────┘    └──────┬───────┘      │
│         │                   │              │
│         └────────┬──────────┘              │
└──────────────────┼─────────────────────────┘
                   │
          ┌────────▼────────┐
          │  Design System  │
          │  • Components   │
          │  • Tokens       │
          │  • Theme        │
          └─────────────────┘
```

## Kluczowe koncepty

### Module Federation

Module Federation to technologia (webpack/vite) umożliwiająca **runtime sharing** kodu między niezależnymi aplikacjami. Każda aplikacja może:

- **Expose** - udostępniać swoje moduły
- **Consume** - importować zdalne moduły
- **Share** - współdzielić dependencies (np. React)

**Przykład konfiguracji (Vite):**

```typescript
// Design System - expose
federation({
  name: "design-system",
  exposes: {
    "./Button": "./src/components/Button",
    "./Card": "./src/components/Card",
    "./tokens": "./src/tokens",
  },
});

// MFE Products - consume DS
federation({
  name: "products",
  exposes: {
    "./App": "./src/App",
  },
  remotes: {
    designSystem: "http://localhost:5001/assets/remoteEntry.js",
  },
  shared: ["react", "react-dom"],
});

// Host - consume wszystko
federation({
  name: "host",
  remotes: {
    products: "http://localhost:5002/assets/remoteEntry.js",
    profile: "http://localhost:5003/assets/remoteEntry.js",
    designSystem: "http://localhost:5001/assets/remoteEntry.js",
  },
  shared: ["react", "react-dom"],
});
```

### Lazy Loading

MFE są ładowane tylko wtedy, gdy użytkownik przechodzi na daną ścieżkę:

```typescript
// Host - router.tsx
const Products = lazy(() => import('products/App'));
const Profile = lazy(() => import('profile/App'));

// Routing z Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/products" element={<Products />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

**Korzyści:**

- Szybszy initial load
- Automatyczny code splitting
- Moduły ładowane on-demand

### Shared Dependencies

Kluczowe biblioteki (React, React Router) są współdzielone jako **singleton** - ładowane raz i używane przez wszystkie MFE:

```typescript
shared: {
  react: {
    singleton: true,        // TYLKO JEDNA instancja!
    requiredVersion: '^18.2.0'
  },
  'react-dom': {
    singleton: true,
    requiredVersion: '^18.2.0'
  }
}
```

Bez tego każdy MFE załadowałby własną kopię React → błędy hooks i nadmiarowy bundle.

## Zalety Microfrontendów

| Zaleta                          | Opis                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Niezależność zespołów**       | Każdy zespół pracuje nad własnym MFE z własnym repo, CI/CD i release cycle.                     |
| **Skalowanie organizacyjne**    | 10+ zespołów może pracować równolegle bez konfliktów w kodzie.                                  |
| **Niezależne deploymenty**      | Zmiana w Products nie wymaga rebuildu całej aplikacji; rollback jednego MFE bez wpływu na inne. |
| **Technologiczna różnorodność** | Możliwość użycia różnych frameworków (React, Vue) w różnych MFE (choć w praktyce: unikaj).      |
| **Lepsza izolacja**             | Błąd w jednym MFE nie powoduje crashu całej aplikacji (Error Boundaries).                       |
| **Onboarding prostszy**         | Nowi deweloperzy pracują z mniejszym codebase (tylko ich MFE).                                  |
| **Faster time to market**       | Deployment bez czekania na cały pipeline monolitu.                                              |

## Wady Microfrontendów

| Wada                            | Opis                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Złożoność infrastruktury**    | Więcej buildów, deploymentów, monitoring rozproszonego systemu, zarządzanie wersjami.                            |
| **Performance overhead**        | Duplikacja kodu (jeśli źle skonfigurowane), network latency przy ładowaniu remotes, większy initial load.        |
| **Trudniejszy debugging**       | Błędy pochodzą z różnych źródeł, cross-MFE bugs ciężkie do śledzenia, problemy z wersjami bibliotek.             |
| **Gorsze DX początkowo**        | Potrzeba uruchomienia wielu serwersów, hot reload nie zawsze działa między MFE, TypeScript types problematyczne. |
| **Ryzyko distributed monolith** | Jeśli MFE są mocno powiązane przez shared state → gorsze niż zwykły monolit.                                     |
| **Konieczność konwencji**       | Wymaga dobrych praktyk: kontrakty API, wersjonowanie Design System, governance.                                  |

## Kiedy NIE używać Microfrontendów?

### 1. Mały zespół (< 5 osób)

- Overhead infrastruktury > korzyści
- Modularny monolit wystarczy
- Zespół może zarządzać całością

### 2. Niskie wymagania biznesowe

- Prosta aplikacja CRUD
- Brak planów na skalowanie
- Tight coupling między modułami

### 3. Brak autonomii zespołów

- Wszyscy pracują razem nad tym samym
- Częste cross-team collaboration
- Brak podziału na domeny

### 4. Silne wymagania performance

- Każda millisekunda się liczy
- Nie stać Cię na overhead
- Krytyczna ścieżka użytkownika (to
  najkrótsza i najważniejsza sekwencja kroków, którą użytkownik musi przejść, aby osiągnąć główny cel w aplikacji lub na stronie.)

### 5. Wczesna faza startupu

- Brak stabilnych granic między funkcjonalnościami
- Szybkie zmiany wymagań
- Lepiej zacząć od modularnego monolitu

## Komunikacja między MFE

### 1. Props (Top-down)

```typescript
// Host przekazuje props do MFE
<Products userId={currentUser.id} onAddToCart={handleCart} />

// Products przyjmuje props
interface ProductsProps {
  userId: string;
  onAddToCart: (productId: number) => void;
}
```

**Plusy:** ✅ Prosty, ✅ Type-safe, ✅ Łatwy debugging

**Minusy:** ❌ Tylko top-down, ❌ Props drilling

**Kiedy używać:** Dane z Host → MFE

### 2. Custom Events

```typescript
// Products emituje event
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

**Plusy:** ✅ MFE → Host communication, ✅ Loose coupling, ✅ Multiple subscribers

**Minusy:** ❌ Brak type safety, ❌ Trudniejszy debugging, ❌ Global scope pollution

**Kiedy używać:** Events, broadcasts, notifications

### 3. Shared State (np. Zustand)

```typescript
// shared-store.ts (może być w DS lub osobny package)
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

// Products używa
import { useCartStore } from "shared-store";
const addItem = useCartStore((state) => state.addItem);

// Profile czyta
import { useCartStore } from "shared-store";
const items = useCartStore((state) => state.items);
```

**Plusy:** ✅ Type-safe, ✅ Reaktywny, ✅ MFE ↔ MFE communication, ✅ Dobry DX

**Minusy:** ❌ Tight coupling, ❌ Shared dependency, ❌ Trudniejsze testowanie

**Kiedy używać:** Globalny stan (auth, cart, user preferences)

### 4. URL/Router (Rekomendowane!)

```typescript
// Products
navigate("/checkout?productId=123");

// Checkout MFE
const { productId } = useParams();
```

**Plusy:** ✅ Natural separation, ✅ Bookmarkable, ✅ Browser back/forward works, ✅ Zero coupling

**Minusy:** ❌ Tylko string serialization

**Kiedy używać:** Navigation, deep links

## Design System w architekturze MFE

### Module Federation vs NPM Package

| Aspekt                   | Module Federation               | NPM Package                     |
| ------------------------ | ------------------------------- | ------------------------------- |
| **Update flow**          | Runtime - instant               | Rebuild wymagany                |
| **Type safety**          | Słabsze (remotes.d.ts manual)   | Pełne                           |
| **Deployment**           | DS deploy = wszystkie widzą     | DS deploy → update w każdym MFE |
| **Stabilność**           | Zmiana może zepsuć live         | Wersja frozen                   |
| **Bundle size**          | Współdzielony (jeden raz)       | Duplikacja w każdym bundle      |
| **Developer Experience** | Hot reload działa (w dev)       | Rebuild + npm install           |
| **Best for**             | Dev, prototypy, fast iterations | Production, enterprise, stable  |

**Hybrid approach (enterprise):**

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
- DS cached przez browser
- Rollback łatwy (zmień URL)

## Typowe problemy i rozwiązania

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

- Design System standalone: Hot reload działa ✅
- Products standalone (port 5002): Hot reload działa ✅
- Products w Host: Musisz refresh browser ❌

To normalny trade-off MFE.

## Anti-Patterns - czego unikać

### 1. Distributed Monolith

```typescript
// ❌ Wszystkie MFE importują shared store
import { globalState } from '@company/shared-state';

// ✅ Każdy MFE ma własny stan
const useProductsStore = create((set) => ({ ... }));
```

**Zasada:** Prefer duplication over wrong abstraction

### 2. Shared State Hell

```typescript
// ❌ Globalny store dla wszystkiego
const useGlobalStore = create((set) => ({
  user: null,
  products: [],
  cart: [],
  orders: [],
  // ... 50 więcej pól
}));

// ✅ Każdy MFE ma własny store
const useProductsStore = create(...);
const useProfileStore = create(...);
```

**Zasada:** Local by default, global by exception

### 3. Chatty Communication

```typescript
// ❌ MFE komunikują się non-stop
useEffect(() => {
  window.dispatchEvent(new CustomEvent('product:hover', { ... }));
}, [hoveredProduct]);  // 50 events/second!

// ✅ Komunikuj tylko significant events
window.dispatchEvent(
  new CustomEvent('cart:updated', {
    detail: { itemsCount: cart.length }  // tylko count!
  })
);
```

**Zasada:** Communicate intent, not implementation

### 4. Premature Microfrontendization

```typescript
// ❌ Mikro-MFE dla wszystkiego
Header MFE
Footer MFE
Button MFE (WTF?)
Logo MFE

// ✅ Rozsądna granularność
Host (Header, Footer, Layout)
Products MFE (cała sekcja)
Checkout MFE (cały flow)
Profile MFE (cały profil)
```

**Zasada:** Start with modular monolith, extract MFE when needed

**Kiedy ekstraktować:**

- ✅ Osobny zespół
- ✅ Inny release cycle
- ✅ Różne tech requirements
- ❌ "Bo tak" lub "Bo modular"

### 5. Design System jako Bottleneck

```typescript
// ❌ DS zawiera business logic
<Button onClick={handleCheckout}>  // Button wie o checkout?!

// ✅ DS = UI primitives only
<Button variant="primary">Add to cart</Button>  // generic

// ✅ Business components w MFE
<AddToCartButton product={product}>
  <Button variant="primary">Add to cart</Button>
</AddToCartButton>
```

**Zasada:** Design System provides tools, not solutions

### 6. CSS Chaos

```css
/* ❌ Products MFE */
.button {
  color: blue;
}

/* ❌ Profile MFE */
.button {
  color: red;
}

/* 💥 Conflict! Który wygra? */
```

**Rozwiązanie:**

```typescript
// ✅ CSS Modules
import styles from './ProductCard.module.css';
<div className={styles.card}>

// ✅ CSS-in-JS
const Card = styled.div`padding: 16px;`;

// ✅ Scoped styles z prefixem
<div className="mfe-products-card">
```

**Zasada:** Scope everything, assume nothing

## Best Practices

### 1. Error Boundaries

```typescript
// ZAWSZE owijaj MFE w Error Boundary
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <RemoteMFE />
  </Suspense>
</ErrorBoundary>
```

### 2. Loading States

```typescript
// TAK:
const Products = lazy(() =>
  import('products/App').catch(() => ({
    default: () => <div>Failed to load Products</div>
  }))
);
```

### 3. Version Sync

```bash
# Wszyscy używają tych samych wersji!
react: ^18.2.0          ← TO SAMO wszędzie
react-dom: ^18.2.0      ← TO SAMO wszędzie
```

### 4. Standalone Mode

Każdy MFE powinien mieć swój `index.html` do testowania w izolacji.

### 5. Dokumentacja kontraktów

```typescript
// Typed events
interface AppEvents {
  "cart:updated": { itemsCount: number };
  "user:logout": void;
}
```

## Realne case studies

### Case 1: E-commerce gigant (>50 MFE)

**Setup:**

- Host: nawigacja, autentykacja, checkout
- MFE: produkty, koszyk, user profile, admin panel
- DS: npm package + Storybook
- Komunikacja: shared Zustand store

**Wynik:**

- ✅ 20+ zespołów niezależnie
- ✅ 10x szybszy deployment
- ❌ Pierwszy rok: debugging hell
- ❌ Bundle size wzrósł o 30%

### Case 2: Banking platform (8 MFE)

**Setup:**

- Host: dashboard
- MFE: accounts, transfers, investments, loans
- DS: Module Federation
- Komunikacja: Custom events

**Wynik:**

- ✅ Compliance per MFE (audit)
- ✅ Security updates niezależnie
- ❌ Performance problemy (3s TTI)
- ❌ Overhead monitoringu

### Case 3: SaaS startup (wrócił do monolitu)

**Setup:**

- 3 osoby, 2 MFE
- Przedwczesna optymalizacja

**Wynik:**

- ❌ Overhead infrastruktury za duży
- ❌ DX katastrofalny
- ✅ Wrócili do modularnego monolitu
- ✅ Produktywność wzrosła 2x

## Struktura projektu przykładowego

```
microfrontend/
├── design-system/          # Współdzielony Design System
│   ├── src/
│   │   ├── components/     # Button, Card
│   │   ├── tokens/         # Colors, spacing, typography
│   │   └── theme/          # ThemeProvider (light/dark)
│   ├── vite.config.ts      # Module Federation - expose
│   └── package.json
│
├── host/                   # Shell Application
│   ├── src/
│   │   ├── App.tsx         # Główny komponent
│   │   ├── router.tsx      # Routing + lazy loading
│   │   └── components/
│   │       └── Navigation.tsx
│   ├── vite.config.ts      # Module Federation - consume all
│   └── package.json
│
├── mfe-products/           # Microfrontend: Produkty
│   ├── src/
│   │   └── App.tsx         # Lista produktów + cart
│   ├── vite.config.ts      # Module Federation - expose ./App
│   └── package.json
│
├── mfe-profile/            # Microfrontend: Profil
│   ├── src/
│   │   └── App.tsx         # User profile + edit
│   ├── vite.config.ts      # Module Federation - expose ./App
│   └── package.json
│
├── docs/                   # Szczegółowa dokumentacja (11 plików)
├── install-all.sh          # Instalacja wszystkich zależności
└── start-all.sh            # Uruchomienie wszystkich aplikacji
```

## Kluczowe wnioski końcowe

Microfrontendy **nie są silver bullet** – to architektoniczny trade-off odpowiedni dla konkretnych problemów organizacyjnych.

**Typowe zagrożenia:**

- distributed monolith (tight coupling przez shared state)
- performance overhead (network latency, duplikacja kodu)
- complexity explosion (infrastruktura, monitoring)
- premature optimization (MFE dla 3-osobowego zespołu)

**Skuteczne podejście:**

- jasne granice między domenami
- minimalna komunikacja (loose coupling)
- stabilne kontrakty (API, events, DS)
- monitoring i observability
- gradual adoption (zacznij od 1-2 MFE)

**Złota zasada:**

> **"Start with a well-architected monolith. Extract MFE when organizational pain is high enough."**

Microfrontendy rozwiązują problemy **organizacyjne** (skalowanie zespołów, autonomia), nie techniczne. Jeśli nie masz problemów organizacyjnych, prawdopodobnie nie potrzebujesz microfrontendów.

## Rozbudowa

- **Nowy MFE:** skopiuj strukturę `mfe-products`, zmień port, nazwę w `vite.config.ts`, dodaj do `host/vite.config.ts` remotes, dodaj route w `router.tsx`.
- **Nowy komponent DS:** dodaj w `design-system/src/components/`, eksportuj w `vite.config.ts` exposes, użyj w MFE przez `import { Component } from 'designSystem/Component'`.
- **Komunikacja między MFE:** wybierz wzorzec (props, events, shared state, URL) zależnie od use case'u; dokumentuj kontrakt.
- **Production deployment:** zbuduj wszystkie aplikacje (`npm run build`), deploy na CDN/S3, zmień remotes URLs na produkcyjne w `vite.config.ts`.
