/**
 * 🔌 CUSTOM HOOK DO ZARZĄDZANIA WEBSOCKET
 *
 * Ten hook enkapsuluje całą logikę WebSocket, dzięki czemu
 * komponent App jest czysty i skupia się tylko na UI.
 *
 * 📚 To jest wzorzec projektowy w React:
 * - Logika biznesowa → custom hook
 * - Prezentacja → komponent
 */

import { useEffect, useRef, useState } from "react";

/**
 * Hook do zarządzania połączeniem WebSocket
 *
 * @param {string} url - Adres serwera WebSocket (np. ws://localhost:8080)
 * @returns {Object} - { status, messages, sendMessage }
 */
export function useWebSocket(url) {
  // ═══════════════════════════════════════════════════════════════
  // STATE I REFS
  // ═══════════════════════════════════════════════════════════════

  /**
   * wsRef - referencja do obiektu WebSocket
   *
   * ❓ Dlaczego useRef zamiast useState?
   *
   * ❌ const [ws, setWs] = useState(null);
   *    - WebSocket to obiekt mutable (ma metody jak .send(), .close())
   *    - Zmiana jego wewnętrznego stanu nie powinna triggerować re-renderów
   *    - setState() za każdym razem tworzyłby nowy render (niepotrzebny!)
   *
   * ✅ const wsRef = useRef(null);
   *    - wsRef.current może się zmieniać bez wywoływania re-renderów
   *    - Zachowuje tą samą referencję między renderami
   *    - Idealny dla obiektów zewnętrznych (WebSocket, timers, DOM refs)
   */
  const wsRef = useRef(null);

  /**
   * status - aktualny stan połączenia
   *
   * Możliwe wartości:
   * - "connecting" - próba nawiązania połączenia
   * - "connected" - połączenie aktywne
   * - "disconnected" - rozłączono
   *
   * ✅ To POWINNO być w useState, bo wpływa na UI (ikona statusu)
   */
  const [status, setStatus] = useState("disconnected");

  /**
   * messages - tablica otrzymanych wiadomości
   *
   * ✅ To POWINNO być w useState, bo wpływa na UI (lista wiadomości)
   */
  const [messages, setMessages] = useState([]);

  // ═══════════════════════════════════════════════════════════════
  // EFEKT - LIFECYCLE WEBSOCKET
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    console.log("🔄 useEffect: Tworzę nowe połączenie WebSocket...");

    /**
     * Tworzymy nowy WebSocket
     *
     * WebSocket API (natywne w przeglądarce):
     * - new WebSocket(url) - nawiązuje połączenie
     * - ws.send(data) - wysyła dane
     * - ws.close() - zamyka połączenie
     * - ws.onopen - callback gdy połączenie otwarte
     * - ws.onmessage - callback gdy otrzymano wiadomość
     * - ws.onclose - callback gdy połączenie zamknięte
     * - ws.onerror - callback gdy błąd
     */
    const ws = new WebSocket(url);

    // Zapisujemy referencję do użycia w innych miejscach
    wsRef.current = ws;

    // Ustawiamy status "connecting"
    setStatus("connecting");

    // ─────────────────────────────────────────────────────────────
    // EVENT: ONOPEN (połączenie nawiązane)
    // ─────────────────────────────────────────────────────────────

    /**
     * Wywoływany gdy połączenie WebSocket jest gotowe.
     *
     * DOPIERO TERAZ możemy wysyłać wiadomości!
     */
    ws.onopen = () => {
      console.log("✅ WebSocket: Połączenie nawiązane!");
      setStatus("connected");
    };

    // ─────────────────────────────────────────────────────────────
    // EVENT: ONMESSAGE (otrzymano wiadomość)
    // ─────────────────────────────────────────────────────────────

    /**
     * Wywoływany gdy serwer wyśle nam wiadomość.
     *
     * @param {MessageEvent} event - Obiekt eventu
     * @param {string} event.data - Dane otrzymane od serwera (string!)
     */
    ws.onmessage = (event) => {
      console.log("📨 WebSocket: Otrzymano wiadomość:", event.data);

      /**
       * event.data to ZAWSZE string (lub Blob/ArrayBuffer jeśli binary)
       *
       * My wysyłamy JSON, więc musimy sparsować:
       */
      try {
        const messageData = JSON.parse(event.data);

        /**
         * Dodajemy wiadomość do stanu
         *
         * ⚠️ WAŻNE: Używamy functional update!
         *
         * ❌ setMessages(messages.push(messageData))
         *    - mutuje oryginalną tablicę (bad practice)
         *    - push() zwraca length, nie tablicę
         *
         * ✅ setMessages(prev => [...prev, messageData])
         *    - tworzy NOWĄ tablicę (immutable)
         *    - React wykryje zmianę i zrobi re-render
         *    - prev zawsze ma aktualną wartość (nawet jeśli zmieniona w innym callbacku)
         */
        setMessages((prev) => [...prev, messageData]);
      } catch (error) {
        console.error("❌ Błąd parsowania JSON:", error);
      }
    };

    // ─────────────────────────────────────────────────────────────
    // EVENT: ONCLOSE (połączenie zamknięte)
    // ─────────────────────────────────────────────────────────────

    /**
     * Wywoływany gdy połączenie zostało zamknięte.
     *
     * @param {CloseEvent} event - Informacje o zamknięciu
     * @param {number} event.code - Kod zamknięcia (1000 = normalne)
     * @param {string} event.reason - Powód zamknięcia
     * @param {boolean} event.wasClean - Czy zamknięcie było "czyste"
     */
    ws.onclose = (event) => {
      console.log("❌ WebSocket: Połączenie zamknięte", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setStatus("disconnected");

      /**
       * 💡 TU można dodać auto-reconnect!
       *
       * if (!event.wasClean) {
       *   setTimeout(() => {
       *     // Próbuj połączyć ponownie
       *   }, 3000);
       * }
       */
    };

    // ─────────────────────────────────────────────────────────────
    // EVENT: ONERROR (błąd połączenia)
    // ─────────────────────────────────────────────────────────────

    /**
     * Wywoływany gdy wystąpi błąd.
     *
     * ⚠️ Po onerror zawsze następuje onclose!
     */
    ws.onerror = (error) => {
      console.error("💥 WebSocket: Błąd połączenia", error);
      // Możemy pokazać użytkownikowi komunikat o błędzie
    };

    // ─────────────────────────────────────────────────────────────
    // CLEANUP FUNCTION
    // ─────────────────────────────────────────────────────────────

    /**
     * Cleanup function wywoływany gdy:
     * 1. Komponent jest unmountowany
     * 2. useEffect ma się uruchomić ponownie (zmiana dependencies)
     *
     * ⚠️ TO JEST BARDZO WAŻNE!
     *
     * Jeśli nie zamkniemy WebSocket:
     * - Połączenie pozostanie otwarte (memory leak!)
     * - Serwer nadal będzie wysyłać wiadomości (marnowanie zasobów)
     * - Event listenery nie będą usunięte (memory leak!)
     *
     * Cleanup zapobiega tym problemom.
     */
    return () => {
      console.log("🧹 Cleanup: Zamykam połączenie WebSocket...");

      /**
       * Sprawdzamy czy połączenie jest otwarte
       *
       * readyState:
       * - WebSocket.CONNECTING (0)
       * - WebSocket.OPEN (1)
       * - WebSocket.CLOSING (2)
       * - WebSocket.CLOSED (3)
       */
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000, "Component unmounted"); // 1000 = normalne zamknięcie
      }
    };
  }, [url]); // ← Dependency array: re-run tylko gdy URL się zmieni

  // ═══════════════════════════════════════════════════════════════
  // FUNKCJA WYSYŁANIA WIADOMOŚCI
  // ═══════════════════════════════════════════════════════════════

  /**
   * Funkcja do wysyłania wiadomości na serwer
   *
   * @param {string} text - Treść wiadomości
   */
  const sendMessage = (text) => {
    /**
     * ⚠️ Zawsze sprawdzaj czy połączenie jest OPEN przed wysłaniem!
     *
     * Próba wysłania gdy readyState !== OPEN rzuci błąd:
     * "Failed to execute 'send' on 'WebSocket': Still in CONNECTING state"
     */
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      /**
       * Tworzymy obiekt wiadomości według naszego protokołu
       */
      const message = {
        type: "MESSAGE",
        payload: text,
        clientTimestamp: new Date().toISOString(),
      };

      /**
       * WebSocket.send() akceptuje:
       * - String
       * - Blob
       * - ArrayBuffer
       *
       * My wysyłamy JSON jako string:
       */
      wsRef.current.send(JSON.stringify(message));

      console.log("📤 Wysłano wiadomość:", message);
    } else {
      console.warn("⚠️ Nie można wysłać - WebSocket nie jest połączony!");
      console.log("ReadyState:", wsRef.current?.readyState);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RETURN - API HOOKA
  // ═══════════════════════════════════════════════════════════════

  /**
   * Hook zwraca obiekt z:
   * - status: aktualny stan połączenia (do wyświetlenia w UI)
   * - messages: tablica wiadomości (do wyrenderowania listy)
   * - sendMessage: funkcja do wysyłania (do przypiętej do buttona)
   */
  return {
    status,
    messages,
    sendMessage,
  };
}

/**
 * 🎓 KLUCZOWE WNIOSKI:
 *
 * 1. useRef dla WebSocket
 *    - Nie wywołuje re-renderów
 *    - Zachowuje referencję
 *
 * 2. useState dla UI
 *    - status → ikona
 *    - messages → lista
 *
 * 3. Cleanup jest KONIECZNY
 *    - ws.close() w return
 *    - Zapobiega memory leaks
 *
 * 4. Sprawdzaj readyState
 *    - Przed wysłaniem
 *    - Przed zamknięciem
 *
 * 5. Functional updates
 *    - setMessages(prev => [...prev, new])
 *    - Bezpieczne dla async callbacks
 *
 * 6. Try-catch dla JSON.parse
 *    - Serwer może wysłać coś niespodziewanego
 *    - Lepiej obsłużyć błąd niż crashować
 */
