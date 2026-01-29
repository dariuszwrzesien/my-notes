/**
 * Prosty router hash-based (#/ścieżka).
 * Zalety: działa bez serwera, bez konfiguracji, jedna strona HTML.
 */

const routes = new Map();

/**
 * Register a new route
 * @param {string} path - The path to register
 * @param {function} viewFn - The function to call when the route is matched
 */
export function register(path, viewFn) {
  routes.set(path, viewFn);
}

/**
 * Get the current path from the hash
 * @returns {string} The current path
 */
export function getCurrentPath() {
  const hash = window.location.hash.slice(1) || "/";
  return hash.startsWith("/") ? hash : "/" + hash;
}

/**
 * Navigate to a new path
 * @param {string} path - The path to navigate to
 */
export function navigate(path) {
  window.location.hash = path.startsWith("/") ? path : "/" + path;
}

/**
 * Get the view function for a given path
 * @param {string} path - The path to get the view function for
 * @returns {function} The view function
 */
export function getView(path) {
  const normalized = path === "" ? "/" : path;
  return routes.get(normalized) ?? routes.get("/");
}

/**
 * Initialize the router
 * @param {function} onRouteChange - The function to call when the route changes
 */
export function init(onRouteChange) {
  window.addEventListener("hashchange", () => onRouteChange(getCurrentPath())); // Call the onRouteChange function when the hash changes
  onRouteChange(getCurrentPath());
}
