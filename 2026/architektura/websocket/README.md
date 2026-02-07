# 🔌 WebSocket - Aplikacja Edukacyjna

> **Kompletny przewodnik po WebSocket** - od podstaw do zaawansowanych konceptów  
> Stack: Node.js + ws | React + Vite | Pure WebSocket (no Socket.io)

---

## 🚀 Quick Start

```bash
# Zainstaluj i uruchom (3 kroki)
./setup.sh install    # Instalacja
./setup.sh backend    # Terminal 1
./setup.sh frontend   # Terminal 2
```

**Lub ręcznie:** zobacz [START.md](./START.md) | Pełna instrukcja: [QUICK_START.md](./QUICK_START.md)

---

## 📖 Dokumentacja

| Plik                                       | Opis                               | Czas     |
| ------------------------------------------ | ---------------------------------- | -------- |
| [**START.md**](./START.md)                 | Szybki start w 3 krokach           | 2 min ⚡ |
| [**INDEX.md**](./INDEX.md)                 | Spis treści + quick reference      | 10 min   |
| [**README.md**](./README.md)               | ← Jesteś tutaj (teoria WebSocket)  | 30 min   |
| [**DIAGRAM.md**](./DIAGRAM.md)             | Wizualizacje przepływu danych      | 20 min   |
| [**LEARNING_PATH.md**](./LEARNING_PATH.md) | Scenariusz krok po kroku + zadania | 2-3h     |
| [**POROWNANIE.md**](./POROWNANIE.md)       | WebSocket vs alternatywy           | 20 min   |
| [**BLEDY.md**](./BLEDY.md)                 | 17 błędów + rozwiązania            | 30 min   |

---

## 📚 Czym są WebSockety?

WebSocket to protokół komunikacji, który umożliwia **dwukierunkową, pełnodupleksową komunikację** między klientem (przeglądarką) a serwerem przez jedno, długotrwałe połączenie.

### 🔄 Różnice między metodami komunikacji:

#### 1. **HTTP (klasyczny request-response)**

```
Klient → Request  → Serwer
Klient ← Response ← Serwer
[koniec połączenia]
```

- Każde żądanie = nowe połączenie
- Klient zawsze inicjuje komunikację
- Duży overhead (nagłówki przy każdym żądaniu)

#### 2. **Polling (odpytywanie)**

```
Klient → "Czy są nowe dane?" → Serwer
Klient ← "Nie"                ← Serwer
[czekaj 5s]
Klient → "Czy są nowe dane?" → Serwer
Klient ← "Nie"                ← Serwer
[czekaj 5s]
Klient → "Czy są nowe dane?" → Serwer
Klient ← "Tak! Oto one"       ← Serwer
```

- Proste, ale nieefektywne
- Wiele pustych requestów
- Opóźnienie = czas między odpytywaniami

#### 3. **Long Polling**

```
Klient → "Czekam na dane"     → Serwer
[serwer trzyma połączenie otwarte]
[gdy pojawią się dane...]
Klient ← "Oto dane"           ← Serwer
Klient → "Czekam na dane"     → Serwer
```

- Lepsze od pollingu
- Nadal HTTP request-response
- Problemy ze skalowaniem

#### 4. **WebSocket** ⭐

```
Klient → HTTP Upgrade         → Serwer
Klient ← Upgrade OK           ← Serwer
[połączenie WebSocket ustanowione]
Klient ⇄ Wiadomość ⇄ Serwer
Klient ⇄ Wiadomość ⇄ Serwer
Klient ⇄ Wiadomość ⇄ Serwer
[połączenie pozostaje otwarte]
```

- Jedno połączenie dla wielu wiadomości
- Obustronna komunikacja w czasie rzeczywistym
- Niski overhead
- Idealne dla: czatów, gier, notyfikacji live, dashboardów

---

## 📁 Struktura projektu

```
websocket/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js           # Serwer WebSocket
│   └── .gitignore
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── .gitignore
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── hooks/
│       │   └── useWebSocket.js  # Custom hook do zarządzania WS
│       └── App.css
└── DIAGRAM.md              # Wizualizacja przepływu danych
```

---

## 🚀 Jak uruchomić?

### 1️⃣ Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

Serwer WebSocket wystartuje na `ws://localhost:8080`

### 2️⃣ Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Aplikacja React będzie dostępna pod `http://localhost:5173`

---

## 🎯 Co robi ta aplikacja?

1. **Backend** nasłuchuje na połączenia WebSocket
2. Gdy klient się połączy, otrzymuje wiadomość **WELCOME**
3. Klient może wysyłać wiadomości
4. Wszystkie wiadomości są **broadcastowane** do wszystkich podłączonych klientów
5. Interfejs pokazuje status połączenia i historię wiadomości

---

## 🧪 Jak przetestować?

1. Uruchom backend i frontend
2. Otwórz aplikację w **dwóch kartach przeglądarki**
3. Napisz wiadomość w jednej karcie
4. Zobacz jak pojawia się w drugiej! 🎉

---

## 📖 Protokół komunikacji

Wiadomości są wymieniane w formacie JSON:

```json
{
  "type": "MESSAGE",
  "payload": "Treść wiadomości"
}
```

Typy wiadomości:

- `WELCOME` - powitanie po połączeniu
- `MESSAGE` - zwykła wiadomość tekstowa
- `BROADCAST` - wiadomość do wszystkich klientów

---

## 🎓 Najważniejsze koncepty

### 1. **Connection Lifecycle (Cykl życia połączenia)**

```
┌─────────────┐
│   CLOSED    │ ← Stan początkowy
└──────┬──────┘
       │ ws = new WebSocket()
       ▼
┌─────────────┐
│ CONNECTING  │ ← Nawiązywanie połączenia
└──────┬──────┘
       │ onopen()
       ▼
┌─────────────┐
│    OPEN     │ ← Połączenie aktywne, można wysyłać/odbierać
└──────┬──────┘
       │ close() / błąd / disconnect
       ▼
┌─────────────┐
│   CLOSED    │ ← Połączenie zamknięte
└─────────────┘
```

### 2. **Broadcast (rozgłaszanie)**

Gdy jeden klient wysyła wiadomość, serwer przekazuje ją **wszystkim** podłączonym klientom:

```
Klient A ─┐
          ├──→ Serwer ──→ Broadcast ─┬──→ Klient A
Klient B ─┤                           ├──→ Klient B
          │                           └──→ Klient C
Klient C ─┘
```

### 3. **Dlaczego WebSocket nie jest w React State?**

❌ **ŹLE:**

```javascript
const [ws, setWs] = useState(null);
```

✅ **DOBRZE:**

```javascript
const wsRef = useRef(null);
```

**Powód:**

- WebSocket to obiekt **mutable** (zmienny)
- Trzymanie go w `state` spowodowałoby niepotrzebne re-rendery
- `useRef` pozwala zachować referencję bez wpływu na renderowanie
- Unikamy **memory leaków** przez prawidłowe zamykanie połączenia w cleanup

---

## ⚠️ Typowe błędy początkujących

### 1. **Brak zamykania połączenia**

```javascript
// ❌ ŹLE
useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");
}, []); // Brak cleanup!

// ✅ DOBRZE
useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");
  return () => ws.close(); // Cleanup przy unmount
}, []);
```

### 2. **Tworzenie nowego połączenia przy każdym renderze**

```javascript
// ❌ ŹLE
function App() {
  const ws = new WebSocket("ws://localhost:8080"); // Za każdym razem nowe!
}

// ✅ DOBRZE
function App() {
  const wsRef = useRef(null);
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080");
  }, []); // Tylko raz!
}
```

### 3. **Wysyłanie przed nawiązaniem połączenia**

```javascript
// ❌ ŹLE
const ws = new WebSocket("ws://localhost:8080");
ws.send("Hello"); // Błąd! Połączenie jeszcze nie gotowe

// ✅ DOBRZE
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => {
  ws.send("Hello"); // Teraz można!
};
```

### 4. **Brak obsługi błędów**

```javascript
// ❌ ŹLE
ws.onmessage = (event) => {
  const data = JSON.parse(event.data); // Co jeśli to nie JSON?
};

// ✅ DOBRZE
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
  } catch (error) {
    console.error("Nieprawidłowy format danych:", error);
  }
};
```

---

## 🎯 Kiedy używać WebSocketów?

### ✅ **Użyj WebSocket gdy:**

- Potrzebujesz **real-time** komunikacji (czat, gry, notyfikacje)
- Serwer musi **inicjować** wysyłanie danych do klienta
- Wysoka częstotliwość wymiany danych
- Przykłady: giełda, aukcje live, współpraca online, dashboardy

### ❌ **NIE używaj WebSocket gdy:**

- Wystarczy standardowy request-response (REST API)
- Rzadka komunikacja
- Dane można cache'ować
- Proste formularze, CRUD

---

## 🚀 Co dalej? (Zaawansowane tematy)

### 1. **Reconnect (automatyczne ponowne łączenie)**

Gdy połączenie zostanie zerwane, automatycznie próbuj się połączyć ponownie:

```javascript
function connectWithRetry() {
  const ws = new WebSocket("ws://localhost:8080");

  ws.onclose = () => {
    console.log("Rozłączono. Ponawiam za 3s...");
    setTimeout(connectWithRetry, 3000);
  };
}
```

### 2. **Heartbeat / Ping-Pong**

Regularnie sprawdzaj czy połączenie jest aktywne:

```javascript
// Klient co 30s wysyła ping
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "PING" }));
  }
}, 30000);

// Serwer odpowiada PONG
ws.on("message", (data) => {
  const msg = JSON.parse(data);
  if (msg.type === "PING") {
    ws.send(JSON.stringify({ type: "PONG" }));
  }
});
```

### 3. **Autoryzacja**

WebSocket nie ma wbudowanej autoryzacji. Możesz:

- Przesłać token w pierwszej wiadomości
- Użyć query params: `ws://localhost:8080?token=xyz`
- Autoryzować przez cookies (wysyłane automatycznie)

```javascript
ws.on("message", (data) => {
  const msg = JSON.parse(data);
  if (msg.type === "AUTH") {
    if (isValidToken(msg.token)) {
      // Autoryzowano
    }
  }
});
```

### 4. **Skalowanie (wiele serwerów)**

Problem: klienci podłączeni do różnych instancji serwera nie widzą swoich wiadomości.

Rozwiązanie: **Redis Pub/Sub**

```
Serwer 1 ──┐
           ├──→ Redis ←──┐
Serwer 2 ──┘             │
                    [Broadcast]
Serwer 3 ──┐             │
           ├──→ Redis ←──┘
Serwer 4 ──┘
```

Każdy serwer publikuje wiadomości do Redis, który dystrybuuje je do wszystkich serwerów.

### 5. **Rooms / Channels**

Grupuj klientów w pokoje:

```javascript
const rooms = new Map();

// Dołącz do pokoju
function joinRoom(ws, roomName) {
  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set());
  }
  rooms.get(roomName).add(ws);
}

// Broadcast tylko do pokoju
function broadcastToRoom(roomName, message) {
  const room = rooms.get(roomName);
  if (room) {
    room.forEach((client) => client.send(message));
  }
}
```

---

## 📚 Przydatne linki

- [MDN: WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws npm package](https://github.com/websockets/ws)
- [RFC 6455 - The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)

---

## 🎓 Podsumowanie

WebSockety to potężne narzędzie do komunikacji real-time. Ta aplikacja pokazuje:

- ✅ Jak stworzyć prosty serwer WebSocket
- ✅ Jak połączyć się z frontendu (React)
- ✅ Jak zarządzać cyklem życia połączenia
- ✅ Jak broadcastować wiadomości
- ✅ Jakie są pułapki i jak ich unikać

**Pamiętaj:** WebSockety są świetne, ale nie dla każdego przypadku użycia. Wybieraj technologię adekwatną do problemu! 🎯
