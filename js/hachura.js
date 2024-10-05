// Hachura.js
const hachuras = [];
let currentPage = 1; // Página atual

// Adiciona a hachura no documento
function addHachura(x, y) {
  const hachura = {
    id: Date.now(), // ID único baseado no timestamp
    position: { top: y, left: x },
    size: "10px",
    color: "red",
  };

  hachuras.push(hachura);
  renderHachuras();
  saveHachuras();
}

// Renderiza hachuras no documento
function renderHachuras() {
  const container = document.getElementById("hachura-container");
  container.innerHTML = ""; // Limpa o contêiner antes de renderizar novamente

  hachuras.forEach((hachura) => {
    const hachuraElement = document.createElement("div");
    hachuraElement.style.position = "absolute";
    hachuraElement.style.width = hachura.size;
    hachuraElement.style.height = hachura.size;
    hachuraElement.style.backgroundColor = hachura.color;
    hachuraElement.style.top = `${hachura.position.top}px`;
    hachuraElement.style.left = `${hachura.position.left}px`;

    // Adiciona um evento de clique para permitir a edição ou remoção
    hachuraElement.addEventListener("click", () => {
      // Exemplo de ação ao clicar na hachura
      alert(
        `Hachura clicada na posição: (${hachura.position.left}, ${hachura.position.top})`
      );
    });

    container.appendChild(hachuraElement);
  });
}

// Salva hachuras no localStorage
function saveHachuras() {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };

  const pageData = data.pages.find((page) => page.id === currentPage);
  if (!pageData) {
    data.pages.push({ id: currentPage, img: "", hachuras });
  } else {
    pageData.hachuras = hachuras; // Atualiza as hachuras da página atual
  }

  localStorage.setItem("documentData", JSON.stringify(data));
}

// Carrega hachuras ao iniciar
function loadHachuras() {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };
  const pageData = data.pages.find((page) => page.id === currentPage);

  if (pageData) {
    hachuras.push(...pageData.hachuras); // Carrega as hachuras da página atual
    renderHachuras();
  }
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  loadHachuras(); // Carrega hachuras ao iniciar

  const imageContainer = document.getElementById("image-container");
  imageContainer.addEventListener("click", (event) => {
    // Obtem as coordenadas do clique em relação ao contêiner
    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left; // Coordenada X
    const y = event.clientY - rect.top; // Coordenada Y
    addHachura(x, y);
  });
});
