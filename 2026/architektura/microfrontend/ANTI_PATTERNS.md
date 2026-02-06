# Microfrontend Anti-Patterns - Czego unikać

## 🚫 Anti-Pattern #1: Distributed Monolith

### Symptomy

```typescript
// ❌ Wszystkie MFE importują shared store
import { globalState } from "@company/shared-state";

// ❌ Każdy MFE zna o wszystkich innych
if (productsData && cartData && checkoutData) {
  // tight coupling!
}

// ❌ Shared business logic wszędzie
import { calculatePrice } from "@company/shared-utils";
```

### Dlaczego to źle?

- Każda zmiana wpływa na wszystkich
- Nie można deployować niezależnie
- Wszystkie minusy monolitu + wszystkie minusy microfrontendów

### Jak to naprawić?

```typescript
// ✅ Każdy MFE ma własny stan
const useProductsState = create((set) => ({ ... }));

// ✅ Komunikacja przez well-defined API
window.dispatchEvent(new CustomEvent('product:selected', {
  detail: { productId }
}));

// ✅ Duplikuj prosty kod jeśli trzeba
// Lepiej duplikować niż tworzyć dependency
```

### Zasada:

> **Prefer duplication over wrong abstraction**

Jeśli 2 MFE potrzebują tej samej funkcji:

- Prosty helper (< 10 linii)? → Zduplikuj
- Złożona logika? → Shared package OK
- UI komponent? → Design System

## 🚫 Anti-Pattern #2: Shared State Hell

### Symptomy

```typescript
// ❌ Globalny store dla wszystkiego
const useGlobalStore = create((set) => ({
  user: null,
  products: [],
  cart: [],
  orders: [],
  preferences: {},
  theme: 'light',
  // ... 50 więcej pól
}));

// ❌ MFE mutation global state
// Products MFE:
globalStore.setState({ products: [...] });

// Profile MFE:
globalStore.setState({ user: { ...user, name: 'New' } });
// 💥 Race condition! Lost update!
```

### Dlaczego to źle?

- Niemożliwy do debugowania
- Race conditions
- Memory leaks
- Trudne testowanie
- Nie wiadomo kto co zmienia

### Jak to naprawić?

```typescript
// ✅ Każdy MFE ma własny stan
// Products MFE
const useProductsStore = create((set) => ({
  products: [],
  filters: {},
}));

// Profile MFE
const useProfileStore = create((set) => ({
  user: null,
  editing: false,
}));

// ✅ Tylko rzeczywiście shared state w shared store
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Zasada:

> **Local by default, global by exception**

Co może być shared:

- ✅ Authentication
- ✅ User preferences (theme, language)
- ✅ Feature flags
- ❌ Business data (products, orders)
- ❌ UI state (modals, forms)

## 🚫 Anti-Pattern #3: Chatty Communication

### Symptomy

```typescript
// ❌ MFE komunikują się non-stop
useEffect(() => {
  // Products → Cart
  window.dispatchEvent(new CustomEvent('product:hover', { ... }));
}, [hoveredProduct]);

useEffect(() => {
  // Cart → Products
  window.dispatchEvent(new CustomEvent('cart:render', { ... }));
}, [cart]);

useEffect(() => {
  // Products → Analytics
  window.dispatchEvent(new CustomEvent('product:viewed', { ... }));
}, []);

// 💥 Event soup! 50 events/second
```

### Dlaczego to źle?

- Performance hit
- Trudny debugging ("who triggered this?")
- Event order bugs
- Memory leaks (forgotten listeners)

### Jak to naprawić?

```typescript
// ✅ Komunikuj tylko significant events
window.dispatchEvent(
  new CustomEvent("cart:updated", {
    detail: { itemsCount: cart.length }, // tylko count, nie cały array!
  }),
);

// ✅ Debounce gdzie możliwe
const debouncedUpdate = useMemo(
  () =>
    debounce((data) => {
      window.dispatchEvent(new CustomEvent("search:changed", { detail: data }));
    }, 300),
  [],
);

// ✅ Use URL dla navigation zamiast events
navigate(`/checkout?productId=${id}`);
// NIE: window.dispatchEvent(new CustomEvent('navigate:checkout', ...))
```

### Zasada:

> **Communicate intent, not implementation**

- ❌ 'products:loading', 'products:loaded', 'products:rendered'
- ✅ 'products:changed'

## 🚫 Anti-Pattern #4: Premature Microfrontendization

### Symptomy

```typescript
// ❌ Mikro-MFE dla wszystkiego
Header MFE
Footer MFE
Button MFE (WTF?)
Logo MFE
Copyright MFE

// 💥 10 MFE dla aplikacji obsługiwanej przez 3 osoby
```

### Dlaczego to źle?

- Overhead większy niż korzyści
- Complexity explosion
- DX nightmare
- Każdy MFE = osobny bundle, build, deploy

### Jak to naprawić?

```typescript
// ✅ Rozsądna granularność
Host (Header, Footer, Layout)
Products MFE (cała sekcja produktów)
Checkout MFE (cały flow checkout)
Profile MFE (cały profil)
Admin MFE (cały admin panel)

// Reguła: 1 MFE = 1 domain / 1 team
```

### Zasada:

> **Start with modular monolith, extract MFE when needed**

Kiedy ekstraktować:

- ✅ Osobny zespół
- ✅ Inny release cycle
- ✅ Różne tech requirements
- ❌ "Bo tak"
- ❌ "Bo modular"

## 🚫 Anti-Pattern #5: Design System as Bottleneck

### Symptomy

```typescript
// ❌ Design System zawiera business logic
<Button onClick={handleCheckout}>
  // Button wie o checkout?!
</Button>

// ❌ Każda zmiana wymaga approval 5 teams
// Request: "Dodaj prop 'loading' do Button"
// Response: "Meeting scheduled 2 weeks from now"

// ❌ Breaking changes co tydzień
// v1.0.0: <Button color="primary" />
// v2.0.0: <Button variant="primary" />
// v3.0.0: <Button type="primary" />
// 💥 Zespoły nie nadążają
```

### Dlaczego to źle?

- Blokuje productivity
- Frustracja zespołów
- Shadow implementations (każdy robi swój Button)
- Chaos wizualny

### Jak to naprawić?

```typescript
// ✅ Design System = UI primitives only
<Button>  // generic, zero business logic
<Card>
<Input>

// ✅ Business components w MFE
// Products MFE:
<AddToCartButton product={product}>
  <Button variant="primary">
    Add to cart
  </Button>
</AddToCartButton>

// ✅ Composition over configuration
<Button {...commonProps}>
  {loading ? <Spinner /> : 'Submit'}
</Button>

// NIE:
<Button loading={loading} spinner={<Custom />} spinnerPosition="left" />
```

### Zasada:

> **Design System provides tools, not solutions**

DS powinien:

- ✅ Dostarczać building blocks
- ✅ Być stabilny (mało breaking changes)
- ✅ Być flexible
- ❌ Rozwiązywać business problems
- ❌ Wiedzieć o domenach biznesowych

## 🚫 Anti-Pattern #6: Invisible Dependencies

### Symptomy

```typescript
// ❌ MFE zakłada że window.analytics istnieje
function trackEvent(name: string) {
  window.analytics.track(name); // 💥 Crash jeśli nie ma
}

// ❌ MFE zakłada że user jest zalogowany
const user = window.currentUser; // 💥 undefined
user.name; // 💥 crash

// ❌ MFE zakłada że inny MFE już załadował CSS
// 💥 Broken styles jeśli Products nie załadował się pierwszy
```

### Dlaczego to źle?

- Silent failures
- Trudny debugging
- Flaky behavior (działa/nie działa randomly)
- Niemożliwe testowanie w izolacji

### Jak to naprawić?

```typescript
// ✅ Explicit dependencies
interface ProductsProps {
  analytics: AnalyticsService;
  user: User;
}

export const Products: FC<ProductsProps> = ({ analytics, user }) => {
  // Dependencies przekazane explicite
};

// ✅ Defensive checks
const user = window.currentUser;
if (!user) {
  return <NotAuthenticatedView />;
}

// ✅ Graceful degradation
try {
  window.analytics?.track(eventName);
} catch (e) {
  console.warn('Analytics not available:', e);
  // App działa dalej
}
```

### Zasada:

> **Explicit is better than implicit**

## 🚫 Anti-Pattern #7: Giant remoteEntry.js

### Symptomy

```typescript
// ❌ Eksportujemy wszystko
exposes: {
  './ProductList': './src/components/ProductList',
  './ProductCard': './src/components/ProductCard',
  './ProductImage': './src/components/ProductImage',
  './ProductPrice': './src/components/ProductPrice',
  './ProductTitle': './src/components/ProductTitle',
  // ... 50 więcej komponentów
}

// 💥 remoteEntry.js ma 500kb!
```

### Dlaczego to źle?

- Slow initial load
- Wszystko ładowane nawet jeśli nieużywane
- Maintenance nightmare

### Jak to naprawić?

```typescript
// ✅ Eksportuj tylko top-level entry points
exposes: {
  './App': './src/App',  // To wszystko!
}

// Wewnątrz App możesz mieć 100 komponentów
// Ale z zewnątrz widoczny tylko App

// ✅ Jeśli naprawdę trzeba więcej entry points:
exposes: {
  './ProductsApp': './src/App',
  './ProductWidget': './src/widgets/ProductWidget',  // dla embeds
}
// Ale trzymaj to minimum!
```

### Zasada:

> **Expose APIs, not internals**

## 🚫 Anti-Pattern #8: CSS Chaos

### Symptomy

```css
/* ❌ Products MFE */
.button {
  color: blue;
}

/* ❌ Profile MFE */
.button {
  color: red;
}

/* 💥 Conflict! Który wygra? Depends on load order! */
```

```typescript
// ❌ Global CSS imports w każdym MFE
import "./global.css"; // resets, base styles
// 💥 Multiple resets = broken styles
```

### Dlaczego to źle?

- Style conflicts
- Unpredictable styling
- !important hell
- Broken UI randomly

### Jak to naprawić?

```typescript
// ✅ CSS Modules
import styles from './ProductCard.module.css';
<div className={styles.card}>  // .ProductCard_card__x7d9s

// ✅ CSS-in-JS (emotion, styled-components)
const Card = styled.div`
  padding: 16px;
`;

// ✅ Scoped styles
<div className="mfe-products-card">  // prefix

// ✅ Shadow DOM (advanced)
class ProductCard extends HTMLElement {
  constructor() {
    this.attachShadow({ mode: 'open' });
    // Fully isolated styles!
  }
}
```

### Zasada:

> **Scope everything, assume nothing**

CSS strategy:

- Global (Design System): CSS Variables only
- MFE: CSS Modules or CSS-in-JS
- Components: Scoped

## 📋 Checklist: Czy twój MFE jest zdrowy?

### ✅ Independence

- [ ] MFE może być deployed niezależnie
- [ ] MFE ma własne testy
- [ ] MFE działa standalone (ma index.html)
- [ ] MFE nie zna o innych MFE

### ✅ Communication

- [ ] < 5 event types do/z MFE
- [ ] Events są documented
- [ ] Events mają TypeScript types
- [ ] Brak shared mutable state

### ✅ Dependencies

- [ ] Shared dependencies w sync (ta sama wersja React)
- [ ] Explicit props/dependencies
- [ ] Graceful degradation jeśli dependency missing

### ✅ Performance

- [ ] remoteEntry.js < 100kb
- [ ] Code splitting wewnątrz MFE
- [ ] Lazy loading gdzie możliwe
- [ ] No memory leaks (event listeners cleaned up)

### ✅ Development

- [ ] DX jest OK (< 5 sekund do HMR)
- [ ] Clear error messages
- [ ] Easy to debug
- [ ] Dokumentacja

## 🎯 Podsumowanie

Najważniejsza zasada:

> **Microfrontends powinny być jako niezależne systemy, nie jako rozproszony monolit**

Jeśli musisz:

- Deployować wszystkie MFE razem
- Znać implementację innych MFE
- Synchronizować zmiany między MFE

...to nie masz microfrontendów, masz distributed monolith.

**I to jest gorsze niż zwykły monolit.**
