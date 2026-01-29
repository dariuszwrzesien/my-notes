export function contactView() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h1>Kontakt</h1>
    <p>Tu mógłby być formularz lub dane kontaktowe. Widok ładuje się tak samo jak pozostałe – bez odświeżania całej strony.</p>
  `;
  return section;
}
