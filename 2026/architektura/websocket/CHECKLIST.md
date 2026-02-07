# ✅ Checklist - Co zrobić krok po kroku?

## 🎯 Dla uczących się WebSocket (pierwsze podejście)

### Faza 1: Setup (5 min)

- [ ] Sklonuj/pobierz projekt
- [ ] Upewnij się że masz Node.js (v16+)
- [ ] Przeczytaj [START.md](./START.md)
- [ ] Uruchom `./setup.sh install`
- [ ] Uruchom backend: `./setup.sh backend`
- [ ] Uruchom frontend: `./setup.sh frontend` (nowy terminal)
- [ ] Otwórz http://localhost:5173
- [ ] Sprawdź czy działa (🟢 status connected)

### Faza 2: Pierwszy test (5 min)

- [ ] Otwórz aplikację w **2 kartach** przeglądarki
- [ ] Wyślij wiadomość w karcie 1
- [ ] Sprawdź czy pojawiła się w karcie 2
- [ ] Otwórz DevTools (F12) → Network → WS
- [ ] Zobacz wiadomości w zakładce "Messages"
- [ ] Otwórz Console - zobacz logi

### Faza 3: Teoria (30-60 min)

- [ ] Przeczytaj [README.md](./README.md)
  - [ ] Sekcja "Czym są WebSockety?"
  - [ ] Różnice: HTTP vs WebSocket
  - [ ] Lifecycle połączenia
  - [ ] Typowe błędy
- [ ] Przejrzyj [DIAGRAM.md](./DIAGRAM.md)
  - [ ] Nawiązywanie połączenia
  - [ ] Broadcast
  - [ ] Lifecycle w React

### Faza 4: Kod Backend (30-60 min)

- [ ] Otwórz `backend/server.js`
- [ ] Przeczytaj komentarze od początku do końca
- [ ] Znajdź:
  - [ ] Gdzie tworzymy serwer (`new WebSocketServer`)
  - [ ] Obsługa `connection` event
  - [ ] Obsługa `message` event
  - [ ] Jak działa broadcast (`wss.clients.forEach`)
  - [ ] Graceful shutdown
- [ ] Eksperyment 1: Zmień wiadomość WELCOME
- [ ] Eksperyment 2: Dodaj custom log przy message

### Faza 5: Kod Frontend - Hook (60 min)

- [ ] Otwórz `frontend/src/hooks/useWebSocket.js`
- [ ] Przeczytaj komentarze od początku do końca
- [ ] Znajdź i zrozum:
  - [ ] Dlaczego `useRef` dla WebSocket?
  - [ ] Dlaczego `useState` dla status i messages?
  - [ ] Event handlers (onopen, onmessage, onclose, onerror)
  - [ ] Cleanup function (return w useEffect)
  - [ ] Sprawdzanie `readyState` przed send
- [ ] Eksperyment 3: Dodaj console.log w każdym event handlerze
- [ ] Eksperyment 4: Spróbuj użyć useState zamiast useRef (zobacz co się stanie)

### Faza 6: Kod Frontend - UI (30 min)

- [ ] Otwórz `frontend/src/App.jsx`
- [ ] Przeczytaj komentarze
- [ ] Znajdź:
  - [ ] Jak używamy custom hooka `useWebSocket`
  - [ ] Controlled component (input)
  - [ ] Conditional rendering (status, empty state)
  - [ ] Formularz i `handleSubmit`
- [ ] Eksperyment 5: Dodaj nowe pole do wiadomości (np. username)

### Faza 7: Praktyka (2-3h)

- [ ] Przejdź przez [LEARNING_PATH.md](./LEARNING_PATH.md)
  - [ ] Część 1: Backend (30 min)
  - [ ] Część 2: Frontend Hook (30 min)
  - [ ] Część 3: Frontend Component (20 min)
  - [ ] Część 4: Pełny flow (30 min)
- [ ] Wykonaj przynajmniej 3 eksperymenty
- [ ] Złam coś celowo (żeby zobaczyć co się stanie)
- [ ] Napraw to

### Faza 8: Kontekst (20-30 min)

- [ ] Przeczytaj [POROWNANIE.md](./POROWNANIE.md)
- [ ] Zrozum różnice:
  - [ ] HTTP Polling vs WebSocket
  - [ ] SSE vs WebSocket
  - [ ] Socket.io vs czysty WebSocket
- [ ] Kiedy używać WebSocket, a kiedy nie?

### Faza 9: Wyzwania (opcjonalne, 3-10h)

- [ ] Zaimplementuj auto-reconnect
- [ ] Zaimplementuj heartbeat (ping/pong)
- [ ] Zaimplementuj rooms/channels
- [ ] Zaimplementuj typing indicator
- [ ] Zaimplementuj user presence

### Faza 10: Troubleshooting (reference)

- [ ] Zapisz [BLEDY.md](./BLEDY.md) jako odniesienie
- [ ] Gdy coś nie działa - najpierw sprawdź tam!

---

## 🎓 Dla mentorów (plan lekcji)

### Lekcja 1 (2h): Wprowadzenie

- [ ] Pokażcie czym jest WebSocket (teoria)
- [ ] Uruchomcie aplikację na żywo
- [ ] Demo: 2 przeglądarki, broadcast
- [ ] Zadanie domowe: przeczytać README.md

### Lekcja 2 (2h): Backend

- [ ] Code review: `backend/server.js`
- [ ] Wyjaśnić lifecycle (connection, message, close)
- [ ] Wyjaśnić broadcast
- [ ] Zadanie: zmodyfikować WELCOME message

### Lekcja 3 (2h): Frontend

- [ ] Code review: `useWebSocket.js`
- [ ] useRef vs useState (KLUCZOWE!)
- [ ] Cleanup i memory leaks
- [ ] Zadanie: dodać timestamp do wiadomości

### Lekcja 4 (2h): Praktyka

- [ ] Uczniowie robią eksperymenty z LEARNING_PATH.md
- [ ] Q&A o problemach
- [ ] Code review rozwiązań

### Lekcja 5 (2h): Zaawansowane

- [ ] Porównanie z alternatywami
- [ ] Co w produkcji? (Socket.io, Redis, monitoring)
- [ ] Projekt finalny: zaimplementować jedno z wyzwań

---

## 🚀 Dla projektów (adaptacja do produkcji)

### Przed użyciem w produkcji - MUST HAVE:

#### Bezpieczeństwo

- [ ] Dodaj autoryzację (JWT token)
- [ ] Walidacja wszystkich danych wejściowych
- [ ] Rate limiting (max X messages/min)
- [ ] Sanityzacja input (XSS prevention)
- [ ] HTTPS/WSS (nie HTTP/WS!)

#### Niezawodność

- [ ] Auto-reconnect (exponential backoff)
- [ ] Heartbeat/ping-pong (wykrywanie dead connections)
- [ ] Error handling (comprehensive)
- [ ] Retry logic
- [ ] Graceful degradation

#### Skalowanie

- [ ] Redis pub/sub (multi-server communication)
- [ ] Load balancer (sticky sessions)
- [ ] Connection pooling
- [ ] Message queues (RabbitMQ/Kafka)

#### Monitoring

- [ ] Metrics (active connections, messages/sec)
- [ ] Logs (structured, searchable)
- [ ] Alerts (high error rate, connection drops)
- [ ] Dashboards (Grafana)

#### Testing

- [ ] Unit tests (backend + frontend)
- [ ] Integration tests
- [ ] Load tests (Artillery, k6)
- [ ] E2E tests (Playwright)

#### DevOps

- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Environment variables (nie hardcode!)
- [ ] Health checks
- [ ] Deployment strategy (blue/green, canary)

### Rozważ zamianę na:

- [ ] Socket.io (auto-reconnect, rooms, fallback)
- [ ] Lub: zostań przy czystym WS + dodaj features ręcznie

---

## ✅ Checkpoint: Czy rozumiesz?

Po przejściu przez projekt powinieneś umieć odpowiedzieć:

### Teoria

- [ ] Czym różni się WebSocket od HTTP?
- [ ] Co to jest HTTP Upgrade?
- [ ] Co to jest full-duplex?
- [ ] Kiedy używać WebSocket, a kiedy nie?
- [ ] Czym różni się SSE od WebSocket?

### Backend

- [ ] Jak stworzyć serwer WebSocket w Node.js?
- [ ] Co to jest `wss.clients`?
- [ ] Jak zrobić broadcast do wszystkich?
- [ ] Dlaczego sprawdzać `readyState`?
- [ ] Co to jest graceful shutdown?

### Frontend

- [ ] Dlaczego `useRef` dla WebSocket?
- [ ] Dlaczego `useState` dla UI?
- [ ] Co robi cleanup function?
- [ ] Jak wysłać wiadomość bezpiecznie?
- [ ] Jak obsłużyć disconnect?

### Praktyka

- [ ] Jak debugować WebSocket? (DevTools)
- [ ] Najczęstsze błędy i jak ich unikać?
- [ ] Jak dodać nowe feature (np. typing indicator)?
- [ ] Jak przetestować aplikację?

Jeśli na wszystko odpowiedziałeś TAK → **Gratulacje! 🎉**

---

## 🎯 Quick Checklist (absolutne minimum)

Jeśli masz tylko 1 godzinę:

- [ ] Uruchom aplikację (10 min)
- [ ] Przetestuj w 2 kartach (5 min)
- [ ] Przeczytaj `backend/server.js` (20 min)
- [ ] Przeczytaj `frontend/src/hooks/useWebSocket.js` (25 min)

**To da Ci 80% zrozumienia!**

---

## 📝 Progress Tracker

Zapisz swój postęp:

```
Rozpoczęto: ___________
Ukończono Faza 1: ___________
Ukończono Faza 2: ___________
Ukończono Faza 3: ___________
Ukończono Faza 4: ___________
Ukończono Faza 5: ___________
Ukończono Faza 6: ___________
Ukończono Faza 7: ___________
Ukończono Faza 8: ___________
Ukończono Faza 9: ___________

Całkowity czas: ___________
```

---

## 🏆 Finał

Kiedy ukończysz wszystkie checklisty:

- [ ] Przeczytaj [PODSUMOWANIE.md](./PODSUMOWANIE.md)
- [ ] Wybierz jedno wyzwanie z Fazy 9 i zaimplementuj
- [ ] Podziel się projektem z kimś (nauczanie = najlepsze uczenie)
- [ ] Zastosuj wiedzę w swoim projekcie

**Gratulacje! Jesteś teraz WebSocket master! 🎓🚀**

---

**Pytania? Zobacz [INDEX.md](./INDEX.md) dla pełnego spisu treści.**
