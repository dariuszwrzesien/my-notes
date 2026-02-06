import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/**
 * Host Entry Point
 *
 * UWAGA: Nie importujemy żadnych MFE tutaj!
 * MFE są ładowane lazy przez React Router.
 */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
