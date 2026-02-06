# 📖 INDEX - Mapa projektu

Witaj w projekcie Microfrontend Demo! Ten plik pomoże Ci znaleźć to, czego szukasz.

---

## 🎯 Gdzie zacząć?

### Jeśli nigdy nie pracowałeś z microfrontendami:

1. **[README.md](./README.md)** ← Start tutaj! (15-20 min)
2. **[SUCCESS.md](./SUCCESS.md)** ← Co dalej? (5 min)
3. **Uruchom projekt** ← Zobacz jak działa
4. **[ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md)** ← Jak to działa (30 min)

### Jeśli znasz podstawy:

1. **[ANTI_PATTERNS.md](./ANTI_PATTERNS.md)** ← Czego unikać (20 min)
2. **[VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md)** ← Wersjonowanie (15 min)
3. **[REAL_WORLD_CASES.md](./REAL_WORLD_CASES.md)** ← Case studies (30 min)

### Jeśli coś nie działa:

1. **[FAQ.md](./FAQ.md)** ← 23 pytania i odpowiedzi (20 min)
2. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** ← Debugging (20 min)
3. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ← Cheat sheet (5 min)

---

## 📚 Dokumentacja (12 plików)

### 🚀 Start & Basics

| Plik                                             | Opis                                         | Czas   | Priorytet |
| ------------------------------------------------ | -------------------------------------------- | ------ | --------- |
| **[README.md](./README.md)**                     | Główna dokumentacja, architektura, pros/cons | 20 min | ⭐⭐⭐    |
| **[SUCCESS.md](./SUCCESS.md)**                   | Co zostało utworzone, następne kroki         | 5 min  | ⭐⭐⭐    |
| **[GETTING_STARTED.md](./GETTING_STARTED.md)**   | Quick start, instalacja                      | 5 min  | ⭐⭐⭐    |
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | Wizualny przegląd (ASCII art)                | 10 min | ⭐⭐      |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**   | Cheat sheet, quick commands                  | 5 min  | ⭐⭐      |

### 🏗️ Architecture & Deep Dive

| Plik                                                         | Opis                                       | Czas   | Priorytet |
| ------------------------------------------------------------ | ------------------------------------------ | ------ | --------- |
| **[ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md)** | Jak Module Federation działa krok po kroku | 30 min | ⭐⭐⭐    |
| **[DIAGRAMS.md](./DIAGRAMS.md)**                             | Diagramy ASCII (flow, timeline, structure) | 15 min | ⭐⭐      |

### 📦 Design System & Versioning

| Plik                                                   | Opis                                | Czas   | Priorytet |
| ------------------------------------------------------ | ----------------------------------- | ------ | --------- |
| **[VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md)** | SemVer, deprecation path, migration | 15 min | ⭐⭐⭐    |

### ⚠️ Best Practices & Pitfalls

| Plik                                       | Opis                          | Czas   | Priorytet |
| ------------------------------------------ | ----------------------------- | ------ | --------- |
| **[ANTI_PATTERNS.md](./ANTI_PATTERNS.md)** | 8 anti-patterns z przykładami | 20 min | ⭐⭐⭐    |

### 🧪 Testing & Debugging

| Plik                                       | Opis                                | Czas   | Priorytet |
| ------------------------------------------ | ----------------------------------- | ------ | --------- |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | Testowanie, debugging, eksperymenty | 20 min | ⭐⭐      |

### 💼 Real World

| Plik                                             | Opis                                       | Czas   | Priorytet |
| ------------------------------------------------ | ------------------------------------------ | ------ | --------- |
| **[REAL_WORLD_CASES.md](./REAL_WORLD_CASES.md)** | 4 case studies (e-commerce, banking, etc.) | 30 min | ⭐⭐⭐    |

### ❓ Q&A

| Plik                   | Opis                   | Czas   | Priorytet |
| ---------------------- | ---------------------- | ------ | --------- |
| **[FAQ.md](./FAQ.md)** | 23 najczęstsze pytania | 20 min | ⭐⭐      |

### 📊 Summary

| Plik                                       | Opis                              | Czas   | Priorytet |
| ------------------------------------------ | --------------------------------- | ------ | --------- |
| **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** | Podsumowanie projektu, statystyki | 10 min | ⭐        |

**Total:** ~3-4 godziny czytania

---

## 💻 Kod (20 plików TS/TSX)

### Design System (Port 5001)

```
design-system/
├── vite.config.ts              # Module Federation config (expose)
├── src/
│   ├── components/
│   │   ├── Button.tsx          # Button component (4 variants)
│   │   └── Card.tsx            # Card container
│   ├── tokens/index.ts         # Design tokens (colors, spacing, etc.)
│   ├── theme/ThemeProvider.tsx # Theme context (light/dark)
│   └── main.tsx                # Entry point (standalone preview)
```

### Host Application (Port 5000)

```
host/
├── vite.config.ts              # MF config (consume DS, Products, Profile)
├── src/
│   ├── App.tsx                 # Main app + layout + footer
│   ├── router.tsx              # React Router + lazy loading + ErrorBoundary
│   ├── components/
│   │   └── Navigation.tsx      # Nav bar with routing
│   ├── types/remotes.d.ts      # TypeScript types for remotes
│   └── main.tsx                # Entry point
```

### Products MFE (Port 5002)

```
mfe-products/
├── vite.config.ts              # MF config (expose App, consume DS)
├── src/
│   ├── App.tsx                 # Product list + cart + filters
│   ├── types/remotes.d.ts      # DS types
│   └── main.tsx                # Entry point (standalone)
```

### Profile MFE (Port 5003)

```
mfe-profile/
├── vite.config.ts              # MF config (expose App, consume DS)
├── src/
│   ├── App.tsx                 # User profile + edit mode + prefs
│   ├── types/remotes.d.ts      # DS types
│   └── main.tsx                # Entry point (standalone)
```

---

## 🔍 Szukasz czegoś konkretnego?

### Jak uruchomić projekt?

→ [GETTING_STARTED.md](./GETTING_STARTED.md)  
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) (sekcja "Start projektu")

### Jak działa Module Federation?

→ [ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md) (sekcja "Krok po kroku")  
→ [DIAGRAMS.md](./DIAGRAMS.md) (sekcja "Module Federation Flow")

### Jak komunikować między MFE?

→ [README.md](./README.md) (sekcja "Komunikacja między MFE")  
→ [ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md) (sekcja "Komunikacja")  
→ [FAQ.md](./FAQ.md) (pytanie #10)

### Jak wersjonować Design System?

→ [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md)  
→ [README.md](./README.md) (sekcja "Design System - Współdzielenie")

### Czego unikać?

→ [ANTI_PATTERNS.md](./ANTI_PATTERNS.md) (8 anti-patterns)  
→ [README.md](./README.md) (sekcja "Typowe pułapki")

### Kiedy używać MFE?

→ [README.md](./README.md) (sekcje "Plusy" i "Minusy")  
→ [FAQ.md](./FAQ.md) (pytanie #9, #12)  
→ [REAL_WORLD_CASES.md](./REAL_WORLD_CASES.md) (sekcja "Lessons Learned")

### Jak debugować?

→ [TESTING_GUIDE.md](./TESTING_GUIDE.md) (sekcja "Debugging")  
→ [FAQ.md](./FAQ.md) (pytanie #16)  
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) (sekcja "Debugging")

### Realne przykłady?

→ [REAL_WORLD_CASES.md](./REAL_WORLD_CASES.md) (4 case studies)

### Jak deployować na production?

→ [FAQ.md](./FAQ.md) (pytanie #18)  
→ [README.md](./README.md) (sekcja "Production deployment")

### Jak dodać trzeci MFE?

→ [FAQ.md](./FAQ.md) (pytanie #17)  
→ [TESTING_GUIDE.md](./TESTING_GUIDE.md) (eksperymenty)

### NPM package vs Module Federation dla DS?

→ [README.md](./README.md) (sekcja "Design System - Współdzielenie")  
→ [ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md)  
→ [FAQ.md](./FAQ.md) (pytanie #11)

---

## 🎓 Ścieżki nauki

### Ścieżka 1: Fast Track (2-3 godziny)

```
1. README.md (20 min)
2. Uruchom projekt (10 min)
3. Kliknij po UI (10 min)
4. QUICK_REFERENCE.md (5 min)
5. ARCHITECTURE_DEEP_DIVE.md (30 min)
6. FAQ.md - przejrzyj pytania (15 min)
```

✅ Po tej ścieżce: Rozumiesz podstawy

### Ścieżka 2: Complete (8-10 godzin)

```
1. README.md (20 min)
2. SUCCESS.md (5 min)
3. Uruchom projekt (10 min)
4. GETTING_STARTED.md (5 min)
5. ARCHITECTURE_DEEP_DIVE.md (30 min)
6. DIAGRAMS.md (15 min)
7. Przejrzyj kod (60 min)
8. TESTING_GUIDE.md + eksperymenty (60 min)
9. ANTI_PATTERNS.md (20 min)
10. VERSIONING_STRATEGY.md (15 min)
11. REAL_WORLD_CASES.md (30 min)
12. FAQ.md (20 min)
13. Dodaj trzeci MFE (120 min)
```

✅ Po tej ścieżce: Expert level

### Ścieżka 3: Production Ready (1-2 tygodnie)

```
Ścieżka 2 + dodatkowo:
- Dodaj testy (Vitest, Playwright)
- Zbuduj production build
- Deploy na Vercel/Netlify
- Dodaj monitoring (Sentry)
- Performance optimization
- Security hardening
```

✅ Po tej ścieżce: Gotowy do produkcji

---

## 🎯 Wyszukiwanie po tematach

### Architektura

- [README.md](./README.md) - Podstawy
- [ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md) - Szczegóły
- [DIAGRAMS.md](./DIAGRAMS.md) - Wizualizacje
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Przegląd

### Module Federation

- [ARCHITECTURE_DEEP_DIVE.md](./ARCHITECTURE_DEEP_DIVE.md) - Jak działa
- [FAQ.md](./FAQ.md) - Q&A
- Kod: `vite.config.ts` (wszystkie 4 aplikacje)

### Design System

- [README.md](./README.md) - Strategia
- [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md) - Wersjonowanie
- [ANTI_PATTERNS.md](./ANTI_PATTERNS.md) - Anti-pattern #5
- Kod: `design-system/` folder

### Best Practices

- [ANTI_PATTERNS.md](./ANTI_PATTERNS.md) - Czego unikać
- [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md) - Wersjonowanie
- [REAL_WORLD_CASES.md](./REAL_WORLD_CASES.md) - Lessons learned

### Testing & Debugging

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Kompletny guide
- [FAQ.md](./FAQ.md) - Typowe problemy
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick fixes

### Real World

- [REAL_WORLD_CASES.md](./REAL_WORLD_CASES.md) - 4 case studies
- [README.md](./README.md) - Realne use-case'y

---

## 📞 Potrzebujesz pomocy?

1. **Sprawdź FAQ** → [FAQ.md](./FAQ.md) (23 pytania)
2. **Debug guide** → [TESTING_GUIDE.md](./TESTING_GUIDE.md)
3. **Cheat sheet** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. **Google:** "Module Federation [twój problem]"
5. **Przejrzyj kod** - każdy plik ma komentarze!

---

## 📊 Statystyki projektu

```
📁 Aplikacje:          4 (DS, Host, 2 MFE)
📝 Dokumentacja:       12 plików MD
💻 Kod TypeScript:     20 plików
⏱️  Czas czytania:     ~3-4 godziny
🎓 Czas nauki:         ~8-16 godzin
📦 Dependencies:       React 18, Vite 5, TypeScript 5
```

---

<div align="center">

# 🗺️ Mapa gotowa!

**Rozpocznij od:** [README.md](./README.md)

**Problemy?** [FAQ.md](./FAQ.md) lub [TESTING_GUIDE.md](./TESTING_GUIDE.md)

**Quick help?** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

**Happy learning!** 🚀

</div>
