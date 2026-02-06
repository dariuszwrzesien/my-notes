# 🏗️ Microfrontend Architecture - Educational Demo

Edukacyjny projekt demonstrujący architekturę microfrontendową z współdzielonym Design Systemem.

## 📊 Architektura systemu

```
┌─────────────────────────────────────────────────────┐
│                   HOST / SHELL                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         Routing & Navigation               │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────┐      ┌──────────────┐          │
│  │ MFE Products │      │ MFE Profile  │          │
│  │ (lazy load)  │      │ (lazy load)  │          │
│  └──────────────┘      └──────────────┘          │
└─────────────────────────────────────────────────────┘
           │                    │
           └────────┬───────────┘
                    │
           ┌────────▼────────┐
           │  Design System  │
           │                 │
           │ • Components    │
           │ • Tokens        │
           │ • Theme         │
           └─────────────────┘
```

## 📁 Struktura projektu

```
microfrontend-demo/
├── design-system/          # Współdzielony Design System
│   ├── src/
│   │   ├── components/     # UI Components (Button, Card)
│   │   ├── tokens/         # Design Tokens (colors, spacing)
│   │   └── theme/          # Theme Provider
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── host/                   # Shell Application
│   ├── src/
│   │   ├── App.tsx         # Główny komponent z routingiem
│   │   ├── router.tsx      # Konfiguracja routera
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── mfe-products/           # Microfrontend: Produkty
│   ├── src/
│   │   ├── App.tsx         # Widok listy produktów
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── mfe-profile/            # Microfrontend: Profil użytkownika
│   ├── src/
│   │   ├── App.tsx         # Widok profilu
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md               # Ten plik
```

## 🚀 Szybki start

### 1. Instalacja zależności

```bash
# W każdym katalogu uruchom:
cd design-system && npm install
cd ../host && npm install
cd ../mfe-products && npm install
cd ../mfe-profile && npm install
```

### 2. Uruchomienie aplikacji

**WAŻNE**: Kolejność uruchamiania ma znaczenie!

```bash
# Terminal 1 - Design System (port 5001)
cd design-system
npm run dev

# Terminal 2 - Products MFE (port 5002)
cd mfe-products
npm run dev

# Terminal 3 - Profile MFE (port 5003)
cd mfe-profile
npm run dev

# Terminal 4 - Host Application (port 5000)
cd host
npm run dev
```

### 3. Otwórz przeglądarkę

```
http://localhost:5000
```

## 🔧 Jak to działa?

### Module Federation (Vite)

Każda aplikacja używa **@originjs/vite-plugin-federation** do:

1. **Expose** - udostępniania swoich modułów
2. **Consume** - importowania zdalnych modułów

#### Design System (Remote)

```typescript
// vite.config.ts
export default {
  plugins: [
    federation({
      name: "design-system",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
        "./Card": "./src/components/Card",
        "./tokens": "./src/tokens",
        "./ThemeProvider": "./src/theme/ThemeProvider",
      },
    }),
  ],
};
```

#### MFE Products (Remote)

```typescript
federation({
  name: "products",
  exposes: {
    "./App": "./src/App", // Eksportuje całą aplikację
  },
  remotes: {
    designSystem: "http://localhost:5001/assets/remoteEntry.js",
  },
  shared: ["react", "react-dom"],
});
```

#### Host (Consumer)

```typescript
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

```typescript
// router.tsx
const Products = lazy(() => import('products/App'));
const Profile = lazy(() => import('profile/App'));

// Routing
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/products" element={<Products />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

## 🎨 Design System - Współdzielenie

### Opcja 1: Module Federation (użyta w tym projekcie)

**Plusy:**

- ✅ Runtime sharing - zawsze najnowsza wersja
- ✅ Nie wymaga rebuildu MFE przy zmianie DS
- ✅ Dynamiczne ładowanie

**Minusy:**

- ❌ Zależność runtime - DS musi działać
- ❌ Brak type-safety w czasie buildu
- ❌ Potencjalne problemy z wersjami React

### Opcja 2: NPM Package

**Plusy:**

- ✅ Build-time dependency
- ✅ Pełny TypeScript support
- ✅ Stabilność - wersje frozen

**Minusy:**

- ❌ Wymaga rebuild MFE przy update DS
- ❌ Różne wersje DS w różnych MFE
- ❌ Większy bundle size

### Kiedy co wybrać?

| Sytuacja             | Module Federation | NPM Package |
| -------------------- | ----------------- | ----------- |
| Szybkie iteracje DS  | ✅                | ❌          |
| Produkcja enterprise | ❌                | ✅          |
| Strict type safety   | ❌                | ✅          |
| Mała infrastruktura  | ❌                | ✅          |
| Wiele zespołów       | ✅                | ✅          |

## 🎯 Komunikacja między MFE

### 1. Props (używane w tym projekcie)

```typescript
// Host przekazuje props
<Products userId={currentUser.id} />
```

**Dobre dla:** prostych przypadków, dane z góry do dołu

### 2. Custom Events

```typescript
// MFE emituje event
window.dispatchEvent(
  new CustomEvent("cart:updated", {
    detail: { itemsCount: 3 },
  }),
);

// Host nasłuchuje
window.addEventListener("cart:updated", (e) => {
  console.log(e.detail);
});
```

**Dobre dla:** loose coupling, broadcasts

### 3. Shared State (np. Zustand)

```typescript
// Współdzielony store
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
}));
```

**Dobre dla:** złożony stan, synchronizacja

## ✅ Plusy Microfrontendów

### 1. **Niezależność zespołów**

- Każdy zespół ma własne repo, pipeline, release cycle
- Brak konfliktów w kodzie między zespołami
- Autonomia technologiczna

### 2. **Skalowanie organizacyjne**

- 10+ zespołów może pracować równolegle
- Onboarding nowych deweloperów prostszy (mniejszy codebase)

### 3. **Niezależne deploymenty**

- Zmiana w MFE Products nie wymaga rebuildu całej aplikacji
- Rollback jednego MFE bez wpływu na inne
- Canary releases per MFE

### 4. **Technologiczna różnorodność**

- Products może być w React 18
- Profile może być w Vue 3
- (choć w praktyce: unikaj tego!)

## ❌ Minusy Microfrontendów

### 1. **Złożoność infrastruktury**

- Więcej buildów, więcej deploymentów
- Monitoring rozproszonego systemu
- Zarządzanie wersjami dependencies

### 2. **Performance overhead**

- Duplikacja kodu (React ładowany wielokrotnie jeśli źle skonfigurowane)
- Network latency przy ładowaniu remotes
- Większy initial load time

### 3. **Trudniejszy debugging**

- Błędy mogą pochodzić z różnych źródeł
- Cross-MFE bugs ciężkie do śledzenia
- Problemy z wersjami bibliotek

### 4. **DX (Developer Experience)**

- Potrzeba uruchomienia wielu serwersów
- Hot reload nie zawsze działa między MFE
- TypeScript types dla remotes problematyczne

## ⚠️ Kiedy NIE używać Microfrontendów?

### 1. **Mały zespół (< 5 osób)**

- Overhead większy niż korzyści
- Modularny monolit wystarczy

### 2. **Niskie wymagania biznesowe**

- Prosta aplikacja CRUD
- Brak planów na skalowanie

### 3. **Brak autonomii zespołów**

- Wszyscy pracują razem nad tym samym
- Frequent cross-team collaboration needed

### 4. **Tight coupling między modułami**

- Jeśli produkty i koszyk są mocno powiązane
- Lepiej trzymać razem

### 5. **Silne wymagania performance**

- Każdy millisekund się liczy
- Nie stać Cię na overhead

## 🔥 Typowe pułapki

### 1. **"Distributed Monolith"**

```typescript
// ❌ ZŁE - wszystkie MFE dzielą się stanem
import { globalStore } from '@company/shared-store';

// ✅ DOBRE - każdy MFE ma własny stan
const useLocalStore = create(...);
```

### 2. **Shared dependencies hell**

```json
// ❌ ZŁE - różne wersje React
{
  "products": "react@18.2.0",
  "profile": "react@18.3.0" // KONFLIKT!
}
```

### 3. **Design System jako bottleneck**

```typescript
// ❌ ZŁE - breaking change w Button
<Button variant="primary" />  // zmieniono na `color="primary"`

// ✅ DOBRE - deprecation path
<Button variant="primary" />  // deprecated ale działa
<Button color="primary" />    // nowa wersja
```

### 4. **Brak kontraktu komunikacji**

```typescript
// ❌ ZŁE - niejawne eventy
window.dispatchEvent(new CustomEvent("update"));

// ✅ DOBRE - typed events
interface AppEvents {
  "cart:updated": { itemsCount: number };
  "user:logout": void;
}
```

## 📋 Checklist: Co musi być stabilne?

### ✅ **Stabilne (contract - nie zmieniaj często)**

- [ ] Interfejsy komunikacji (props, events)
- [ ] Design System API (nazwy props komponentów)
- [ ] Shared types
- [ ] Routing structure (URLs)
- [ ] Authentication flow

### 🔄 **Może się zmieniać (implementacja)**

- [ ] Wewnętrzna logika MFE
- [ ] Style (o ile nie breaking w DS)
- [ ] Optymalizacje performance
- [ ] Bug fixy

## 🏢 Realne use-case'y (anonimizowane)

### Case 1: E-commerce gigant (>50 MFE)

**Setup:**

- Host: nawigacja, autentykacja, checkout
- MFE: produkty, koszyk, user profile, admin panel, analytics
- DS: npm package + Storybook
- Komunikacja: shared Zustand store dla koszyka

**Wynik:**

- ✅ 20+ zespołów niezależnie
- ✅ 10x szybszy deployment
- ❌ Pierwszy rok: debugging hell
- ❌ Bundle size wzrósł o 30%

### Case 2: Banking platform (8 MFE)

**Setup:**

- Host: dashboard, nawigacja
- MFE: accounts, transfers, investments, loans
- DS: Module Federation
- Komunikacja: Custom events + Broadcast Channel API

**Wynik:**

- ✅ Compliance per MFE (audit)
- ✅ Security updates niezależnie
- ❌ Performance problemy (3s TTI)
- ❌ Overhead monitoringu

### Case 3: SaaS startup (próbował, wrócił do monolitu)

**Setup:**

- 3 osoby, 2 MFE
- Przedwczesna optymalizacja

**Wynik:**

- ❌ Overhead infrastruktury za duży
- ❌ DX katastrofalny
- ✅ Wrócili do modularnego monolitu
- ✅ Produktywność wzrosła 2x

## 🎓 Nauka

### Najpierw zrozum:

1. Uruchom wszystkie aplikacje
2. Zobacz jak ładują się zdalnie (DevTools → Network)
3. Zmień coś w Design System, odśwież Host (bez rebuildu!)
4. Zmień coś w MFE Products, zobacz jak się hot-reload'uje

### Eksperymenty:

1. Dodaj nowy komponent do DS
2. Stwórz trzeci MFE (np. Cart)
3. Dodaj komunikację między Products a Cart
4. Zaimplementuj shared authentication

## 📚 Dalsze kroki

1. **Dodaj testy**
   - Testing Library dla komponentów
   - E2E testy dla całości (Playwright)

2. **CI/CD**
   - Pipeline dla każdego projektu osobno
   - Deploy tylko zmienionego MFE

3. **Monitoring**
   - Sentry dla error tracking
   - Performance monitoring per MFE

4. **Zaawansowane wzorce**
   - Server-side routing
   - SSR dla MFE
   - Federated types

---

## 📖 Przydatne linki

- [Module Federation](https://module-federation.github.io/)
- [Micro Frontends](https://micro-frontends.org/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)

---

**Autor:** Senior Frontend Architect  
**Data:** 2026-02-06  
**Cel:** Edukacja, eksperymenty, zrozumienie konceptu
