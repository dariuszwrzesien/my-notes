/**
 * 🚀 PUNKT WEJŚCIA APLIKACJI REACT
 *
 * Ten plik odpowiada za zamontowanie głównego komponentu App
 * w drzewie DOM przeglądarki.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/**
 * ReactDOM.createRoot() tworzy "root" Reacta w elemencie DOM.
 * Jest to nowe API wprowadzone w React 18.
 *
 * Dlaczego createRoot zamiast render?
 * - Umożliwia concurrent rendering (wydajność)
 * - Lepsze wsparcie dla Suspense
 * - Automatyczne batching aktualizacji
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  /**
   * React.StrictMode - tryb deweloperski
   *
   * Co robi?
   * - Wykrywa potencjalne problemy
   * - Ostrzega o przestarzałych API
   * - W DEV montuje komponenty 2x (wykrywa side-effects)
   *
   * ⚠️ WAŻNE dla WebSocket:
   * W StrictMode useEffect uruchomi się 2x w trybie dev!
   * To normalne i pomaga wykryć memory leaks.
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
