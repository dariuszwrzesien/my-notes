/**
 * Widok: Licznik (inkrementator).
 * Zmienia stan przez store; subskrybuje store, żeby odświeżyć wyświetlaną wartość.
 */

import { getState, increment, decrement, subscribe } from "../store.js";
import { navigate } from "../router.js";

export function counterView() {
  const section = document.createElement("section");
  section.className = "view-counter";

  const { count } = getState();

  section.innerHTML = `
    <h1>Licznik</h1>
    <p class="counter-desc">Stan jest w <strong>store</strong>. Kliknij przyciski – wartość aktualizuje się bez przeładowania. Na stronie <em>Rezultat</em> zobaczysz tę samą wartość.</p>
    <div class="counter-box">
      <span class="counter-value" aria-live="polite">${count}</span>
      <div class="counter-actions">
        <button type="button" class="btn btn-decrement" aria-label="Zmniejsz o 1">−</button>
        <button type="button" class="btn btn-increment" aria-label="Zwiększ o 1">+</button>
      </div>
    </div>
    <p><a href="#/result" class="link-result">Podejrzyj rezultat →</a></p>
  `;

  const valueEl = section.querySelector(".counter-value");
  const btnInc = section.querySelector(".btn-increment");
  const btnDec = section.querySelector(".btn-decrement");
  const linkResult = section.querySelector(".link-result");

  const unsubscribe = subscribe((newState) => {
    if (valueEl) valueEl.textContent = newState.count;
  });

  btnInc.addEventListener("click", () => increment());
  btnDec.addEventListener("click", () => decrement());
  linkResult.addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/result");
  });

  // Gdy opuszczamy widok (nawigacja), odsubskrybuj – inaczej wyciek pamięci
  section.addEventListener("view-teardown", unsubscribe);

  return section;
}
