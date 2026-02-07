# 🗂️ Struktura Projektu

```
📦 websocket/
│
├── 📚 DOKUMENTACJA (10 plików)
│   ├── 📄 START.md              ⚡ Szybki start (2 min)
│   ├── 📄 INDEX.md              📑 Spis treści + quick ref
│   ├── 📄 README.md             📖 Główna dokumentacja (teoria)
│   ├── 📄 QUICK_START.md        🚀 Szczegółowa instrukcja
│   ├── 📄 DIAGRAM.md            📊 9 wizualizacji flow
│   ├── 📄 LEARNING_PATH.md      🎓 Scenariusz krok po kroku
│   ├── 📄 POROWNANIE.md         ⚖️  WebSocket vs alternatywy
│   ├── 📄 BLEDY.md              🐛 17 błędów + rozwiązania
│   ├── 📄 STATYSTYKI.md         📈 Statystyki projektu
│   └── 📄 PODSUMOWANIE.md       ✅ Podsumowanie
│
├── 🔧 NARZĘDZIA
│   ├── 📜 setup.sh              🤖 Skrypt pomocniczy
│   └── 📋 .cursorrules          ⚙️  Zasady projektu
│
├── 🖥️ BACKEND (Node.js + ws)
│   └── backend/
│       ├── 📦 package.json      Zależności: ws@^8.16.0
│       ├── ⭐ server.js          ~230 linii (50% komentarze)
│       └── 🚫 .gitignore
│
└── 🎨 FRONTEND (React + Vite)
    └── frontend/
        ├── 📦 package.json      Zależności: react, react-dom
        ├── 🌐 index.html        HTML entry point
        ├── ⚙️  vite.config.js   Konfiguracja Vite
        ├── 🚫 .gitignore
        └── 📁 src/
            ├── 🚪 main.jsx      ~30 linii (entry point)
            ├── ⭐ App.jsx       ~180 linii (UI component)
            ├── 🎨 App.css       ~400 linii (dark theme)
            └── 📁 hooks/
                └── ⭐ useWebSocket.js  ~220 linii (cała logika WS!)
```

---

## 📊 Wizualizacja przepływu nauki

```
        START
          │
          ▼
    ┌──────────┐
    │ START.md │  ⚡ 2 min
    └─────┬────┘
          │
          ▼
  ┌───────────────┐
  │ Uruchom app   │
  │ (setup.sh)    │
  └───────┬───────┘
          │
          ▼
    ┌──────────┐
    │INDEX.md  │  📑 10 min
    └─────┬────┘
          │
    ┌─────┴──────┐
    │            │
    ▼            ▼
┌──────────┐  ┌──────────┐
│README.md │  │DIAGRAM.md│
│ 30 min   │  │ 20 min   │
└─────┬────┘  └────┬─────┘
      │            │
      └─────┬──────┘
            │
            ▼
    ┌────────────────┐
    │LEARNING_PATH.md│  🎓 2-3h
    │  + eksperymenty│
    └───────┬────────┘
            │
            ▼
    ┌───────────────┐
    │ POROWNANIE.md │  ⚖️ 20 min
    └───────┬───────┘
            │
            ▼
      ┌──────────┐
      │ BLEDY.md │  🐛 reference
      └──────────┘
            │
            ▼
        MASTER! 🏆
```

---

## 🎯 Kluczowe pliki do przeczytania

### Must Read ⭐ (w kolejności):

1. **START.md** (2 min)
   - Jak uruchomić w 3 krokach

2. **backend/server.js** (30 min)

   ```javascript
   // ~230 linii, 50% komentarze
   // Pokazuje:
   // - Jak stworzyć serwer WebSocket
   // - Obsługa connection, message, close, error
   // - Broadcast do wszystkich klientów
   ```

3. **frontend/src/hooks/useWebSocket.js** (30 min)

   ```javascript
   // ~220 linii, 50% komentarze
   // Pokazuje:
   // - useRef vs useState (KLUCZOWE!)
   // - Lifecycle (onopen, onmessage, onclose, onerror)
   // - Cleanup i memory leak prevention
   ```

4. **frontend/src/App.jsx** (20 min)
   ```javascript
   // ~180 linii, 30% komentarze
   // Pokazuje:
   // - Separation of concerns (UI vs logika)
   // - Controlled components
   // - Status indicator
   ```

### Optional (ale warte przeczytania):

5. **DIAGRAM.md** - wizualizacje przepływu
6. **LEARNING_PATH.md** - zadania praktyczne
7. **POROWNANIE.md** - kontekst (WebSocket vs inne)

---

## 📁 Co w którym katalogu?

### `/` (root)

Dokumentacja markdown + skrypt setup.sh

### `/backend`

```
server.js       ← Cała logika serwera (1 plik!)
package.json    ← Zależności: tylko "ws"
.gitignore      ← node_modules
```

### `/frontend`

```
index.html      ← HTML entry
vite.config.js  ← Config (bardzo prosty)
package.json    ← Zależności: react, react-dom, vite
src/
  ├── main.jsx           ← ReactDOM.render
  ├── App.jsx            ← UI komponent
  ├── App.css            ← Style (dark theme)
  └── hooks/
      └── useWebSocket.js ← Cała logika WebSocket!
```

---

## 🔄 Data flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │   Backend   │         │   Browser   │
│  (Client A) │         │   Node.js   │         │  (Client B) │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  1. WebSocket         │                       │
       │     connect           │                       │
       ├──────────────────────►│                       │
       │                       │                       │
       │  2. WELCOME           │                       │
       │◄──────────────────────┤                       │
       │                       │                       │
       │  3. Send "Hello"      │                       │
       ├──────────────────────►│                       │
       │                       │                       │
       │                       │  4. Broadcast         │
       │◄──────────────────────┼──────────────────────►│
       │     "Hello"           │        "Hello"        │
       │                       │                       │
```

---

## 💾 Rozmiary plików

| Plik                             | Linie | Rozmiar |
| -------------------------------- | ----- | ------- |
| **backend/server.js**            | ~230  | ~13 KB  |
| **frontend/src/useWebSocket.js** | ~220  | ~12 KB  |
| **frontend/src/App.jsx**         | ~180  | ~10 KB  |
| **frontend/src/App.css**         | ~400  | ~12 KB  |
| **Dokumentacja (razem)**         | ~3000 | ~100 KB |

**Total:** ~1060 linii kodu + ~3000 linii dokumentacji

---

## 🎨 Technologie

### Backend

```
Node.js      ✅ (v16+)
ws           ✅ (pure WebSocket library)
```

### Frontend

```
React        ✅ (v18)
Vite         ✅ (dev server + bundler)
CSS          ✅ (vanilla, no preprocessor)
```

### Protokół

```
WebSocket    ✅ (ws://, not wss://)
JSON         ✅ (format wiadomości)
```

---

## 🚀 Quick Commands

```bash
# Setup
./setup.sh install

# Run (2 terminals)
./setup.sh backend    # Terminal 1
./setup.sh frontend   # Terminal 2

# Check
./setup.sh check      # Sprawdź Node.js, npm
./setup.sh ports      # Sprawdź porty 8080, 5173

# Clean
./setup.sh clean      # Usuń node_modules
```

---

## 📍 URLs

```
Frontend:  http://localhost:5173
Backend:   ws://localhost:8080
DevTools:  F12 → Network → WS
```

---

## 🎯 Dla niecierpliwych (TL;DR)

```bash
# 1. Zainstaluj
./setup.sh install

# 2. Terminal 1
./setup.sh backend

# 3. Terminal 2
./setup.sh frontend

# 4. Browser
open http://localhost:5173

# 5. Testuj
# Otwórz 2 karty, wyślij wiadomość!
```

**Done! 🎉**

---

**Zobacz [INDEX.md](./INDEX.md) dla pełnego spisu treści.**
