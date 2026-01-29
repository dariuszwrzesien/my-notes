export function aboutView() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h1>O nas</h1>
    <p>Prosty szkielet SPA w vanilla JS: jeden plik HTML, router oparty o hash, kilka widoków.</p>
    <p>Idealny punkt wyjścia do nauki lub rozbudowy bez frameworków.</p>
  `;
  return section;
}
