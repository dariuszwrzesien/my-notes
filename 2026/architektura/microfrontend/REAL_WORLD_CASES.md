# Real-World Use Cases - Case Studies

## 📚 Spis treści

1. [E-commerce Platform - Zalando Style](#case-1-e-commerce-platform)
2. [Banking Dashboard - Monzo Style](#case-2-banking-dashboard)
3. [SaaS Admin Panel - Enterprise](#case-3-saas-admin-panel)
4. [Content Management System](#case-4-content-management-system)
5. [Lessons Learned](#lessons-learned)

---

## Case 1: E-commerce Platform

### Context

- 200+ frontend developers
- 15 teams (Products, Checkout, User, Marketing, etc.)
- 5M+ monthly users
- Multiple countries, currencies, languages

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Shell (Host)                      │
│  • Authentication                                   │
│  • Navigation                                       │
│  • Global search                                    │
│  • Cart badge                                       │
└─────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │Products │    │Checkout  │    │Profile   │
    │Team     │    │Team      │    │Team      │
    └─────────┘    └──────────┘    └──────────┘
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Design System   │
              │  • Components    │
              │  • Tokens        │
              │  • Themes        │
              └──────────────────┘
```

### Tech Stack

- **Framework:** React 18
- **MFE:** Module Federation (Webpack)
- **DS:** NPM Package (Storybook)
- **State:** Zustand for shared state
- **Communication:** Custom events + URL routing

### Key Decisions

#### 1. Design System jako NPM Package (nie Module Federation)

**Dlaczego:**

- Stabilność > szybkość iteracji
- Breaking changes DS = chaos dla 15 teams
- Type safety krytyczna
- Easier versioning

**Workflow:**

```
DS change → Publish v2.3.0 → Teams update when ready
```

**Trade-off:**

- ✅ Stabilny kontrakt
- ✅ Kontrolowane updates
- ❌ Slower DS adoption

#### 2. Shared Cart State (Zustand)

```typescript
// @company/shared-state
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => { ... },
  removeItem: (id) => { ... },
  total: 0,
}));

// Used by:
// - Products MFE (add to cart)
// - Checkout MFE (display cart)
// - Shell (cart badge count)
```

**Dlaczego Zustand:**

- Lightweight (2KB)
- No provider hell
- DevTools support
- TypeScript friendly

#### 3. URL-first Communication

```typescript
// Products → Checkout
navigate(`/checkout?items=${JSON.stringify(cartItemIds)}`);

// Checkout
const { items } = useSearchParams();
const cartItems = JSON.parse(items);
```

**Dlaczego:**

- Deep links work
- SEO friendly
- Browser back/forward works
- No event spaghetti

### Challenges & Solutions

#### Challenge 1: Version Sprawl

**Problem:**

```
Products: DS v2.1.0
Checkout: DS v2.0.0
Profile:  DS v1.9.0
```

Different Button styles across app 😱

**Solution:**

```json
// peerDependencies enforcement
{
  "peerDependencies": {
    "@company/design-system": "^2.0.0"
  },
  "peerDependenciesMeta": {
    "@company/design-system": {
      "optional": false
    }
  }
}
```

CI fails if wrong version!

#### Challenge 2: 3rd Party Scripts Conflicts

**Problem:**
Multiple MFE loading same analytics script:

```javascript
// Products loads:
<script src="analytics.js"></script>

// Checkout loads:
<script src="analytics.js"></script>

// 💥 Loaded twice, events doubled!
```

**Solution:**

```typescript
// Shell loads once
const Analytics = {
  init: () => {
    if (window.analytics) return; // Already loaded
    // Load script...
  },
  track: (event) => window.analytics?.track(event),
};

// Expose globally
window.AppAnalytics = Analytics;

// MFE use:
window.AppAnalytics.track("product_viewed");
```

#### Challenge 3: Bundle Size Explosion

**Problem:**

- Initial bundle: 3.2MB 😱
- TTI: 5+ seconds

**Solution:**

1. **Route-based code splitting:**

   ```typescript
   // Before: All MFE loaded upfront
   // After: Lazy load per route
   const Products = lazy(() => import("products/App"));
   ```

2. **Shared dependencies:**

   ```typescript
   shared: ["react", "react-dom", "lodash", "date-fns"];
   ```

3. **Tree shaking:**

   ```typescript
   // Before:
   import _ from "lodash"; // 70KB!

   // After:
   import debounce from "lodash/debounce"; // 2KB
   ```

4. **Image optimization:**
   - Lazy load images
   - WebP format
   - CDN with resize

**Result:**

- Bundle: 800KB (↓ 75%)
- TTI: 1.8s (↓ 64%)

### Metrics (After 1 Year)

| Metric                 | Before MFE | After MFE | Change |
| ---------------------- | ---------- | --------- | ------ |
| Deploy frequency       | 1x/week    | 20x/week  | +1900% |
| Deploy time            | 45 min     | 8 min     | ↓ 82%  |
| Incidents              | 12/month   | 3/month   | ↓ 75%  |
| Developer satisfaction | 6/10       | 8.5/10    | +42%   |
| Time to market         | 6 weeks    | 2 weeks   | ↓ 67%  |

### Would They Do It Again?

**YES**, but with changes:

- Start with fewer MFE (3-4, not 15)
- Invest more in DS upfront
- Better monitoring from day 1
- More training for developers

---

## Case 2: Banking Dashboard

### Context

- 50 developers
- 8 teams (Accounts, Transfers, Investments, Loans, etc.)
- Strict compliance requirements
- High security standards

### Architecture

```
┌──────────────────────────────────────────┐
│          Secure Shell                    │
│  • SSO Authentication                    │
│  • Session management                    │
│  • Audit logging                         │
└──────────────────────────────────────────┘
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Accounts│ │Transfer│ │Invest  │
    │(React) │ │(React) │ │(Vue!)  │
    └────────┘ └────────┘ └────────┘
```

### Key Decisions

#### 1. Multi-framework (React + Vue)

**Dlaczego:**

- Investments team preferred Vue
- Acquisition of company using Vue
- Don't want to rewrite

**How:**

```typescript
// Shell (React)
const Investments = lazy(() => import("investments/App"));

// investments/App (Vue!)
import { createApp } from "vue";

export default {
  mount: (container) => {
    const app = createApp(InvestmentsApp);
    app.mount(container);
  },
  unmount: (container) => {
    // Cleanup
  },
};
```

**Trade-off:**

- ✅ Team autonomy
- ✅ No rewrite cost
- ❌ Bigger bundle (React + Vue)
- ❌ Harder to share components

#### 2. Compliance-first Architecture

```typescript
// Every MFE logs to audit service
interface AuditEvent {
  userId: string;
  action: string;
  timestamp: number;
  mfe: string;
}

// Shell provides:
window.AuditService = {
  log: (event: AuditEvent) => {
    // Send to backend
    // Regulatory requirement: immutable log
  },
};

// MFE use:
const handleTransfer = () => {
  window.AuditService.log({
    userId: user.id,
    action: "transfer_initiated",
    mfe: "transfers",
    timestamp: Date.now(),
  });
};
```

#### 3. Security Boundaries

```typescript
// Each MFE runs in iframe with restricted permissions
<iframe
  src="/mfe/accounts"
  sandbox="allow-scripts allow-same-origin"
  allow="payment"  // Only Transfers MFE can access payment API
/>
```

**Dlaczego:**

- Limit blast radius of security bugs
- Compliance requirement (PCI DSS)
- Clear security boundaries

### Challenges & Solutions

#### Challenge: Performance with iframes

**Problem:**

- Each MFE in iframe = separate context
- No shared memory
- Slow cross-iframe communication

**Solution:**

1. **Minimize communication:**

   ```typescript
   // Bad: Constant updates
   setInterval(() => sendToParent(state), 100);

   // Good: Only on significant events
   onTransferComplete(() => sendToParent({ success: true }));
   ```

2. **Use SharedWorker for state:**
   ```typescript
   // Shared state across iframes
   const worker = new SharedWorker("state-worker.js");
   ```

### Result

- ✅ Passed all compliance audits
- ✅ Zero cross-MFE security breaches
- ✅ 8 teams work independently
- ❌ Performance slower than SPA (acceptable trade-off)

---

## Case 3: SaaS Admin Panel

### Context

- 20 developers
- Growing fast (new features weekly)
- B2B customers demand customization
- White-labeling required

### Architecture

```
┌────────────────────────────────────────┐
│         Configurable Shell             │
│  • Customer theme (colors, logo)       │
│  • Feature flags per customer          │
│  • Custom navigation                   │
└────────────────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
   ┌────────┐ ┌──────┐ ┌─────────┐
   │Users   │ │Billing│ │Analytics│
   │MFE     │ │MFE    │ │MFE      │
   └────────┘ └──────┘ └─────────┘
```

### Key Decisions

#### 1. Feature Flags per Customer

```typescript
// config service
const features = await fetch('/api/features?customerId=123');
// { billing: true, analytics: false, users: true }

// Shell
{features.billing && (
  <Route path="/billing" element={<BillingMFE />} />
)}

// Hide nav items
<Navigation items={items.filter(i => features[i.id])} />
```

**Why:**

- Different pricing tiers
- Gradual rollout
- A/B testing

#### 2. Theme Injection

```typescript
// Customer theme from API
const theme = await fetch('/api/theme?customerId=123');
// { primaryColor: '#ff0000', logo: 'url...' }

// Inject CSS variables
document.documentElement.style.setProperty(
  '--primary-color',
  theme.primaryColor
);

// MFE use CSS variables
.button {
  background: var(--primary-color);
}
```

**Result:**

- White-labeling works
- No rebuild per customer
- Customers can customize via UI

---

## Case 4: Content Management System

### Context

- Plugins ecosystem
- 3rd party developers
- 100+ plugins available

### Architecture

```
┌────────────────────────────────────┐
│            CMS Core                │
│  • Content editor                  │
│  • Plugin registry                 │
│  • API for plugins                 │
└────────────────────────────────────┘
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
┌─────┐  ┌─────┐  ┌─────┐
│SEO  │  │Forms│  │Media│
│     │  │     │  │     │
└─────┘  └─────┘  └─────┘
 Plugin   Plugin   Plugin
```

### Key Decision: Plugin Sandbox

```typescript
// Plugins run in sandboxed environment
class PluginRuntime {
  load(pluginUrl: string) {
    const iframe = document.createElement("iframe");
    iframe.sandbox = "allow-scripts";
    iframe.src = pluginUrl;

    // Limited API
    iframe.contentWindow.CMS = {
      saveContent: (data) => this.api.save(data),
      // Only safe methods exposed
    };
  }
}
```

**Why:**

- Security (3rd party code)
- Version isolation
- Can't break core CMS

---

## Lessons Learned

### ✅ Do This

1. **Start small**
   - 2-3 MFE initially
   - Add more as teams grow

2. **Invest in observability**
   - Which MFE failed?
   - Which version is live?
   - Performance per MFE

3. **Design System first**
   - Before splitting MFE
   - Prevents visual inconsistency

4. **Clear ownership**
   - Each MFE = 1 team
   - No shared ownership

5. **Versioning strategy**
   - Semantic versioning
   - Deprecation policy
   - Migration guides

### ❌ Don't Do This

1. **Don't split too early**
   - Wait until teams > 5
   - Modular monolith first

2. **Don't ignore DX**
   - If devs hate it, it will fail
   - Local dev must be easy

3. **Don't over-communicate**
   - < 5 event types between MFE
   - Prefer URL routing

4. **Don't share business logic**
   - Duplicate simple code
   - Only share UI primitives

5. **Don't forget performance**
   - Monitor bundle sizes
   - Lazy load everything
   - Shared dependencies

### 🎯 Success Criteria

Your MFE architecture is successful if:

| Metric                  | Target            |
| ----------------------- | ----------------- |
| Deploy frequency        | > 1x/day per team |
| Deploy time             | < 10 min          |
| Incident blast radius   | 1 MFE (not all)   |
| Developer satisfaction  | > 8/10            |
| Time to onboard new dev | < 1 week          |
| Bundle size             | < 500KB initial   |
| TTI                     | < 2s              |

### 📚 Recommended Reading

1. **"Micro Frontends" by Michael Geers**
   - Comprehensive guide
   - Multiple approaches

2. **"Building Micro-Frontends" by Luca Mezzalira**
   - Enterprise patterns
   - Real case studies

3. **Martin Fowler's Blog**
   - "Micro Frontends" article
   - Patterns and anti-patterns

### 🔗 Communities

- [Micro-frontends Slack](https://microfrontends.slack.com)
- [Module Federation Discord](https://discord.gg/module-federation)
- [r/microfrontends](https://reddit.com/r/microfrontends)

---

## Podsumowanie

Microfrontendy nie są silver bullet. Działają dobrze gdy:

- ✅ Masz wiele zespołów (>5)
- ✅ Potrzebujesz niezależnych deploymentów
- ✅ Różne części mają różny lifecycle
- ✅ Masz dojrzałą organizację

Nie używaj gdy:

- ❌ Mały zespół (<5 osób)
- ❌ Prosta aplikacja
- ❌ Tight coupling między częściami
- ❌ Brak infra/DevOps support

**Złota zasada:**

> Start with a well-architected monolith. Extract MFE when organizational pain is high enough.
