/**
 * Centralny store – wzorzec state management.
 * Jedno źródło prawdy: stan jest w jednym miejscu, widoki subskrybują zmiany.
 */

let state = {
  count: 0,
};

const listeners = new Set();

/**
 * Zwraca aktualny stan (kopia, żeby nie mutować z zewnątrz).
 */
export function getState() {
  return { ...state };
}

/**
 * Ustawia fragment stanu i powiadamia wszystkich subskrybentów.
 * @param {Object} partial - Częściowy stan do scalenia (np. { count: state.count + 1 })
 */
export function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn(state));
}

/**
 * Subskrypcja zmian stanu – callback wywoływany przy każdej zmianie.
 * @param {function} listener - Funkcja(state) wywoływana po setState
 * @returns {function} unsubscribe - Funkcja do odsubskrybowania
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Akcja: zwiększa licznik o 1.
 */
export function increment() {
  setState({ count: state.count + 1 });
}

/**
 * Akcja: zmniejsza licznik o 1.
 */
export function decrement() {
  setState({ count: state.count - 1 });
}
