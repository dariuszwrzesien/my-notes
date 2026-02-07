/**
 * 🎨 GŁÓWNY KOMPONENT APLIKACJI
 *
 * Ten komponent to interfejs użytkownika aplikacji WebSocket.
 * Cała logika WebSocket jest w custom hooku useWebSocket.
 */

import { useState } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import "./App.css";

/**
 * URL serwera WebSocket
 *
 * ws:// - nieszyfrowany WebSocket (jak HTTP)
 * wss:// - szyfrowany WebSocket (jak HTTPS)
 *
 * W produkcji używaj wss://!
 */
const WEBSOCKET_URL = "ws://localhost:8080";

function App() {
  // ═══════════════════════════════════════════════════════════════
  // HOOKS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Nasz custom hook zarządza całym WebSocket
   * Dostajemy z niego tylko to czego potrzebujemy do UI
   */
  const { status, messages, sendMessage } = useWebSocket(WEBSOCKET_URL);

  /**
   * Local state dla inputa
   *
   * To jest LOKALNY stan (controlled component pattern)
   * Nie ma nic wspólnego z WebSocket!
   */
  const [inputValue, setInputValue] = useState("");

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obsługa wysyłania wiadomości
   *
   * @param {Event} e - Submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony

    // Nie wysyłaj pustych wiadomości
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue(""); // Czyść input po wysłaniu
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="app">
      {/* ──────────────────────────────────────────────────────── */}
      {/* HEADER                                                   */}
      {/* ──────────────────────────────────────────────────────── */}

      <header className="header">
        <h1>🔌 WebSocket Demo</h1>
        <p className="subtitle">
          Komunikacja w czasie rzeczywistym • Edukacyjna aplikacja
        </p>
      </header>

      {/* ──────────────────────────────────────────────────────── */}
      {/* STATUS POŁĄCZENIA                                        */}
      {/* ──────────────────────────────────────────────────────── */}

      <div className="status-container">
        <div className={`status status--${status}`}>
          {/* Dynamiczna ikona w zależności od statusu */}
          <span className="status-icon">
            {status === "connected" && "🟢"}
            {status === "connecting" && "🟡"}
            {status === "disconnected" && "🔴"}
          </span>
          <span className="status-text">
            {status === "connected" && "Połączono"}
            {status === "connecting" && "Łączenie..."}
            {status === "disconnected" && "Rozłączono"}
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* GŁÓWNY KONTENER                                          */}
      {/* ──────────────────────────────────────────────────────── */}

      <main className="main">
        {/* ──────────────────────────────────────────────────── */}
        {/* LISTA WIADOMOŚCI                                     */}
        {/* ──────────────────────────────────────────────────── */}

        <div className="messages-container">
          <h2>Wiadomości</h2>

          {messages.length === 0 ? (
            // Pusty stan
            <div className="empty-state">
              <p>📭 Brak wiadomości</p>
              <p className="hint">
                Wyślij pierwszą wiadomość lub otwórz aplikację w drugiej karcie!
              </p>
            </div>
          ) : (
            // Lista wiadomości
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  {/* Badge z typem wiadomości */}
                  <span
                    className={`message-type message-type--${msg.type.toLowerCase()}`}
                  >
                    {msg.type}
                  </span>

                  {/* Treść wiadomości */}
                  <p className="message-content">{msg.payload}</p>

                  {/* Timestamp */}
                  {msg.serverTimestamp && (
                    <span className="message-time">
                      {new Date(msg.serverTimestamp).toLocaleTimeString(
                        "pl-PL",
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────────── */}
        {/* FORMULARZ WYSYŁANIA                                  */}
        {/* ──────────────────────────────────────────────────── */}

        <div className="input-container">
          <h2>Wyślij wiadomość</h2>

          <form onSubmit={handleSubmit} className="input-form">
            {/* Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Wpisz wiadomość..."
              className="input"
              disabled={status !== "connected"} // Disable gdy nie połączono
            />

            {/* Button */}
            <button
              type="submit"
              className="button"
              disabled={status !== "connected" || !inputValue.trim()}
            >
              Wyślij 📤
            </button>
          </form>

          {/* Informacja gdy rozłączony */}
          {status === "disconnected" && (
            <p className="warning">
              ⚠️ Brak połączenia z serwerem. Sprawdź czy backend działa!
            </p>
          )}
        </div>
      </main>

      {/* ──────────────────────────────────────────────────────── */}
      {/* FOOTER - INFORMACJE                                      */}
      {/* ──────────────────────────────────────────────────────── */}

      <footer className="footer">
        <div className="info-box">
          <h3>💡 Jak to działa?</h3>
          <ul>
            <li>
              <strong>Otwórz tę stronę w wielu kartach</strong> - wszystkie
              zobaczą te same wiadomości!
            </li>
            <li>
              <strong>Sprawdź konsolę</strong> (F12) - znajdziesz tam
              szczegółowe logi
            </li>
            <li>
              <strong>Zamknij backend</strong> - zobacz jak aplikacja obsługuje
              rozłączenie
            </li>
          </ul>
        </div>

        <div className="tech-info">
          <p>
            Backend: <code>ws://localhost:8080</code> • Frontend:{" "}
            <code>React + Vite</code>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

/**
 * 🎓 KLUCZOWE KONCEPTY W TYM KOMPONENCIE:
 *
 * 1. Separation of Concerns
 *    - Logika WebSocket → useWebSocket hook
 *    - UI i interakcje → App component
 *
 * 2. Controlled Components
 *    - Input jest "kontrolowany" przez React state
 *    - value={inputValue} + onChange={...}
 *
 * 3. Conditional Rendering
 *    - {status === 'connected' && ...}
 *    - Różne ikony dla różnych statusów
 *
 * 4. Disabled State
 *    - Nie można wysłać gdy disconnected
 *    - Lepsze UX niż errory
 *
 * 5. Empty State
 *    - Komunikat gdy brak wiadomości
 *    - Prowadzi użytkownika (UX)
 *
 * 6. Accessibility
 *    - Semantyczne tagi (header, main, footer)
 *    - button type="submit"
 *    - Form z onSubmit (Enter działa!)
 *
 * 7. Key Prop
 *    - {messages.map((msg, index) => <div key={index}>...)}
 *    - React wie które elementy się zmieniły
 *    - W produkcji użyj unique ID zamiast index!
 */
