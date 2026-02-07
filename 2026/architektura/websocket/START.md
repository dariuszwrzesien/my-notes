# 🎯 Start w 3 krokach

## Sposób 1: Używając skryptu (najszybszy)

```bash
# 1. Zainstaluj zależności
./setup.sh install

# 2. W TERMINALU 1: Uruchom backend
./setup.sh backend

# 3. W TERMINALU 2: Uruchom frontend
./setup.sh frontend
```

Gotowe! Otwórz http://localhost:5173

---

## Sposób 2: Ręcznie

### Terminal 1 - Backend:

```bash
cd backend
npm install
npm run dev
```

Zobaczysz:

```
🚀 Serwer WebSocket nasłuchuje na ws://localhost:8080
📝 Czekam na połączenia od klientów...
```

### Terminal 2 - Frontend:

```bash
cd frontend
npm install
npm run dev
```

Zobaczysz:

```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Otwórz http://localhost:5173 w przeglądarce.

---

## Pierwsze kroki po uruchomieniu

1. **Otwórz 2 karty** przeglądarki z http://localhost:5173
2. **Napisz wiadomość** w jednej karcie
3. **Zobacz jak pojawia się** w drugiej! 🎉

---

## Co dalej?

📚 **Przeczytaj dokumentację:**

- `INDEX.md` - spis treści
- `README.md` - teoria WebSocket
- `LEARNING_PATH.md` - scenariusz krok po kroku

💻 **Eksploruj kod:**

- `backend/server.js` - serwer (bogato skomentowany!)
- `frontend/src/hooks/useWebSocket.js` - cała logika WS
- `frontend/src/App.jsx` - interfejs UI

🔍 **Debuguj:**

- Otwórz DevTools (F12)
- Network → WS filter
- Console → zobacz logi

---

## Troubleshooting

### "Port 8080 already in use"

```bash
# Zabij proces na porcie 8080
lsof -ti:8080 | xargs kill
```

### "WebSocket connection failed"

- Sprawdź czy backend działa
- Sprawdź console na błędy
- Zobacz `BLEDY.md`

### Inne problemy?

Przeczytaj: `BLEDY.md` (17 błędów + rozwiązania)

---

**Miłej zabawy! 🚀**

Pytania? Sprawdź dokumentację w `INDEX.md`
