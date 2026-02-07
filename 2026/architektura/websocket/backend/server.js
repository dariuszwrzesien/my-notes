/**
 * 🔌 EDUKACYJNY SERWER WEBSOCKET
 *
 * Ten plik pokazuje jak stworzyć prosty serwer WebSocket w Node.js.
 * Kod jest maksymalnie uproszczony i bogato skomentowany dla celów edukacyjnych.
 */

import { WebSocketServer } from "ws";

// ═══════════════════════════════════════════════════════════════════
// KONFIGURACJA
// ═══════════════════════════════════════════════════════════════════

const PORT = 8080;

/**
 * Tworzymy serwer WebSocket.
 *
 * WebSocketServer vs WebSocket:
 * - WebSocketServer = serwer (nasłuchuje na połączenia)
 * - WebSocket = pojedyncze połączenie (klient lub połączenie na serwerze)
 */
const wss = new WebSocketServer({
  port: PORT,
  // clientTracking: true - domyślnie włączone, śledzi wszystkich klientów w wss.clients
});

console.log(`🚀 Serwer WebSocket nasłuchuje na ws://localhost:${PORT}`);
console.log("📝 Czekam na połączenia od klientów...\n");

// ═══════════════════════════════════════════════════════════════════
// OBSŁUGA POŁĄCZEŃ
// ═══════════════════════════════════════════════════════════════════

/**
 * Event: 'connection'
 *
 * Wywoływany gdy NOWY klient się połączy.
 *
 * @param {WebSocket} ws - Obiekt reprezentujący połączenie z tym konkretnym klientem
 * @param {IncomingMessage} req - HTTP request użyty do nawiązania połączenia
 */
wss.on("connection", (ws, req) => {
  // Pobieramy adres IP klienta (do logowania/debugowania)
  const clientIp = req.socket.remoteAddress;
  console.log(`✅ Nowy klient połączony! IP: ${clientIp}`);
  console.log(`👥 Liczba aktywnych połączeń: ${wss.clients.size}\n`);

  // ───────────────────────────────────────────────────────────────
  // WYSYŁANIE WIADOMOŚCI POWITALNEJ
  // ───────────────────────────────────────────────────────────────

  /**
   * Wysyłamy wiadomość WELCOME tylko do tego klienta (nie broadcast!)
   *
   * ws.send() wysyła dane do JEDNEGO klienta (tego reprezentowanego przez ws)
   */
  const welcomeMessage = {
    type: "WELCOME",
    payload: `Witaj na serwerze! Jesteś klientem nr ${wss.clients.size}`,
    timestamp: new Date().toISOString(),
  };

  ws.send(JSON.stringify(welcomeMessage));

  // ───────────────────────────────────────────────────────────────
  // ODBIERANIE WIADOMOŚCI OD KLIENTA
  // ───────────────────────────────────────────────────────────────

  /**
   * Event: 'message'
   *
   * Wywoływany gdy TEN klient wyśle wiadomość.
   *
   * @param {Buffer|String} rawData - Surowe dane od klienta
   *
   * WAŻNE:
   * - rawData to Buffer (binary) lub String
   * - My wysyłamy JSON, więc musimy sparsować
   */
  ws.on("message", (rawData) => {
    console.log(`📨 Otrzymano surowe dane: ${rawData}`);

    // ─────────────────────────────────────────────────────────────
    // PARSOWANIE DANYCH
    // ─────────────────────────────────────────────────────────────

    let messageData;

    try {
      // Próbujemy sparsować jako JSON
      messageData = JSON.parse(rawData.toString());
      console.log(`📦 Sparsowane dane:`, messageData);
    } catch (error) {
      // Jeśli nie jest to poprawny JSON, logujemy błąd
      console.error("❌ Błąd parsowania JSON:", error.message);

      // Możemy wysłać błąd z powrotem do klienta
      ws.send(
        JSON.stringify({
          type: "ERROR",
          payload: "Nieprawidłowy format wiadomości. Oczekiwano JSON.",
        }),
      );

      return; // Przerywamy dalsze przetwarzanie
    }

    // ─────────────────────────────────────────────────────────────
    // BROADCAST - WYSYŁANIE DO WSZYSTKICH KLIENTÓW
    // ─────────────────────────────────────────────────────────────

    /**
     * wss.clients to Set zawierający WSZYSTKICH podłączonych klientów
     *
     * Broadcast = wysłanie tej samej wiadomości do wszystkich
     *
     * UWAGA:
     * - wss.clients zawiera WSZYSTKICH klientów (włącznie z nadawcą!)
     * - Sprawdzamy readyState aby upewnić się, że połączenie jest aktywne
     */

    console.log(`📢 Rozgłaszam wiadomość do ${wss.clients.size} klientów...`);

    // Dodajemy timestamp na serwerze
    const broadcastMessage = {
      ...messageData,
      serverTimestamp: new Date().toISOString(),
    };

    // Konwertujemy z powrotem na JSON string
    const messageString = JSON.stringify(broadcastMessage);

    // Iterujemy po wszystkich klientach
    wss.clients.forEach((client) => {
      /**
       * client.readyState - aktualny stan połączenia:
       *
       * WebSocket.CONNECTING (0) - połączenie w trakcie nawiązywania
       * WebSocket.OPEN (1)       - połączenie aktywne (możemy wysyłać)
       * WebSocket.CLOSING (2)    - połączenie w trakcie zamykania
       * WebSocket.CLOSED (3)     - połączenie zamknięte
       *
       * Wysyłamy TYLKO gdy połączenie jest OPEN!
       */
      if (client.readyState === client.OPEN) {
        client.send(messageString);
      }
    });

    console.log(`✅ Wiadomość wysłana do wszystkich klientów\n`);
  });

  // ───────────────────────────────────────────────────────────────
  // OBSŁUGA ZAMKNIĘCIA POŁĄCZENIA
  // ───────────────────────────────────────────────────────────────

  /**
   * Event: 'close'
   *
   * Wywoływany gdy klient się rozłącza (celowo lub przez błąd)
   *
   * @param {number} code - Kod zamknięcia (1000 = normalne, 1001 = going away, etc.)
   * @param {Buffer} reason - Opcjonalny powód zamknięcia
   *
   * Kody zamknięcia: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
   */
  ws.on("close", (code, reason) => {
    console.log(
      `❌ Klient rozłączony. Kod: ${code}, Powód: ${reason || "brak"}`,
    );
    console.log(`👥 Pozostałych klientów: ${wss.clients.size}\n`);
  });

  // ───────────────────────────────────────────────────────────────
  // OBSŁUGA BŁĘDÓW
  // ───────────────────────────────────────────────────────────────

  /**
   * Event: 'error'
   *
   * Wywoływany gdy wystąpi błąd połączenia
   *
   * WAŻNE:
   * - Zawsze obsługuj błędy, inaczej mogą crashować serwer!
   * - Po błędzie połączenie jest automatycznie zamykane
   */
  ws.on("error", (error) => {
    console.error("💥 Błąd WebSocket:", error.message);
  });

  // ───────────────────────────────────────────────────────────────
  // PING/PONG - HEARTBEAT (opcjonalne)
  // ───────────────────────────────────────────────────────────────

  /**
   * Event: 'ping' i 'pong'
   *
   * WebSocket ma wbudowany mechanizm ping/pong do sprawdzania czy połączenie żyje.
   *
   * - Serwer może wysłać: ws.ping()
   * - Klient automatycznie odpowie: pong
   * - Możemy nasłuchiwać na 'pong' event
   *
   * W tej prostej wersji nie implementujemy, ale warto wiedzieć!
   */

  // Przykład (zakomentowany):
  // const heartbeatInterval = setInterval(() => {
  //   if (ws.readyState === ws.OPEN) {
  //     ws.ping(); // Wysyłamy ping
  //   }
  // }, 30000); // Co 30 sekund

  // ws.on('pong', () => {
  //   console.log('💓 Otrzymano pong - połączenie aktywne');
  // });

  // ws.on('close', () => {
  //   clearInterval(heartbeatInterval); // Cleanup!
  // });
});

// ═══════════════════════════════════════════════════════════════════
// OBSŁUGA BŁĘDÓW SERWERA
// ═══════════════════════════════════════════════════════════════════

/**
 * Obsługa błędów na poziomie całego serwera
 * (nie konkretnego połączenia, ale samego serwera)
 */
wss.on("error", (error) => {
  console.error("💥 Krytyczny błąd serwera WebSocket:", error);
});

// ═══════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════

/**
 * Prawidłowe zamknięcie serwera przy SIGINT (Ctrl+C) lub SIGTERM
 *
 * To jest WAŻNE:
 * - Zamykamy wszystkie aktywne połączenia
 * - Informujemy klientów o zamknięciu
 * - Unikamy "orphaned connections"
 */
process.on("SIGINT", () => {
  console.log("\n⚠️  Otrzymano SIGINT. Zamykam serwer...");

  // Informujemy wszystkich klientów
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          type: "SERVER_SHUTDOWN",
          payload: "Serwer się wyłącza",
        }),
      );
      client.close(1000, "Server shutdown"); // 1000 = normal closure
    }
  });

  // Zamykamy serwer
  wss.close(() => {
    console.log("✅ Serwer WebSocket zamknięty");
    process.exit(0);
  });
});

// ═══════════════════════════════════════════════════════════════════
// DODATKOWE INFORMACJE
// ═══════════════════════════════════════════════════════════════════

/**
 * 📚 KLUCZOWE POJĘCIA:
 *
 * 1. wss.clients
 *    - Set zawierający wszystkie aktywne połączenia
 *    - Automatycznie aktualizowany (dodawanie/usuwanie)
 *
 * 2. ws.readyState
 *    - Stan pojedynczego połączenia
 *    - Zawsze sprawdzaj przed wysłaniem!
 *
 * 3. ws.send() vs broadcast
 *    - ws.send() = do jednego klienta
 *    - wss.clients.forEach() = broadcast do wszystkich
 *
 * 4. Memory leaks
 *    - Pamiętaj o cleanup (clearInterval, removeListener)
 *    - wss.clients automatycznie usuwa zamknięte połączenia
 *
 * 5. Parsowanie danych
 *    - Zawsze w try-catch!
 *    - WebSocket wysyła Buffer, nie obiekt JS
 *
 * ⚠️ CO MOŻNA POPRAWIĆ (dla zaawansowanych):
 *
 * - Dodać autoryzację (token w pierwszej wiadomości)
 * - Implementować heartbeat (ping/pong)
 * - Dodać rooms/channels (grupy klientów)
 * - Logować do pliku (nie tylko console)
 * - Rate limiting (ograniczenie liczby wiadomości)
 * - Walidacja danych (JSON schema)
 * - Reconnect logic po stronie klienta
 * - Persystencja wiadomości (baza danych)
 * - Redis pub/sub dla wielu instancji serwera
 *
 * Ale to już dla produkcji! Ta wersja jest edukacyjna i pokazuje podstawy. 🎓
 */
