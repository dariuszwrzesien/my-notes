# 📊 Diagram relacji - Microfrontend Architecture

## Architektura systemu

```
┌────────────────────────────────────────────────────────────────────┐
│                        BROWSER (localhost:5000)                     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │                    HOST APPLICATION                        │    │
│  │                      (Port 5000)                          │    │
│  │                                                            │    │
│  │  ┌─────────────────────────────────────────────────┐     │    │
│  │  │         Navigation & Layout                     │     │    │
│  │  │  • Routing (React Router)                      │     │    │
│  │  │  • Error Boundaries                            │     │    │
│  │  │  • Loading States                              │     │    │
│  │  └─────────────────────────────────────────────────┘     │    │
│  │                                                            │    │
│  │  ┌──────────────────┐      ┌──────────────────┐         │    │
│  │  │   Products MFE   │      │   Profile MFE    │         │    │
│  │  │   Lazy Loaded    │      │   Lazy Loaded    │         │    │
│  │  │                  │      │                  │         │    │
│  │  │  • Product List  │      │  • User Info     │         │    │
│  │  │  • Cart State    │      │  • Edit Mode     │         │    │
│  │  │  • Filters       │      │  • Preferences   │         │    │
│  │  └──────────────────┘      └──────────────────┘         │    │
│  │          │                          │                     │    │
│  └──────────┼──────────────────────────┼────────────────────┘    │
│             │                          │                          │
│             └────────────┬─────────────┘                          │
│                          │                                        │
│                          ▼                                        │
│             ┌────────────────────────┐                           │
│             │   Design System (DS)   │                           │
│             │     (Port 5001)        │                           │
│             │                        │                           │
│             │  • Button              │                           │
│             │  • Card                │                           │
│             │  • Tokens (colors,     │                           │
│             │    spacing, etc.)      │                           │
│             │  • ThemeProvider       │                           │
│             └────────────────────────┘                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════

REMOTE SERVERS (Development)

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Design System      │  │  Products MFE       │  │  Profile MFE        │
│  localhost:5001     │  │  localhost:5002     │  │  localhost:5003     │
│                     │  │                     │  │                     │
│  remoteEntry.js     │  │  remoteEntry.js     │  │  remoteEntry.js     │
│  ├─ Button          │  │  ├─ App (Products)  │  │  ├─ App (Profile)   │
│  ├─ Card            │  │  └─ (imports DS)    │  │  └─ (imports DS)    │
│  ├─ tokens          │  │                     │  │                     │
│  └─ ThemeProvider   │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

## Module Federation - Dependency Graph

```
HOST (Port 5000)
  │
  ├─── imports ────→ Design System (Port 5001)
  │                      │
  │                      ├─ Button
  │                      ├─ Card
  │                      ├─ tokens
  │                      └─ ThemeProvider
  │
  ├─── lazy loads ──→ Products MFE (Port 5002)
  │                      │
  │                      └─── imports ────→ Design System
  │                                            │
  │                                            ├─ Button
  │                                            ├─ Card
  │                                            └─ tokens
  │
  └─── lazy loads ──→ Profile MFE (Port 5003)
                         │
                         └─── imports ────→ Design System
                                               │
                                               ├─ Button
                                               ├─ Card
                                               └─ tokens
```

## Shared Dependencies (React)

```
┌─────────────────────────────────────────────────────┐
│                React (Singleton)                    │
│                                                     │
│  Loaded once, shared by:                           │
│  • Host                                            │
│  • Products MFE                                    │
│  • Profile MFE                                     │
│  • Design System                                   │
│                                                     │
│  Version: ^18.2.0 (enforced by Module Federation) │
└─────────────────────────────────────────────────────┘
```

## Communication Flow

```
┌────────────────────────────────────────────────────────┐
│                    HOST                                │
│                                                        │
│  User clicks "Products" in navigation                 │
│         │                                              │
│         ▼                                              │
│  React Router: navigate('/products')                  │
│         │                                              │
│         ▼                                              │
│  Lazy load: import('products/App')                    │
│         │                                              │
│         ├──────────────────────┐                      │
│         ▼                      ▼                       │
│  Show <Loading />      Fetch remoteEntry.js           │
│                         from port 5002                 │
│                              │                         │
│         ┌────────────────────┘                        │
│         ▼                                              │
│  Products MFE loaded                                  │
│         │                                              │
│         ▼                                              │
│  Products imports Button from DS                      │
│         │                                              │
│         ▼                                              │
│  Fetch DS remoteEntry.js from port 5001              │
│         │                                              │
│         ▼                                              │
│  Render Products with DS components                   │
│         │                                              │
│         ▼                                              │
│  ✅ User sees Products page                           │
└────────────────────────────────────────────────────────┘
```

## Data Flow - Communication Patterns

```
┌─────────────────────────────────────────────────────────┐
│  Pattern 1: Props (Top-down)                           │
│                                                         │
│  HOST                                                  │
│    │                                                    │
│    ├─ props: { userId: "123" } ──→ Products MFE       │
│    │                                                    │
│    └─ props: { onUpdate: fn } ────→ Profile MFE       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Pattern 2: Custom Events (Bottom-up)                  │
│                                                         │
│  Products MFE                                          │
│    │                                                    │
│    └─ window.dispatchEvent('cart:updated')            │
│                 │                                       │
│                 ▼                                       │
│              HOST                                      │
│                 │                                       │
│                 └─ window.addEventListener(...)        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Pattern 3: Shared State (Zustand/Redux)              │
│                                                         │
│            ┌─ Shared Store ─┐                         │
│            │  • user         │                         │
│            │  • cart         │                         │
│            └─────────────────┘                         │
│                 │       │                               │
│        ┌────────┘       └────────┐                    │
│        ▼                         ▼                     │
│  Products MFE              Profile MFE                 │
│  useCartStore()           useUserStore()               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Pattern 4: URL/Router (Recommended)                   │
│                                                         │
│  Products MFE                                          │
│    │                                                    │
│    └─ navigate('/checkout?productId=123')             │
│                 │                                       │
│                 ▼                                       │
│           React Router                                 │
│                 │                                       │
│                 ▼                                       │
│          Checkout MFE                                  │
│            │                                            │
│            └─ useParams() → { productId: "123" }      │
└─────────────────────────────────────────────────────────┘
```

## Design System - Distribution Strategy

```
┌────────────────────────────────────────────────────────────────┐
│           DESIGN SYSTEM DISTRIBUTION                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Option A: Module Federation (Used in this demo)              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                       │    │
│  │   DS (Port 5001) ──remoteEntry.js──→ Consumers      │    │
│  │                                                       │    │
│  │   + Runtime sharing (always latest)                  │    │
│  │   + No rebuild needed for consumers                  │    │
│  │   - Runtime dependency                               │    │
│  │   - Weaker type safety                               │    │
│  │                                                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  Option B: NPM Package                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                       │    │
│  │   @company/design-system@2.0.0 → npm install        │    │
│  │                                                       │    │
│  │   + Build-time dependency                            │    │
│  │   + Full type safety                                 │    │
│  │   - Requires rebuild for updates                     │    │
│  │   - Version conflicts possible                       │    │
│  │                                                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  Option C: Hybrid (Enterprise)                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                       │    │
│  │   NPM for types + Module Federation for runtime      │    │
│  │                                                       │    │
│  │   devDependencies: @company/ds (types only)          │    │
│  │   remotes: CDN URL (runtime)                         │    │
│  │                                                       │    │
│  │   + Best of both worlds                              │    │
│  │   - More complex setup                               │    │
│  │                                                       │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

## Production Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                  PRODUCTION SETUP                           │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │              CDN / Cloud Storage                  │     │
│  │                                                   │     │
│  │  /design-system/2.0.0/remoteEntry.js             │     │
│  │  /products/1.5.2/remoteEntry.js                  │     │
│  │  /profile/1.3.0/remoteEntry.js                   │     │
│  │                                                   │     │
│  └──────────────────────────────────────────────────┘     │
│                          ▲                                  │
│                          │                                  │
│         ┌────────────────┴──────────────┐                 │
│         │                                │                 │
│  ┌──────┴────────┐              ┌───────┴────────┐       │
│  │  CI/CD        │              │  Host App      │       │
│  │  Pipeline     │              │  app.com       │       │
│  │               │              │                │       │
│  │  1. Build     │              │  Imports:      │       │
│  │  2. Test      │              │  - DS v2.0.0   │       │
│  │  3. Deploy    │              │  - Products    │       │
│  │  4. Invalidate│              │  - Profile     │       │
│  │     cache     │              │                │       │
│  └───────────────┘              └────────────────┘       │
│                                                            │
│  Independent deployments:                                 │
│  • DS team deploys DS without touching MFE               │
│  • Products team deploys Products without Host rebuild    │
│  • Profile team deploys Profile independently            │
└─────────────────────────────────────────────────────────────┘
```

## Timeline - User Navigation Flow

```
Time →  0ms      100ms     200ms     300ms     400ms     500ms
        │         │         │         │         │         │
User    │         │         │         │         │         │
Action  │ Click   │         │         │         │         │
        │"Products│         │         │         │         │
        │  "      │         │         │         │         │
        ▼         ▼         ▼         ▼         ▼         ▼
        ├─────────┼─────────┼─────────┼─────────┼─────────┤
Host    │ Router  │ Show    │         │         │         │
        │ change  │ Loading │         │         │         │
        │         │         │         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┤
Network │         │ Fetch   │ Receive │ Fetch   │ Receive │
        │         │ Products│ Products│ DS      │ DS      │
        │         │ remote  │ remote  │ remote  │ remote  │
        │         │         │         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┤
Render  │         │         │ Parse   │ Parse   │ Render  │
        │         │         │ Products│ DS      │ Complete│
        │         │         │         │         │ ✅      │
        │         │         │         │         │         │
```

## Checklist - Co musi być stabilne vs co może się zmieniać

```
┌──────────────────────────────────────────────────────────┐
│  ✅ STABLE (Contract - nie zmieniaj często)             │
├──────────────────────────────────────────────────────────┤
│  • Design System API (props komponentów)                │
│  • Event names i payloads (cart:updated, user:logout)   │
│  • Shared TypeScript interfaces                         │
│  • URL structure (routing)                              │
│  • MFE entry points (exposes)                           │
│  • Shared dependency versions (React, etc.)             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  🔄 FLEXIBLE (Implementation - zmienia się często)      │
├──────────────────────────────────────────────────────────┤
│  • Wewnętrzna logika MFE                                │
│  • Style (jeśli nie breaking)                           │
│  • Optymalizacje performance                            │
│  • Bug fixes                                            │
│  • Nowe featury (additive)                              │
└──────────────────────────────────────────────────────────┘
```

---

**Legend:**

- `───→` : Import/dependency
- `┌─┐` : Boundary/container
- `▼` : Data/control flow direction
- `✅` : Success/completion state
