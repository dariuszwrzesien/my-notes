# 🚀 Szybki Start

## Wymagania

- Node.js (v16 lub wyższy)
- npm (lub yarn)

## Instalacja i uruchomienie

### Sposób 1: Automatyczny (wszystko jednocześnie)

Jeśli masz zainstalowany `concurrently`:

```bash
# W głównym katalogu websocket/
npm install -g concurrently

# Instalacja zależności
cd backend && npm install && cd ../frontend && npm install && cd ..

# Uruchomienie (oba serwery naraz)
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

### Sposób 2: Ręczny (2 terminale)

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run dev
```

Powinno się wyświetlić:

```
🚀 Serwer WebSocket nasłuchuje na ws://localhost:8080
📝 Czekam na połączenia od klientów...
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Powinno się wyświetlić:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Testowanie

1. Otwórz przeglądarkę: `http://localhost:5173`
2. Otwórz **drugą kartę** z tym samym adresem
3. Napisz wiadomość w jednej karcie
4. Zobacz jak pojawia się w drugiej! 🎉

## Debugowanie

### Backend nie startuje

**Problem:** `Error: listen EADDRINUSE: address already in use :::8080`

**Rozwiązanie:** Port 8080 jest zajęty. Albo:

- Zabij proces na porcie 8080: `lsof -ti:8080 | xargs kill`
- Zmień port w `backend/server.js` (np. na 8081)

### Frontend nie łączy się

**Problem:** `WebSocket connection failed`

**Rozwiązanie:**

1. Sprawdź czy backend działa (`ws://localhost:8080`)
2. Sprawdź konsolę przeglądarki (F12)
3. Upewnij się że używasz `ws://` (nie `wss://`) dla localhost

### Strict Mode - podwójne połączenia

**Problem:** W konsoli widzisz podwójne logi w trybie dev

**Rozwiązanie:** To normalne! React 18 Strict Mode montuje komponenty 2x w dev.
W produkcji (build) wszystko będzie działać normalnie.

## Przydatne komendy

```bash
# Backend
cd backend
npm run dev          # Uruchom serwer
node server.js       # Alternatywa

# Frontend
cd frontend
npm run dev          # Dev server (HMR)
npm run build        # Production build
npm run preview      # Preview buildu

# Sprawdzanie portów
lsof -i :8080        # Sprawdź co działa na 8080
lsof -i :5173        # Sprawdź co działa na 5173
```

## Co dalej?

Po uruchomieniu aplikacji:

1. **Czytaj komentarze w kodzie** - są bardzo szczegółowe!
2. **Sprawdź konsolę** (F12) - znajdziesz tam logi z każdej akcji
3. **Eksperymentuj** - zmień coś w kodzie i zobacz efekt
4. **Przeczytaj README.md** - pełna dokumentacja z wyjaśnieniami

## Częste pytania (FAQ)

**Q: Czy mogę użyć tego w produkcji?**
A: Nie! To aplikacja edukacyjna. Brakuje: autoryzacji, walidacji, error handlingu, skalowania, etc.

**Q: Dlaczego nie socket.io?**
A: socket.io to świetna biblioteka, ale ukrywa detale. Ta aplikacja pokazuje czysty WebSocket API.

**Q: Czy działa na Windows?**
A: Tak! Node.js i WebSocket są cross-platform.

**Q: Jak dodać autoryzację?**
A: Przeczytaj sekcję "Co dalej?" w README.md

## Pomoc

Jeśli coś nie działa:

1. Sprawdź konsolę (backend i frontend)
2. Upewnij się że porty 8080 i 5173 są wolne
3. Zaktualizuj Node.js do najnowszej wersji
4. Usuń `node_modules` i zainstaluj ponownie

---

**Miłej nauki! 🎓**
