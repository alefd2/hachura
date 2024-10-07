// Funções responsáveis pela interface gráfica (View)

export function renderImage(base64Image, page, totalPages) {
  const img = document.getElementById("image");
  img.src = base64Image;
  img.alt = "Imagem do documento";
  img.style.width = "auto";
  img.style.transition = "transform 0.3s ease";
  img.style.transformOrigin = "center center";
  img.style.boxShadow = "0 4px 22px rgba(0, 0, 0, 0.4)";
  img.style.borderRadius = "5px";

  const totalPageElement = document.getElementById("total-pages");
  totalPageElement.innerText = `${page}/${totalPages}`;
}

export function renderHatches(hachuras) {
  const container = document.getElementById("hachura-container");
  container.innerHTML = "";

  hachuras.forEach((hachura, index) => {
    const hachuraElement = document.createElement("div");
    hachuraElement.style.position = "absolute";
    hachuraElement.id = hachura.id;
    hachuraElement.style.width = `${hachura.size.width}px`;
    hachuraElement.style.height = `${hachura.size.height}px`;
    hachuraElement.style.backgroundColor = hachura.color;
    hachuraElement.style.top = `${hachura.position.top}px`;
    hachuraElement.style.left = `${hachura.position.left}px`;

    hachuraElement.addEventListener("mousedown", (event) => {
      if (event.button === 2 || event.button === 1) {
        removeHatch(index);
        event.preventDefault();
      }
    });

    container.appendChild(hachuraElement);
  });
}

// Mostrar/ocultar loading
export function showLoading(statusLoading) {
  const loadingContainer = document.getElementById("isLoading");
  if (statusLoading === "START") {
    loadingContainer.style.display = "flex";
  } else {
    loadingContainer.style.display = "none";
  }
}

// Função para exibir um toast com mensagem
export function showToast(message, type) {
  const toastContent = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const messageElement = document.getElementById("toast-message");

  messageElement.textContent = message;

  toastContent.className = "";
  if (type === "SUCCESS") {
    toastContent.classList.add("toast-success");
    icon.className = "fas fa-check-circle";
  } else {
    toastContent.classList.add("toast-error");
    icon.className = "fas fa-exclamation-circle";
  }

  toastContent.className += " show";
  setTimeout(() => {
    toastContent.className = toastContent.className.replace("show", "");
  }, 5000);
}
