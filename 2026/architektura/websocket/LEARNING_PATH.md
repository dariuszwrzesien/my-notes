# 📝 Scenariusz Edukacyjny - Krok po kroku

Ten dokument prowadzi Cię przez analizę kodu i zrozumienie jak działa WebSocket.

## 🎯 Cel nauki

Po przejściu tego scenariusza zrozumiesz:

- Jak nawiązywane jest połączenie WebSocket
- Jak działa komunikacja dwukierunkowa
- Jak zarządzać stanem połączenia w React
- Jakie są pułapki i jak ich unikać

---

## 📚 Część 1: Backend (30 min)

### Krok 1: Otwórz `backend/server.js`

#### 🔍 Zadanie 1: Znajdź i zrozum

1. **Gdzie tworzymy serwer WebSocket?**
   - Wskazówka: Szukaj `new WebSocketServer`
   - Pytanie: Dlaczego podajemy `port: 8080`?

2. **Co dzieje się gdy klient się połączy?**
   - Wskazówka: Szukaj `wss.on('connection'`
   - Pytanie: Ile parametrów otrzymuje callback?

3. **Jak wysyłamy WELCOME?**
   - Wskazówka: Szukaj `ws.send`
   - Pytanie: Dlaczego używamy `JSON.stringify()`?

#### 🧪 Eksperyment 1: Zmodyfikuj wiadomość powitalną

Zmień:

```javascript
const welcomeMessage = {
  type: "WELCOME",
  payload: `Witaj na serwerze! Jesteś klientem nr ${wss.clients.size}`,
  timestamp: new Date().toISOString(),
};
```

Na:

```javascript
const welcomeMessage = {
  type: "WELCOME",
  payload: `🎉 Hej! Połączyło się już ${wss.clients.size} osób!`,
  timestamp: new Date().toISOString(),
  serverVersion: "1.0.0", // Dodaj nowe pole
};
```

**Uruchom backend i sprawdź co się zmieni!**

---

### Krok 2: Broadcast

#### 🔍 Zadanie 2: Zrozum broadcast

1. **Znajdź kod broadcastu**
   - Wskazówka: `wss.clients.forEach`
   - Pytanie: Czy nadawca też otrzymuje swoją wiadomość?

2. **Co to jest `readyState`?**
   - Wskazówka: `client.readyState === client.OPEN`
   - Pytanie: Dlaczego sprawdzamy to przed wysłaniem?

#### 🧪 Eksperyment 2: Exclude sender

Spróbuj zmodyfikować broadcast tak, żeby nadawca NIE otrzymywał własnej wiadomości:

```javascript
wss.clients.forEach((client) => {
  // Dodaj warunek: client !== ws
  if (client.readyState === client.OPEN && client !== ws) {
    client.send(messageString);
  }
});
```

**Sprawdź różnicę!**

---

### Krok 3: Lifecycle events

#### 🔍 Zadanie 3: Obserwuj lifecycle

1. **Dodaj więcej logów**

W `ws.on('close')` dodaj:

```javascript
console.log(`❌ Klient rozłączony. Kod: ${code}`);
console.log(`👥 Pozostałych klientów: ${wss.clients.size}`);
console.log(`⏰ Czas połączenia: ${Date.now() - connectionTime}ms`); // Dodaj na początku: const connectionTime = Date.now();
```

2. **Uruchom i testuj**
   - Otwórz aplikację
   - Zobacz logi przy połączeniu
   - Zamknij kartę
   - Zobacz logi przy rozłączeniu

---

## 🎨 Część 2: Frontend - Hook (30 min)

### Krok 4: Otwórz `frontend/src/hooks/useWebSocket.js`

#### 🔍 Zadanie 4: useRef vs useState

1. **Dlaczego WebSocket w useRef?**
   - Przeczytaj komentarze przy `wsRef`
   - Pytanie: Co by się stało gdyby użyć useState?

2. **Dlaczego status w useState?**
   - Porównaj `status` i `wsRef`
   - Pytanie: Jaka jest różnica w zastosowaniu?

#### 🧪 Eksperyment 3: Złamane reguły

Spróbuj (tylko na chwilę!) zmienić:

```javascript
const wsRef = useRef(null);
```

Na:

```javascript
const [ws, setWs] = useState(null);
```

**Konsekwencje:**

- Niepotrzebne re-rendery
- Problemy z zamykaniem połączenia
- Trudniejsze debugowanie

**Cofnij zmiany po eksperymencie!**

---

### Krok 5: Event handlers

#### 🔍 Zadanie 5: Przeanalizuj handlers

1. **ws.onopen**
   - Pytanie: Kiedy dokładnie to się wywołuje?
   - Pytanie: Czy możemy wysyłać PRZED onopen?

2. **ws.onmessage**
   - Znajdź: `JSON.parse(event.data)`
   - Pytanie: Dlaczego w try-catch?

3. **ws.onclose**
   - Pytanie: Czy onclose wywołuje się zawsze?
   - Pytanie: Co to jest `wasClean`?

#### 🧪 Eksperyment 4: Auto-reconnect

Dodaj auto-reconnect w `ws.onclose`:

```javascript
ws.onclose = (event) => {
  console.log("❌ WebSocket: Połączenie zamknięte");
  setStatus("disconnected");

  // Auto-reconnect po 3 sekundach
  if (!event.wasClean) {
    console.log("🔄 Auto-reconnect za 3s...");
    setTimeout(() => {
      console.log("🔄 Próbuję połączyć ponownie...");
      // TODO: Jak to zrobić? (wskazówka: trzeba wywołać ponownie useEffect)
    }, 3000);
  }
};
```

**Wyzwanie:** Jak zaimplementować reconnect poprawnie?

---

### Krok 6: Cleanup

#### 🔍 Zadanie 6: Zrozum cleanup

1. **Znajdź return w useEffect**
   - Pytanie: Kiedy się wywołuje?
   - Pytanie: Co się stanie bez cleanup?

#### 🧪 Eksperyment 5: Memory leak

**UWAGA: Nie rób tego w produkcji!**

Zakomentuj cleanup:

```javascript
return () => {
  // console.log('🧹 Cleanup...');
  // if (ws.readyState === WebSocket.OPEN) {
  //   ws.close();
  // }
};
```

**Uruchom aplikację:**

1. Otwórz
2. Zamknij kartę
3. Sprawdź w backend console - połączenie NADAL ISTNIEJE!
4. **Cofnij zmiany!**

---

## 🎨 Część 3: Frontend - Component (20 min)

### Krok 7: Otwórz `frontend/src/App.jsx`

#### 🔍 Zadanie 7: Separation of Concerns

1. **Porównaj:**
   - Co jest w `useWebSocket`? (logika)
   - Co jest w `App`? (UI)

2. **Pytanie:** Dlaczego to jest dobry wzorzec?

---

### Krok 8: Controlled component

#### 🔍 Zadanie 8: Input handling

1. **Znajdź:**

   ```javascript
   const [inputValue, setInputValue] = useState("");
   ```

2. **Pytanie:** Czym różni się to od WebSocket state?

#### 🧪 Eksperyment 6: Uncontrolled component

Spróbuj zamienić na uncontrolled:

```javascript
// Zamiast value={inputValue}
<input
  ref={inputRef} // Dodaj: const inputRef = useRef(null);
  placeholder="Wpisz wiadomość..."
/>;

// W handleSubmit:
const value = inputRef.current.value;
```

**Pytanie:** Jakie są różnice w zachowaniu?

---

## 🎯 Część 4: Pełny Flow (30 min)

### Krok 9: Śledź wiadomość end-to-end

#### 🧪 Eksperyment 7: Full trace

1. **Dodaj console.log w każdym miejscu:**

**Frontend (App.jsx):**

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  console.log("1️⃣ Frontend: Użytkownik wysłał:", inputValue);
  sendMessage(inputValue);
  setInputValue("");
};
```

**Frontend (useWebSocket.js):**

```javascript
const sendMessage = (text) => {
  console.log("2️⃣ Frontend: Wysyłam przez WebSocket:", text);
  wsRef.current.send(JSON.stringify(message));
};
```

**Backend (server.js):**

```javascript
ws.on("message", (rawData) => {
  console.log("3️⃣ Backend: Otrzymałem:", rawData.toString());
  console.log("4️⃣ Backend: Broadcastuję do", wss.clients.size, "klientów");
});
```

**Frontend (useWebSocket.js):**

```javascript
ws.onmessage = (event) => {
  console.log("5️⃣ Frontend: Otrzymałem broadcast:", event.data);
  setMessages((prev) => [...prev, messageData]);
};
```

2. **Uruchom aplikację w 2 kartach**
3. **Wyślij wiadomość**
4. **Obserwuj konsole (frontend i backend)**

---

## 🏆 Część 5: Wyzwania (bonus)

### Wyzwanie 1: Pokoje (Rooms)

Zaimplementuj system pokoi:

- Użytkownik może dołączyć do pokoju
- Wiadomości są broadcastowane tylko w obrębie pokoju

**Wskazówka:**

```javascript
const rooms = new Map(); // roomName -> Set<WebSocket>
```

---

### Wyzwanie 2: Typing indicator

Pokaż "User is typing..." gdy ktoś pisze:

- Wysyłaj event `TYPING_START` gdy użytkownik zaczyna pisać
- Wysyłaj `TYPING_STOP` po 2s bez aktywności
- Wyświetl wskaźnik w UI

---

### Wyzwanie 3: Heartbeat

Zaimplementuj ping-pong:

- Klient wysyła PING co 30s
- Serwer odpowiada PONG
- Jeśli brak PONG przez 60s - rozłącz

---

## ✅ Checklist: Co powinieneś teraz umieć?

- [ ] Wytłumaczyć różnicę między HTTP a WebSocket
- [ ] Stworzyć prosty serwer WebSocket w Node.js
- [ ] Połączyć się z serwerem z przeglądarki
- [ ] Obsłużyć lifecycle (open, message, close, error)
- [ ] Użyć useRef dla WebSocket, useState dla UI
- [ ] Zaimplementować broadcast
- [ ] Zarządzać cleanup i unikać memory leaks
- [ ] Debugować problemy z połączeniem

---

## 📖 Co dalej?

1. **Przeczytaj pełny README.md** - więcej teorii
2. **Sprawdź DIAGRAM.md** - wizualizacja przepływu
3. **Zaimplementuj jedno z wyzwań**
4. **Poczytaj o Socket.io** - porównaj podejścia

---

**Gratulacje! Przeszedłeś cały scenariusz edukacyjny! 🎉**

Teraz masz solidne podstawy do pracy z WebSocket. Czas na własne projekty! 🚀
