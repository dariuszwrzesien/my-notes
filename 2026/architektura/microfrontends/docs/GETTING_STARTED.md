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

### Opcja 1: Automatyczne uruchomienie (REKOMENDOWANE)

```bash
# 1. Instalacja zależności
chmod +x install-all.sh
./install-all.sh

# 2. Uruchomienie wszystkich aplikacji (development mode)
chmod +x start-all.sh
./start-all.sh

# 3. Otwórz przeglądarkę
open http://localhost:5000
```

### Opcja 2: Tryb preview (production build)

```bash
# 1. Instalacja zależności
chmod +x install-all.sh
./install-all.sh

# 2. Build i uruchomienie w trybie preview
chmod +x start-preview.sh
./start-preview.sh

# 3. Otwórz przeglądarkę
open http://localhost:5000
```

### Opcja 3: Ręczne uruchomienie (4 terminale)

```bash
# Terminal 1 - Design System
cd design-system && npm run dev

# Terminal 2 - Products MFE
cd mfe-products && npm run dev

# Terminal 3 - Profile MFE
cd mfe-profile && npm run dev

# Terminal 4 - Host Application
cd host && npm run dev
```

Porty:

- 🎨 Design System: http://localhost:5001
- 🛍️ Products MFE: http://localhost:5002
- 👤 Profile MFE: http://localhost:5003
- 🏠 Host (główna aplikacja): http://localhost:5000

## 🎓 Edukacja

Ten projekt jest stworzony do nauki. Każdy plik zawiera:

- Komentarze wyjaśniające "dlaczego"
- Przykłady użycia
- Best practices
- Ostrzeżenia o pułapkach

Zacznij od przeczytania `README.md`!
