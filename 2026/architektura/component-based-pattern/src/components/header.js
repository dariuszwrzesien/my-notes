export const HOST = "http://127.0.0.1:8080";

const homeLink = document.createElement("a");
homeLink.innerHTML = "Home";
homeLink.href = HOST;

const detailsLink = document.createElement("a");
detailsLink.innerHTML = "Details";
detailsLink.href = HOST + "/detail.html";

export const createHeader = () => {
  const header = document.createElement("header");
  header.appendChild(homeLink);
  header.appendChild(detailsLink);
  header.style.cssText = `
          display: flex;
          gap: 20px;
          background-color: #d1d1d1;
          padding: 20px;
          background-color:red;
        `;

  return header;
};
