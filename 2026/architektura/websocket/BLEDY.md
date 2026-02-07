# 🐛 Najczęstsze Błędy i Rozwiązania

## Frontend

### 1. ❌ "Failed to construct 'WebSocket': The URL is invalid"

**Objaw:**

```
Uncaught DOMException: Failed to construct 'WebSocket': The URL 'localhost:8080' is invalid.
```

**Przyczyna:**
Brak protokołu `ws://` lub `wss://`

**Rozwiązanie:**

```javascript
// ❌ ŹLE
const ws = new WebSocket("localhost:8080");

// ✅ DOBRZE
const ws = new WebSocket("ws://localhost:8080");
```

---

### 2. ❌ "WebSocket connection failed" / Error 404

**Objaw:**

```
WebSocket connection to 'ws://localhost:8080' failed
```

**Przyczyny:**

- Backend nie działa
- Zły port
- Firewall blokuje

**Rozwiązanie:**

```bash
# Sprawdź czy backend działa
lsof -i :8080

# Uruchom backend
cd backend && npm run dev

# Sprawdź w przeglądarce Network tab (WS filter)
```

---

### 3. ❌ "Failed to execute 'send' on 'WebSocket': Still in CONNECTING state"

**Objaw:**

```javascript
ws.send("Hello"); // Error!
```

**Przyczyna:**
Próba wysłania przed nawiązaniem połączenia

**Rozwiązanie:**

```javascript
// ❌ ŹLE
const ws = new WebSocket("ws://localhost:8080");
ws.send("Hello"); // Za szybko!

// ✅ DOBRZE
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => {
  ws.send("Hello"); // Czekamy na połączenie
};

// ✅ LUB sprawdź readyState
if (ws.readyState === WebSocket.OPEN) {
  ws.send("Hello");
}
```

---

### 4. ❌ Memory leak - połączenie nie zamknięte

**Objaw:**

- Komponenty unmountowane, ale połączenie aktywne
- Backend pokazuje więcej klientów niż faktycznie otwartych kart
- Nowe połączenie przy każdym re-renderze

**Przyczyna:**
Brak cleanup w useEffect

**Rozwiązanie:**

```javascript
// ❌ ŹLE
useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");
  // Brak cleanup!
}, []);

// ✅ DOBRZE
useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");

  return () => {
    ws.close(); // ZAWSZE zamykaj!
  };
}, []);
```

---

### 5. ❌ WebSocket w useState powoduje re-rendery

**Objaw:**

- Niepotrzebne re-rendery
- Trudne debugowanie
- Problemy z referencjami

**Przyczyna:**
WebSocket to mutable object, nie powinien być w state

**Rozwiązanie:**

```javascript
// ❌ ŹLE
const [ws, setWs] = useState(null);

// ✅ DOBRZE
const wsRef = useRef(null);
```

---

### 6. ❌ JSON.parse() bez try-catch

**Objaw:**

```
Uncaught SyntaxError: Unexpected token in JSON
```

**Przyczyna:**
Serwer wysłał nie-JSON lub błędny JSON

**Rozwiązanie:**

```javascript
// ❌ ŹLE
ws.onmessage = (event) => {
  const data = JSON.parse(event.data); // Może crashować!
};

// ✅ DOBRZE
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    // Przetwórz dane
  } catch (error) {
    console.error("Błąd parsowania:", error);
  }
};
```

---

### 7. ❌ Mutowanie state zamiast tworzenia nowego

**Objaw:**

- UI się nie aktualizuje
- Wiadomości nie pojawiają się

**Przyczyna:**
React nie wykrywa zmian w mutowanym obiekcie

**Rozwiązanie:**

```javascript
// ❌ ŹLE
setMessages(messages.push(newMessage)); // Mutuje + zwraca length!

// ❌ RÓWNIEŻ ŹLE
messages.push(newMessage);
setMessages(messages); // React nie wykryje zmiany

// ✅ DOBRZE
setMessages((prev) => [...prev, newMessage]); // Nowa tablica
```

---

### 8. ❌ React Strict Mode - podwójne połączenia w dev

**Objaw:**
W trybie dev widzisz 2 połączenia i 2x logi

**Przyczyna:**
React 18 Strict Mode montuje komponenty 2x w dev (wykrywa side-effects)

**Rozwiązanie:**

```javascript
// To jest NORMALNE w dev!
// W produkcji będzie tylko 1x

// Jeśli bardzo przeszkadza w dev, możesz wyłączyć:
// main.jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>  // Zakomentuj (tylko w dev!)
  <App />,
  // </React.StrictMode>
);
```

---

## Backend

### 9. ❌ "Error: listen EADDRINUSE: address already in use :::8080"

**Objaw:**
Backend nie startuje

**Przyczyna:**
Port 8080 już zajęty

**Rozwiązanie:**

```bash
# Opcja 1: Zabij proces na porcie
lsof -ti:8080 | xargs kill

# Opcja 2: Zmień port w server.js
const PORT = 8081; // Inny port
```

---

### 10. ❌ Crash przy wysyłaniu do zamkniętego połączenia

**Objaw:**

```
Error: WebSocket is not open: readyState 3 (CLOSED)
```

**Przyczyna:**
Próba wysłania do klienta który się rozłączył

**Rozwiązanie:**

```javascript
// ❌ ŹLE
wss.clients.forEach((client) => {
  client.send(data); // Może być zamknięty!
});

// ✅ DOBRZE
wss.clients.forEach((client) => {
  if (client.readyState === client.OPEN) {
    client.send(data);
  }
});
```

---

### 11. ❌ Brak obsługi błędów - serwer crashuje

**Objaw:**
Jeden błędny klient zabija cały serwer

**Przyczyna:**
Brak error handlera

**Rozwiązanie:**

```javascript
// ❌ ŹLE
wss.on("connection", (ws) => {
  // Brak error handling
});

// ✅ DOBRZE
wss.on("connection", (ws) => {
  ws.on("error", (error) => {
    console.error("Błąd WebSocket:", error);
    // Serwer dalej działa!
  });
});
```

---

### 12. ❌ Broadcast wysyła do nadawcy

**Objaw:**
Użytkownik widzi swoją wiadomość 2x

**Przyczyna:**
Broadcast do WSZYSTKICH (włącznie z nadawcą)

**Rozwiązanie:**

```javascript
// Jeśli chcesz wysłać do wszystkich OPRÓCZ nadawcy:
wss.clients.forEach((client) => {
  if (client !== ws && client.readyState === client.OPEN) {
    client.send(data);
  }
});
```

---

### 13. ❌ JSON.parse() bez try-catch (backend)

**Objaw:**
Serwer crashuje przy błędnym JSON od klienta

**Przyczyna:**
Brak walidacji danych

**Rozwiązanie:**

```javascript
// ❌ ŹLE
ws.on("message", (data) => {
  const message = JSON.parse(data); // Może crashować!
});

// ✅ DOBRZE
ws.on("message", (data) => {
  try {
    const message = JSON.parse(data.toString());
    // Przetwórz
  } catch (error) {
    console.error("Błędny JSON od klienta:", error);
    ws.send(JSON.stringify({ type: "ERROR", payload: "Invalid JSON" }));
  }
});
```

---

## Ogólne

### 14. ❌ Mixed content (http + wss)

**Objaw:**

```
Mixed Content: The page at 'https://example.com' was loaded over HTTPS,
but attempted to connect to the insecure WebSocket endpoint 'ws://...'
```

**Przyczyna:**
HTTPS page próbuje połączyć się przez ws:// (nieszyfrowany)

**Rozwiązanie:**

```javascript
// ❌ ŹLE
const ws = new WebSocket("ws://server.com"); // HTTP + WS = OK
// HTTPS + WS = ERROR!

// ✅ DOBRZE
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const ws = new WebSocket(`${protocol}//server.com`);
```

---

### 15. ❌ CORS błędy z WebSocket

**Objaw:**
Połączenie odrzucone przez CORS

**Przyczyna:**
WebSocket NIE UŻYWA CORS! (to nie HTTP)

**Rozwiązanie:**
Jeśli widzisz "CORS error" z WebSocket:

1. To prawdopodobnie inny problem (sprawdź URL, port)
2. WebSocket ma własny mechanizm origin checking
3. Możesz sprawdzić origin na serwerze:

```javascript
wss.on("connection", (ws, req) => {
  const origin = req.headers.origin;
  if (origin !== "http://localhost:5173") {
    ws.close(1008, "Origin not allowed");
    return;
  }
  // Kontynuuj
});
```

---

### 16. ❌ Firewall/Proxy blokuje WebSocket

**Objaw:**
Działa lokalnie, nie działa w produkcji

**Przyczyna:**
Niektóre proxy/firewall blokują WebSocket

**Rozwiązanie:**

1. Użyj `wss://` (szyfrowane)
2. Użyj portu 443 (standardowy HTTPS)
3. Implementuj fallback (Socket.io robi to automatycznie)
4. Skontaktuj się z adminem sieci

---

### 17. ❌ Timeout przy braku aktywności

**Objaw:**
Połączenie zrywa się po 30-60s bez aktywności

**Przyczyna:**
Proxy/load balancer zamyka nieaktywne połączenia

**Rozwiązanie:**
Implementuj heartbeat (ping/pong):

```javascript
// Klient
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "PING" }));
  }
}, 30000); // Co 30s

// Serwer
ws.on("message", (data) => {
  const msg = JSON.parse(data);
  if (msg.type === "PING") {
    ws.send(JSON.stringify({ type: "PONG" }));
  }
});
```

---

## Debugging Tips

### 🔍 Chrome DevTools

1. **Network tab → WS filter**
   - Zobacz wszystkie wiadomości WebSocket
   - Sprawdź status połączenia
   - Inspekcja payload

2. **Console**
   - Dodaj `console.log` wszędzie
   - Sprawdź `ws.readyState`

3. **Application tab → WebSockets**
   - Lista aktywnych połączeń

### 🔍 Backend debugging

```javascript
// Dodaj szczegółowe logi
wss.on("connection", (ws) => {
  console.log("Nowe połączenie");
  console.log("Liczba klientów:", wss.clients.size);

  ws.on("message", (data) => {
    console.log("Otrzymano:", data.toString());
  });

  ws.on("close", () => {
    console.log("Rozłączono");
    console.log("Pozostałych klientów:", wss.clients.size);
  });
});
```

---

## Checklist przed deploymentem

- [ ] Error handling w każdym event handlerze
- [ ] Cleanup w useEffect (frontend)
- [ ] Sprawdzanie readyState przed send
- [ ] Try-catch przy JSON.parse
- [ ] Heartbeat/ping-pong
- [ ] Autoryzacja/walidacja
- [ ] Rate limiting
- [ ] Logi (ale nie sensitive data!)
- [ ] Monitorowanie (ile aktywnych połączeń?)
- [ ] Testy reconnect scenariuszy
- [ ] Load testing
- [ ] wss:// (nie ws://) w produkcji

---

## 🆘 Dalej nie działa?

1. Sprawdź console (backend i frontend)
2. Network tab w DevTools
3. Sprawdź czy backend działa (`lsof -i :8080`)
4. Sprawdź URL (ws://, port)
5. Wyczyść cache przeglądarki
6. Restart backend i frontend
7. Zaktualizuj Node.js
8. Sprawdź firewall/antivirus

**Jeśli nadal problem - dodaj więcej console.log i śledź flow!** 🐛
