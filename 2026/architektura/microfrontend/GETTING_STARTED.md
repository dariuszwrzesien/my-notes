# Microfrontend Architecture - Edukacyjny projekt

Kompletny, działający przykład architektury microfrontendowej z współdzielonym Design Systemem.

## 🎯 Co znajdziesz w tym projekcie?

- **Design System** - współdzielone komponenty UI i design tokens
- **Host Application** - shell z routingiem i lazy loading
- **2 Microfrontendy** - Products i Profile
- **Module Federation** - dynamiczne ładowanie w runtime
- **TypeScript** - pełne typowanie
- **Dokumentacja** - szczegółowe wyjaśnienia w kodzie

## 📚 Struktura

Zobacz `README.md` dla pełnej dokumentacji.

## 🚀 Quick Start

```bash
# 1. Instalacja
chmod +x install-all.sh
./install-all.sh

# 2. Uruchomienie (4 terminale)
# Terminal 1
cd design-system && npm run dev

# Terminal 2
cd mfe-products && npm run dev

# Terminal 3
cd mfe-profile && npm run dev

# Terminal 4
cd host && npm run dev

# 3. Otwórz przeglądarkę
open http://localhost:5000
```

## 🎓 Edukacja

Ten projekt jest stworzony do nauki. Każdy plik zawiera:

- Komentarze wyjaśniające "dlaczego"
- Przykłady użycia
- Best practices
- Ostrzeżenia o pułapkach

Zacznij od przeczytania `README.md`!
