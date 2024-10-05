var page = "1";
const url = "https://api-hachuraservi1.websiteseguro.com/api/document";
let totalPages = 0;
const hachuras = [];

let isDrawing = false;
let startX, startY;
let hachuraElement = null;

const TypeError = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

// Função para buscar imagens base64
async function fetchImagesBase64(url, page) {
  try {
    const headers = new Headers({
      Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams({
      page,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (response.ok) {
      const data = await response.json();
      const _totalPages = response.headers.get("total_page");
      totalPages = _totalPages || 0;

      return { data, totalPages: _totalPages };
    } else {
      console.error("Erro ao recuperar imagens");
      showToast("Erro ao recuperar imagens do servidor!", TypeError.ERROR);
      throw new Error("Erro ao recuperar imagens");
    }
  } catch (error) {
    console.error("Erro:", error);
    showToast("Algo deu errado, tente novamente mais tarde!", TypeError.ERROR);
    throw new Error("Erro ao recuperar imagens");
  }
}

// Função para construir a imagem na tela e carregar as hachuras
async function contructImageInScrem() {
  try {
    const responseFetch = await fetchImagesBase64(url, page);

    if (responseFetch) {
      const base64Image = responseFetch.data.image;

      const img = document.getElementById("zoom-image");
      img.src = base64Image;
      img.alt = "Imagem do documento";
      img.style.width = "auto";
      img.style.transition = "transform 0.3s ease";
      img.style.transformOrigin = "center center";

      const container = document.getElementById("image-container");
      container.innerHTML = "";
      container.appendChild(img);

      const totalPageElement = document.getElementById("total-pages");
      totalPageElement.innerText = `${page}/${totalPages}`;

      loadHachuras();
    } else {
      showToast("Erro ao recuperar a imagem!", TypeError.ERROR);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

// Função para renderizar hachuras no documento
function renderShowHachuras() {
  const container = document.getElementById("hachura-container"); // Substitua pelo ID real
  if (!container) {
    console.error("Elemento 'hachura-container' não encontrado.");
    return;
  }

  // O resto do seu código para renderizar hachuras
  container.innerHTML = ""; // Limpa o container

  hachuras.forEach((hachura) => {
    const hachuraElement = document.createElement("div");
    hachuraElement.style.position = "absolute";
    hachuraElement.style.width = hachura.size;
    hachuraElement.style.height = hachura.size;
    hachuraElement.style.backgroundColor = hachura.color;
    hachuraElement.style.top = `${hachura.position.top}px`;
    hachuraElement.style.left = `${hachura.position.left}px`;
    container.appendChild(hachuraElement);
  });
}

// Função para salvar hachuras no localStorage
function saveHachuras() {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };

  const pageData = data.pages.find((p) => p.id === page);
  if (!pageData) {
    data.pages.push({ id: page, img: "", hachuras });
  } else {
    pageData.hachuras = hachuras;
  }

  localStorage.setItem("documentData", JSON.stringify(data));
}

// Função para carregar hachuras ao iniciar
function loadHachuras() {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };
  const pageData = data.pages.find((p) => p.id === page);

  if (pageData) {
    hachuras.length = 0; // Limpa array atual de hachuras
    hachuras.push(...pageData.hachuras); // Carrega hachuras da página atual
    renderShowHachuras(); // Renderiza as hachuras na tela
  }
}

// Função para adicionar hachuras
function addHachura(x, y) {
  const hachura = {
    id: Date.now(),
    position: { top: y, left: x },
    size: "10px",
    color: "red",
  };
  hachuras.push(hachura);
  renderShowHachuras();
  saveHachuras(); // Salva hachuras ao adicionar
}

// Configurar botão de edição de hachuras
document.getElementById("edit-button").addEventListener("click", () => {
  const editButton = document.getElementById("edit-button");

  if (editButton.innerText === "Editar Hachura") {
    editButton.style.backgroundColor = "red";
    editButton.innerText = "Salvar Hachura";

    const img = document.getElementById("zoom-image");
    img.style.pointerEvents = "none";

    // Adicionar eventos de mouse para desenhar a hachura
    img.addEventListener("mousedown", startDrawing);
    img.addEventListener("mousemove", draw);
    img.addEventListener("mouseup", stopDrawing);
  } else {
    editButton.style.backgroundColor = "";
    editButton.innerText = "Editar Hachura";
    const img = document.getElementById("zoom-image");
    img.style.pointerEvents = "auto";

    // Remover eventos de mouse após salvar
    img.removeEventListener("mousedown", startDrawing);
    img.removeEventListener("mousemove", draw);
    img.removeEventListener("mouseup", stopDrawing);
  }
});

/**
 * DRAW HACHURA
 */

function startDrawing(event) {
  isDrawing = true;
  startX = event.offsetX;
  startY = event.offsetY;

  hachuraElement = document.createElement("div");
  hachuraElement.style.position = "absolute";
  hachuraElement.style.border = "1px solid red";
  hachuraElement.style.pointerEvents = "none";
  document.getElementById("image-container").appendChild(hachuraElement);
}

function draw(event) {
  if (!isDrawing) return;

  const currentX = event.offsetX;
  const currentY = event.offsetY;

  // Calcula a largura e altura do retângulo
  const width = currentX - startX;
  const height = currentY - startY;

  // Atualiza a posição e tamanho do retângulo
  hachuraElement.style.left = `${Math.min(startX, currentX)}px`;
  hachuraElement.style.top = `${Math.min(startY, currentY)}px`;
  hachuraElement.style.width = `${Math.abs(width)}px`;
  hachuraElement.style.height = `${Math.abs(height)}px`;
}

function stopDrawing() {
  isDrawing = false;

  // Captura as coordenadas finais e chama a função addHachura ao salvar
  const img = document.getElementById("zoom-image");
  const rect = hachuraElement.getBoundingClientRect();

  const hachuraX = rect.left - img.getBoundingClientRect().left; // X relativo à imagem
  const hachuraY = rect.top - img.getBoundingClientRect().top; // Y relativo à imagem

  // Se o botão salvar for clicado, adiciona a hachura
  document.getElementById("edit-button").addEventListener("click", () => {
    addHachura(hachuraX, hachuraY);
    document.getElementById("image-container").removeChild(hachuraElement); // Remove o retângulo após salvar
  });
}

/**
 * MAIN
 */

async function mainImages() {
  await contructImageInScrem();
}

mainImages();

/**
 * =============== DEFAULT FUNCIONTS =============================
 */

// ========== TOAST

function showToast(message, type = "ERROR") {
  const toastContent = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const messageElement = document.getElementById("toast-message");

  messageElement.textContent = message;

  toastContent.className = "";

  if (type === TypeError.SUCCESS) {
    toastContent.classList.add("toast-success");
    icon.className = "fas fa-check-circle";
  } else if (type === TypeError.ERROR) {
    toastContent.classList.add("toast-error");
    icon.className = "fas fa-exclamation-circle";
  }

  toastContent.className += " show";

  // remover toast in screem
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 5000);
}

// =========== NAVIGATION PAGE

document.getElementById("prev-button").addEventListener("click", () => {
  if (page > 1) {
    page--;
    mainImages();
  }
});

document.getElementById("prev-ten-button").addEventListener("click", () => {
  if (page > 10) {
    page -= 10;
  } else {
    page = 1;
  }
  mainImages();
});

document.getElementById("next-button").addEventListener("click", () => {
  page++;
  mainImages();
});

document.getElementById("next-ten-button").addEventListener("click", () => {
  page += 10;
  mainImages();
});
