export function homeView() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h1>Strona główna</h1>
    <p>To jest SPA w czystym JavaScript. Kliknij linki w menu – treść się zmienia <strong>bez przeładowania strony</strong>.</p>
    <p>Zalety: jedna ładowana strona, płynna nawigacja, współdzielony header, adres w pasku URL (#/ścieżka).</p>
  `;
  return section;
}
