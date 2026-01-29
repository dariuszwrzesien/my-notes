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
import { homeView } from "./views/home.js";
import { aboutView } from "./views/about.js";
import { contactView } from "./views/contact.js";

register("/", homeView);
register("/home", homeView);
register("/about", aboutView);
register("/contact", contactView);

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
  const viewFn = getView(path);
  const content = viewFn ? viewFn() : document.createElement("p");
  if (content.classList) content.classList.add("view-enter");
  main.innerHTML = "";
  main.appendChild(content);
}

function onRouteChange(path) {
  renderView(path);
}

// Montowanie layoutu i start routera
root.appendChild(main);
initRouter(onRouteChange);
