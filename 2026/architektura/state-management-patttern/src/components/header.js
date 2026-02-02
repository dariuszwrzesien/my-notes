/**
 * Współdzielony header – ten sam na każdej „stronie”, bez przeładowania.
 */

export function createHeader(currentPath) {
  const header = document.createElement("header");
  header.className = "app-header";

  const nav = document.createElement("nav");

  const links = [
    { href: "#/counter", label: "Licznik" },
    { href: "#/result", label: "Rezultat" },
  ];

  links.forEach(({ href, label }) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    const path = href.slice(1) || "/";
    if (
      path === currentPath ||
      (path === "/" && (currentPath === "/" || currentPath === "/counter"))
    ) {
      a.classList.add("active");
    }
    nav.appendChild(a);
  });

  header.appendChild(nav);
  return header;
}
