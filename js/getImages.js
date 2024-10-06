var page = 1;
const url = "https://api-hachuraservi1.websiteseguro.com/api/document";
let totalPages = 0;
let hachuras = [];

let hachuraX;
let hachuraY;
let hachuraWidth;
let hachuraHeight;

let isDrawing = false;
let startX, startY;
let hachuraElement = null;

const TypeError = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const TypeStatus = {
  START: "START",
  STOP: "STOP",
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
  showLoading(TypeStatus.START);
  try {
    const responseFetch = await fetchImagesBase64(url, page);

    if (responseFetch) {
      const base64Image = responseFetch.data.image;

      const img = document.getElementById("image");
      img.src = base64Image;
      img.alt = "Imagem do documento";
      img.style.width = "auto";
      img.style.transition = "transform 0.3s ease";
      img.style.transformOrigin = "center center";

      // container.innerHTML = "";

      const totalPageElement = document.getElementById("total-pages");
      totalPageElement.innerText = `${page}/${totalPages}`;

      loadHachuras();
    } else {
      showToast("Erro ao recuperar a imagem!", TypeError.ERROR);
    }
    showLoading(TypeStatus.STOP);
  } catch (error) {
    console.error("Erro:", error);
    showLoading(TypeStatus.STOP);
  } finally {
    showLoading(TypeStatus.STOP);
  }
}

function loadHachuras() {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };
  const pageData = data.pages.find((_page) => _page.id === page);

  if (pageData) {
    hachuras.length = 0;
    hachuras.push(...pageData.hachuras);
    renderShowHachuras();
    return;
  }

  hachuras = [];
  renderShowHachuras();
}

// Função para renderizar hachuras no documento
function renderShowHachuras() {
  const container = document.getElementById("hachura-container");
  container.innerHTML = "";

  hachuras.forEach((hachura) => {
    const hachuraElement = document.createElement("div");
    hachuraElement.style.position = "absolute";
    hachuraElement.style.width = `${hachura.size.width}px`;
    hachuraElement.style.height = `${hachura.size.height}px`;
    hachuraElement.style.backgroundColor = hachura.color;
    hachuraElement.style.top = `${hachura.position.top}px`;
    hachuraElement.style.left = `${hachura.position.left}px`;
    container.appendChild(hachuraElement);
  });
}

// Função para adicionar hachuras
function addHachura() {
  const currentHachura = {
    id: Date.now(),
    position: { top: parseFloat(hachuraY), left: parseFloat(hachuraX) },
    size: {
      width: parseFloat(hachuraWidth),
      height: parseFloat(hachuraHeight),
    },
    color: "rgba(190, 15, 15, 0.3)",
  };

  hachuras.push(currentHachura);

  // saveHachuras();
}

async function saveHachuras() {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };

  const pageData = data.pages.find((_page) => _page.id === page);
  if (!pageData) {
    data.pages.push({ id: page, img: "", hachuras });
  } else {
    pageData.hachuras = hachuras; // Atualiza as hachuras para a página atual
  }

  localStorage.setItem("documentData", JSON.stringify(data)); // Salva no localStorage
}

// Configurar botão de edição de hachuras
const editButton = document.getElementById("edit-button");
editButton.addEventListener("click", async () => {
  const img = document.getElementById("image");

  if (editButton.innerText === "Editar Hachura" && !isDrawing) {
    editButton.style.backgroundColor = "red";
    editButton.innerText = "Salvar Hachura";

    img.addEventListener("mousedown", startDrawing);
    img.addEventListener("mousemove", draw);
    img.addEventListener("mouseup", stopDrawing);
    img.addEventListener("mouseleave", stopDrawing);
  } else {
    editButton.style.backgroundColor = "";
    editButton.innerText = "Editar Hachura";

    await saveHachuras();

    img.removeEventListener("mousedown", startDrawing);
    img.removeEventListener("mousemove", draw);
    img.removeEventListener("mouseup", stopDrawing);
    img.removeEventListener("mouseleave", stopDrawing);
  }
});

/**
 * ====== DRAW HATCH
 */

function startDrawing(event) {
  const img = document.getElementById("wrapper-image");
  const rect = img.getBoundingClientRect();

  // Verifica se o mouse está dentro da imagem
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) {
    return;
  }

  isDrawing = true;
  startX = event.offsetX;
  startY = event.offsetY;

  // Cria o elemento de hachura e adiciona ao container
  hachuraElement = document.createElement("div");
  hachuraElement.style.position = "absolute";
  hachuraElement.style.border = "1px solid red";
  hachuraElement.style.pointerEvents = "none";
  hachuraElement.style.backgroundColor = "rgba(190, 15, 15, 0.3)";

  document.getElementById("hachura-container").appendChild(hachuraElement);
}

function draw(event) {
  if (!isDrawing) return;

  const hachuraContainer = document.getElementById("wrapper-image");
  const img = document.getElementById("image");
  const containerRect = hachuraContainer.getBoundingClientRect();

  // Verifica se o mouse está dentro da imagem
  if (
    event.clientX < containerRect.left ||
    event.clientX > containerRect.right ||
    event.clientY < containerRect.top ||
    event.clientY > containerRect.bottom
  ) {
    return;
  }

  // Calcula a posição relativa à imagem
  const currentX = event.clientX - containerRect.left;
  const currentY = event.clientY - containerRect.top;

  // Calcula a largura e altura do retângulo
  const width = currentX - startX;
  const height = currentY - startY;

  hachuraX = `${Math.min(startX, currentX)}px`;
  hachuraY = `${Math.min(startY, currentY)}px`;
  hachuraWidth = `${Math.abs(width)}px`;
  hachuraHeight = `${Math.abs(height)}px`;

  // // Atualiza a posição e tamanho do retângulo
  hachuraElement.style.left = hachuraX;
  hachuraElement.style.top = hachuraY;
  hachuraElement.style.width = hachuraWidth;
  hachuraElement.style.height = hachuraHeight;
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  addHachura();
  // document.getElementById("hachura-container").removeChild(hachuraElement);
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

// ========== LOADING ======

function showLoading(statusLoading = TypeStatus.STOP) {
  if (statusLoading == TypeStatus.START) {
    const loadingContainer = document.getElementById("isLoading");
    loadingContainer.style.display = "flex";
  } else if (statusLoading == TypeStatus.STOP) {
    const loadingContainer = document.getElementById("isLoading");
    loadingContainer.style.display = "none";
  }
}

// ========== TOAST ======

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

  // remover toast em screem
  setTimeout(() => {
    toastContent.className = toastContent.className.replace("show", "");
  }, 5000);
}

// =========== NAVIGATION PAGE ======
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
