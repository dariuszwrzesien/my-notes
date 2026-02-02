/**
 * Widok: Rezultat – podgląd stanu z store.
 * Nie zmienia stanu; przy wejściu na stronę czyta getState() i pokazuje aktualną wartość.
 */

import { getState } from "../store.js";
import { navigate } from "../router.js";

export function resultView() {
  const section = document.createElement("section");
  section.className = "view-result";

  const { count } = getState();

  section.innerHTML = `
    <h1>Rezultat</h1>
    <p class="result-desc">Ta strona tylko <strong>odczytuje</strong> stan z store. Wartość licznika jest współdzielona w całej aplikacji.</p>
    <div class="result-box">
      <span class="result-label">Aktualna wartość licznika:</span>
      <span class="result-value" aria-live="polite">${count}</span>
    </div>
    <p><a href="#/counter" class="link-counter">← Wróć do licznika</a></p>
  `;

  const linkCounter = section.querySelector(".link-counter");
  linkCounter.addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/counter");
  });

  return section;
}
