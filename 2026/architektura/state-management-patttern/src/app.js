/**
 * Główny punkt wejścia SPA.
 * Jedno ładowanie HTML – dalsza nawigacja bez przeładowania strony.
 */

import {
  init as initRouter,
  getView,
  getCurrentPath,
  register,
} from "./router.js";
import { createHeader } from "./components/header.js";
import { counterView } from "./views/counter.js";
import { resultView } from "./views/result.js";

register("/", counterView);
register("/counter", counterView);
register("/result", resultView);

const root = document.getElementById("root");
const main = document.createElement("main");
main.className = "app-main";

function renderHeader() {
  const header = createHeader(getCurrentPath());
  const existing = root.querySelector(".app-header");
  if (existing) existing.replaceWith(header);
  else root.insertBefore(header, root.firstChild);
}

function renderView(path) {
  // Pobierajemy aktualny widok
  const current = main.firstElementChild;
  // Wywołujemy zdarzenie teardown, aby widok mógł posprzątać (np. odsubskrybować listenery)
  if (current) current.dispatchEvent(new CustomEvent("view-teardown"));
  // Pobierajemy nowy widok
  const viewFn = getView(path);
  // Jeśli widok istnieje, tworzymy go, w przeciwnym razie tworzymy element p
  const content = viewFn ? viewFn() : document.createElement("p");
  if (content.classList) content.classList.add("view-enter");
  main.innerHTML = "";
  main.appendChild(content);
}

function onRouteChange(path) {
  renderHeader();
  renderView(path);
}

// Montowanie layoutu i start routera
root.appendChild(main);
initRouter(onRouteChange);
