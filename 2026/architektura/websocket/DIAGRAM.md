# 📊 Przepływ danych w aplikacji WebSocket

## 1. Nawiązywanie połączenia

```
┌─────────────────┐                               ┌─────────────────┐
│                 │   1. HTTP Upgrade Request     │                 │
│   PRZEGLĄDARKA  │ ──────────────────────────►   │     SERWER      │
│   (Frontend)    │                               │   (Backend)     │
│                 │   2. Switching Protocols      │                 │
│   Port: 5173    │ ◄──────────────────────────   │   Port: 8080    │
│                 │      (Status 101)             │                 │
└─────────────────┘                               └─────────────────┘
        │                                                   │
        │            3. WebSocket Connection                │
        │                   ESTABLISHED                     │
        │ ◄═════════════════════════════════════════════►  │
        │          (ws://localhost:8080)                    │
        │                                                   │
        │   4. Serwer wysyła WELCOME                       │
        │ ◄─────────────────────────────────────────────   │
        │   { type: "WELCOME", payload: "..." }            │
```

### Szczegóły techniczne:

1. **HTTP Upgrade Request:**

   ```
   GET /chat HTTP/1.1
   Host: localhost:8080
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
   Sec-WebSocket-Version: 13
   ```

2. **Server Response:**

   ```
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
   ```

3. Po tym połączenie HTTP zostaje "podniesione" (upgraded) do WebSocket

---

## 2. Wysyłanie wiadomości (jednokierunkowe)

```
┌─────────────────┐                               ┌─────────────────┐
│   KLIENT A      │                               │     SERWER      │
│                 │   1. Wysłanie wiadomości      │                 │
│  [Input: "Hi!"] │ ──────────────────────────►   │                 │
│                 │   ws.send(JSON)               │  wss.on('msg')  │
│  ws.send()      │                               │                 │
│                 │                               │  2. Odbiera     │
│                 │                               │     "Hi!"       │
└─────────────────┘                               └─────────────────┘

Dane przesyłane:
{
  "type": "MESSAGE",
  "payload": "Hi!"
}
```

---

## 3. Broadcast do wszystkich klientów

```
┌─────────────────┐                               ┌─────────────────┐
│   KLIENT A      │                               │                 │
│                 │   1. "Hello everyone!"        │                 │
│  ws.send() ─────┼──────────────────────────────►│                 │
│                 │                               │                 │
└─────────────────┘                               │                 │
                                                  │     SERWER      │
┌─────────────────┐                               │                 │
│   KLIENT B      │   2. Broadcast do wszystkich │   Set<clients>  │
│                 │ ◄─────────────────────────────┤                 │
│  ws.onmessage   │      "Hello everyone!"        │   clients.      │
│                 │                               │   forEach(...)  │
└─────────────────┘                               │                 │
                                                  │                 │
┌─────────────────┐                               │                 │
│   KLIENT C      │   3. Każdy klient dostaje     │                 │
│                 │ ◄─────────────────────────────┤                 │
│  ws.onmessage   │      tę samą wiadomość        │                 │
│                 │                               │                 │
└─────────────────┘                               └─────────────────┘

⚠️ Uwaga: KLIENT A też dostanie swoją własną wiadomość!
```

### Kod na serwerze:

```javascript
// Otrzymano wiadomość od jednego klienta
ws.on("message", (data) => {
  // Iteruj po WSZYSTKICH podłączonych klientach
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data); // Wyślij do każdego
    }
  });
});
```

---

## 4. Pełny cykl życia (lifecycle)

```
FRONTEND                          SERWER
═══════════════════════════════════════════════════════════

1. MOUNTING KOMPONENTU
─────────────────────
useEffect(() => {
  wsRef.current =
    new WebSocket(url) ──────────► wss.on('connection')
})                                       │
                                         │
                                         ▼
2. POŁĄCZENIE NAWIĄZANE              Nowy klient
─────────────────────                dodany do Set
ws.onopen() ◄─────────────────────  wss.clients.add(ws)
│                                        │
│                                        │
▼                                        ▼
setStatus("connected")            ws.send(WELCOME)


3. WYMIANA WIADOMOŚCI
─────────────────────
                    ⇄  bidirectional  ⇄
ws.send(msg) ──────────────────────────► ws.on('message')
                                              │
                                              ▼
                                         Parse JSON
                                              │
                                              ▼
ws.onmessage() ◄────────────────────── Broadcast do
   │                                   wszystkich
   │
   ▼
setMessages([...])


4. ZAMYKANIE POŁĄCZENIA
────────────────────────
return () => {
  ws.close() ───────────────────────► ws.on('close')
}                                           │
│                                           │
│                                           ▼
│                                  wss.clients.delete(ws)
▼
setStatus("disconnected")


5. UNMOUNTING / CLEANUP
────────────────────────
Component unmounts
WebSocket closed
Memory freed ✓
```

---

## 5. Przepływ danych w React (szczegółowo)

```
┌──────────────────────────────────────────────────────────┐
│                     APP COMPONENT                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │         useWebSocket Hook                  │         │
│  ├────────────────────────────────────────────┤         │
│  │                                            │         │
│  │  wsRef = useRef(null)                     │         │
│  │    │                                       │         │
│  │    ├─► WebSocket Object (mutable)         │         │
│  │    │    - nie wywołuje re-renderów        │         │
│  │    │    - persystuje między renderami     │         │
│  │    │                                       │         │
│  │  [status, setStatus] = useState(...)      │         │
│  │    │                                       │         │
│  │    ├─► "connecting" → UI update           │         │
│  │    ├─► "connected"   → UI update           │         │
│  │    └─► "disconnected" → UI update          │         │
│  │                                            │         │
│  │  [messages, setMessages] = useState([])   │         │
│  │    │                                       │         │
│  │    └─► [...messages, new] → UI update     │         │
│  │                                            │         │
│  │  useEffect(() => {                        │         │
│  │    1. new WebSocket(url)                  │         │
│  │    2. Setup event handlers                │         │
│  │    3. return cleanup                      │         │
│  │  }, [url])                                │         │
│  │                                            │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │              UI RENDER                     │         │
│  ├────────────────────────────────────────────┤         │
│  │                                            │         │
│  │  Status: {status}                         │         │
│  │  Messages: {messages.map(...)}            │         │
│  │  <input onChange={...} />                 │         │
│  │  <button onClick={sendMessage}>Send</button>│        │
│  │                                            │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Dlaczego taka struktura?

1. **useRef dla WebSocket:**
   - WebSocket to obiekt zewnętrzny (API przeglądarki)
   - Zmiana jego właściwości nie powinna triggerować re-renderów
   - useRef.current pozostaje taki sam między renderami

2. **useState dla UI:**
   - `status` - wpływa na wyświetlanie (ikona statusu)
   - `messages` - wpływa na wyświetlanie (lista wiadomości)
   - Każda zmiana powoduje re-render (co jest OK!)

3. **Separation of Concerns:**

   ```
   WebSocket (useRef) ──► Komunikacja z serwerem
                          (nie wpływa na render)

   State (useState)   ──► Stan UI
                          (wywołuje re-render)
   ```

---

## 6. Sekwencja zdarzeń (timeline)

```
TIME    FRONTEND                        BACKEND
═════════════════════════════════════════════════════════
0ms     Component mount

50ms    new WebSocket()  ────────►
        status: "connecting"

100ms                              ◄─  connection event

150ms   ◄────── onopen() ────────
        status: "connected"

200ms                              ──► send WELCOME

250ms   ◄─── onmessage() ────────
        messages: ["Welcome!"]

...     [użytkownik pisze "Hello"]

5000ms  send("Hello") ──────────►

5050ms                             ◄─  message event
                                       broadcast to all

5100ms  ◄─── onmessage() ────────
        messages: ["Welcome!", "Hello"]

...     [użytkownik zamyka kartę]

10000ms Component unmount
        ws.close() ─────────────►

10050ms                            ◄─  close event
                                       clients.delete(ws)
```

---

## 7. Zarządzanie wieloma klientami

```
                        ┌─────────────────────┐
                        │       SERWER        │
                        │                     │
                        │  wss.clients = Set  │
                        │  ┌────┐             │
                        │  │ A  │             │
                        │  ├────┤             │
                        │  │ B  │             │
    Klient A            │  ├────┤             │
    ws.send("Hi") ──────┼─►│ C  │             │
                        │  └────┘             │
                        │     │               │
                        │     ▼               │
                        │  forEach(client)    │
                        │     │               │
                        └─────┼───────────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
                 ▼            ▼            ▼
           ┌─────────┐  ┌─────────┐  ┌─────────┐
           │CLIENT A │  │CLIENT B │  │CLIENT C │
           │  "Hi"   │  │  "Hi"   │  │  "Hi"   │
           └─────────┘  └─────────┘  └─────────┘
```

### Charakterystyka:

- Każdy klient ma **unikalny** obiekt WebSocket
- Serwer przechowuje wszystkie w `wss.clients` (Set)
- Broadcast = iteracja po całym Set i wysłanie do każdego
- Gdy klient się rozłącza, jest automatycznie usuwany z Set

---

## 8. Format ramki WebSocket (nisko-poziomowe)

```
Wysyłanie: ws.send("Hello")

┌─────────────────────────────────────────────┐
│  Frame Header                               │
├─────────────────────────────────────────────┤
│  FIN: 1 (final frame)                      │
│  Opcode: 1 (text)                          │
│  Mask: 1 (client → server, zawsze masked)  │
│  Payload Length: 5                          │
│  Masking Key: [4 random bytes]             │
├─────────────────────────────────────────────┤
│  Payload Data (masked)                      │
│  "Hello" XOR MaskingKey                     │
└─────────────────────────────────────────────┘

Odbieranie: ws.onmessage

┌─────────────────────────────────────────────┐
│  FIN: 1                                     │
│  Opcode: 1 (text)                          │
│  Mask: 0 (server → client, unmasked)       │
│  Payload Length: 5                          │
├─────────────────────────────────────────────┤
│  Payload Data                               │
│  "Hello" (plaintext)                        │
└─────────────────────────────────────────────┘

⚠️ Klient MUSI maskować dane (security)
✓  Serwer wysyła dane bez maskowania
```

**Dlaczego maskowanie?**

- Zabezpieczenie przed atakami cache poisoning
- Wymóg protokołu WebSocket (RFC 6455)
- Biblioteka `ws` robi to automatycznie

---

## 9. Co się dzieje pod maską?

```
UŻYTKOWNIK KLIKA "SEND"
         │
         ▼
┌──────────────────┐
│  sendMessage()   │  ← Funkcja w React
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ JSON.stringify() │  ← Zamiana obiektu na string
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   ws.send()      │  ← API przeglądarki
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Masking (XOR)    │  ← Automatyczne
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Fragmentacja     │  ← Jeśli wiadomość duża
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ TCP Socket       │  ← Przesyłanie przez sieć
└────────┬─────────┘
         │
         ▼
    [INTERNET]
         │
         ▼
┌──────────────────┐
│ Serwer (Node.js) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ ws.on('message') │  ← Event handler
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ JSON.parse()     │  ← Parsowanie
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Logika biznesowa │  ← Broadcast
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ forEach(client)  │  ← Do wszystkich
│   client.send()  │
└──────────────────┘
```

---

## Podsumowanie

Ten diagram pokazuje:

1. ✅ Jak nawiązywane jest połączenie WebSocket (HTTP Upgrade)
2. ✅ Jak przebiegają dwukierunkowe wiadomości
3. ✅ Jak działa broadcast do wielu klientów
4. ✅ Pełny lifecycle od mount do unmount
5. ✅ Przepływ danych w React (useRef vs useState)
6. ✅ Timeline zdarzeń w czasie
7. ✅ Zarządzanie wieloma klientami na serwerze
8. ✅ Nisko-poziomowe szczegóły protokołu
9. ✅ Co dzieje się "pod maską" przy wysyłaniu

**Klucz do zrozumienia:** WebSocket to **persistent, bidirectional connection** - jedno połączenie, wiele wiadomości w obie strony! 🚀
