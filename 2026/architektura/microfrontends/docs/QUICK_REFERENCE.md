# 📋 Quick Reference Card

Szybkie przypomnienie najważniejszych konceptów i komend.

---

## 🚀 Start projektu (3 minuty)

```bash
# 1. Instalacja (tylko raz)
./install-all.sh

# 2. Uruchomienie - OPCJA A: Automatyczne (REKOMENDOWANE)
./start-all.sh
# Wszystkie 4 aplikacje w jednym terminalu!

# 2. Uruchomienie - OPCJA B: Tryb preview (production)
./start-preview.sh
# Build + preview wszystkich aplikacji

# 2. Uruchomienie - OPCJA C: Ręczne (4 terminale)
# Terminal 1: cd design-system && npm run dev
# Terminal 2: cd mfe-products && npm run dev
# Terminal 3: cd mfe-profile && npm run dev
# Terminal 4: cd host && npm run dev

# 3. Otwórz: http://localhost:5000
```

---

## 🎯 Porty aplikacji

| Aplikacja     | Port | URL                   |
| ------------- | ---- | --------------------- |
| Host          | 5000 | http://localhost:5000 |
| Design System | 5001 | http://localhost:5001 |
| Products MFE  | 5002 | http://localhost:5002 |
| Profile MFE   | 5003 | http://localhost:5003 |

---

## 📁 Kluczowe pliki

### Design System

```
design-system/
├── vite.config.ts         # exposes: Button, Card, tokens
├── src/components/
│   ├── Button.tsx         # Główny komponent UI
│   └── Card.tsx           # Container komponent
└── src/tokens/index.ts    # Colors, spacing, typography
```

### Host

```
host/
├── vite.config.ts         # remotes: DS, Products, Profile
├── src/
│   ├── App.tsx            # Main app + layout
│   ├── router.tsx         # React Router + lazy loading
│   └── types/remotes.d.ts # TypeScript types dla remotes
```

### Products MFE

```
mfe-products/
├── vite.config.ts         # exposes: App, imports: DS
├── src/
│   ├── App.tsx            # Product list + cart
│   └── types/remotes.d.ts # DS types
```

### Profile MFE

```
mfe-profile/
├── vite.config.ts         # exposes: App, imports: DS
├── src/
│   ├── App.tsx            # User profile + edit
│   └── types/remotes.d.ts # DS types
```

---

## ⚙️ Module Federation Config

### Expose (remote)

```typescript
// Design System, Products, Profile
exposes: {
  './Button': './src/components/Button',
  './App': './src/App',
}
```

### Consume (host)

```typescript
// Host
remotes: {
  designSystem: 'http://localhost:5001/assets/remoteEntry.js',
  products: 'http://localhost:5002/assets/remoteEntry.js',
}
```

### Shared deps

```typescript
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true }
}
```

---

## 🔍 Debugging

### Network tab

```
Szukaj: remoteEntry.js
Sprawdź: Status 200? Size OK? Timing?
```

### Console

```javascript
// W przeglądarce
console.log(window.__FEDERATION__);
console.log(React.version); // Powinna być "18.2.0"
```

### TypeScript errors

```
Sprawdź: src/types/remotes.d.ts
Restart: TS server w VSCode
```

---

## 🎨 Design System - Użycie

### Button

```typescript
import { Button } from 'designSystem/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// Variants: primary, secondary, outline, ghost
// Sizes: sm, md, lg
```

### Card

```typescript
import { Card } from 'designSystem/Card';

<Card title="Title" padding="md" shadow={true}>
  Content here
</Card>
```

### Tokens

```typescript
import { colors, spacing } from 'designSystem/tokens';

<div style={{
  color: colors.primary,
  padding: spacing.md
}}>
  Text
</div>
```

---

## 📡 Komunikacja między MFE

### 1. URL (najlepsze) ⭐

```typescript
navigate("/checkout?productId=123");
```

### 2. Props

```typescript
<Products userId={user.id} />
```

### 3. Custom Events

```typescript
// Emit
window.dispatchEvent(
  new CustomEvent("cart:updated", {
    detail: { count: 5 },
  }),
);

// Listen
useEffect(() => {
  const handler = (e) => console.log(e.detail);
  window.addEventListener("cart:updated", handler);
  return () => window.removeEventListener("cart:updated", handler);
}, []);
```

---

## 🐛 Typowe problemy

### "React is not defined"

```typescript
// Fix: Sprawdź singleton w vite.config.ts
shared: {
  react: {
    singleton: true;
  }
}
```

### "Failed to fetch remote entry"

```bash
# Fix: Sprawdź czy remote działa
curl http://localhost:5002/assets/remoteEntry.js
```

### Hot reload nie działa w Host

```
To normalne! Refresh browser ręcznie.
Lub testuj MFE standalone (port 5002/5003).
```

### Port zajęty

```bash
lsof -ti:5000  # Znajdź PID
kill -9 <PID>  # Zabij proces
```

---

## 📚 Dokumentacja (11 plików)

| Plik                      | Temat               |
| ------------------------- | ------------------- |
| README.md                 | Główna dokumentacja |
| SUCCESS.md                | Co dalej?           |
| PROJECT_OVERVIEW.md       | Wizualny przegląd   |
| GETTING_STARTED.md        | Quick start         |
| ARCHITECTURE_DEEP_DIVE.md | Jak to działa       |
| DIAGRAMS.md               | Diagramy            |
| VERSIONING_STRATEGY.md    | Wersjonowanie DS    |
| ANTI_PATTERNS.md          | Czego unikać        |
| TESTING_GUIDE.md          | Testing & debug     |
| REAL_WORLD_CASES.md       | Case studies        |
| FAQ.md                    | 23 pytania          |

---

## ⚡ Szybkie komendy

```bash
# Instalacja wszystkiego
./install-all.sh

# Start wszystkiego (wymaga concurrently)
./start-all.sh

# Build produkcyjny
cd design-system && npm run build
cd ../mfe-products && npm run build
cd ../mfe-profile && npm run build
cd ../host && npm run build

# Clean (usuń node_modules)
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Count lines of code
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l
```

---

## 🎓 Checklist nauki

- [ ] Uruchomiłem projekt
- [ ] Przeczytałem README.md
- [ ] Zrozumiałem Module Federation
- [ ] Przejrzałem kod (vite.config.ts)
- [ ] Zmieniłem coś w Design System
- [ ] Przeczytałem ANTI_PATTERNS.md
- [ ] Wiem kiedy NIE używać MFE
- [ ] Zrozumiałem trade-offs

---

## 🎯 Kiedy używać MFE?

### ✅ TAK

- Duża organizacja (> 5 teams)
- Niezależne deploymenty needed
- Różne lifecycles
- Clear boundaries

### ❌ NIE

- Mały zespół (< 5 osób)
- Prosta aplikacja
- Tight coupling
- "Bo modne"

---

## 💡 Złote zasady

1. **Local by default, global by exception** (state)
2. **Prefer duplication over wrong abstraction**
3. **Communicate intent, not implementation** (events)
4. **Explicit is better than implicit** (dependencies)
5. **Start with monolith, extract when needed**

---

## 🔗 Przydatne linki

- [Module Federation](https://module-federation.github.io/)
- [Micro Frontends](https://micro-frontends.org/)
- [Vite Plugin](https://github.com/originjs/vite-plugin-federation)
- [Examples](https://github.com/module-federation/module-federation-examples)

---

## 📞 Gdzie szukać pomocy

1. Dokumentacja projektu (11 MD)
2. FAQ.md (23 pytania)
3. TESTING_GUIDE.md (debugging)
4. Google: "Module Federation [problem]"
5. Stack Overflow (tag: module-federation)

---

<div align="center">

**Ten plik to cheat sheet. Printuj/bookmarkuj!** 📌

Więcej info → `README.md`

</div>
