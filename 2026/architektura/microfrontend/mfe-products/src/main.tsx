import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/**
 * Products MFE - Standalone entry point
 *
 * Ta strona jest używana tylko do testowania MFE w izolacji.
 * W produkcji MFE jest ładowany przez Host.
 */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
