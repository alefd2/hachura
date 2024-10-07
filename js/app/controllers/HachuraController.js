import {
  fetchImagesBase64,
  loadHatches,
  saveHatches,
  addHatch,
  removeHatch,
} from "../models/HachuraModel.js";
import {
  renderImage,
  renderHatches,
  showLoading,
  showToast,
} from "../views/HachuraView.js";

const url = "https://api-hachuraservi1.websiteseguro.com/api/document";

let isDrawing = false;
let isEdit = false;
let hachuraElement = null;
let startX, startY;
let hachuraX, hachuraY, hachuraWidth, hachuraHeight;

async function constructImageInScrem() {
  showLoading("START");
  try {
    const responseFetch = await fetchImagesBase64(url, page);
    if (responseFetch) {
      const base64Image = responseFetch.data.image;
      renderImage(base64Image, page, responseFetch.totalPages);
      const hachuras = loadHatches(page);
      renderHatches(hachuras);
    }
  } catch (error) {
    showToast("Erro ao recuperar a imagem!", "ERROR");
  } finally {
    showLoading("STOP");
  }
}

function setupHatchRemoval() {
  const container = document.getElementById("hachura-container");
  container.addEventListener("mousedown", (event) => {
    if (event.button === 2 || event.button === 1) {
      const target = event.target;
      if (target && target.parentNode === container) {
        const index = Array.from(container.children).indexOf(target);
        removeHatch(index);
        renderHatches(hachuras);
        saveHatches(page, hachuras);
        event.preventDefault();
      }
    }
  });
}

function startDrawing(event) {
  const wrapperImage = document.getElementById("wrapper-image");
  const rect = wrapperImage.getBoundingClientRect();
  const scale = parseFloat(
    getComputedStyle(wrapperImage).transform.match(/matrix\(([^,]*)/)[1]
  );

  startX = (event.clientX - rect.left) / scale;
  startY = (event.clientY - rect.top) / scale;

  hachuraElement = document.createElement("div");
  hachuraElement.style.position = "absolute";
  hachuraElement.style.border = "1px solid red";
  hachuraElement.style.backgroundColor = "rgba(190, 15, 15, 0.3)";
  hachuraElement.style.pointerEvents = "none";
  hachuraElement.style.zIndex = hachuras.length + 1;

  hachuraElement.style.left = `${startX}px`;
  hachuraElement.style.top = `${startY}px`;

  document.getElementById("hachura-container").appendChild(hachuraElement);
}

function draw(event) {
  if (!isDrawing) return;

  const wrapperImage = document.getElementById("wrapper-image");
  const containerRect = wrapperImage.getBoundingClientRect();
  const scale = parseFloat(
    getComputedStyle(wrapperImage).transform.match(/matrix\(([^,]*)/)[1]
  );

  const currentX = (event.clientX - containerRect.left) / scale;
  const currentY = (event.clientY - containerRect.top) / scale;

  hachuraX = Math.min(startX, currentX);
  hachuraY = Math.min(startY, currentY);
  hachuraWidth = Math.abs(currentX - startX);
  hachuraHeight = Math.abs(currentY - startY);

  hachuraElement.style.left = `${hachuraX}px`;
  hachuraElement.style.top = `${hachuraY}px`;
  hachuraElement.style.width = `${hachuraWidth}px`;
  hachuraElement.style.height = `${hachuraHeight}px`;
}

function finishDrawing() {
  isDrawing = false;
  if (hachuraElement) {
    addHatch(hachuraX, hachuraY, hachuraWidth, hachuraHeight);
    saveHatches(page, hachuras);
    renderHatches(hachuras);
  }
}

// Função para alternar o modo de edição
function onEditHachuraClick() {
  const button = document.getElementById("edit-button");
  if (!isEdit) {
    button.innerHTML = "Salvar Hachura";
    button.style.backgroundColor = "red";
    wrapperImage.addEventListener("mousedown", startDrawing);
    wrapperImage.addEventListener("mousemove", draw);
    wrapperImage.addEventListener("mouseup", finishDrawing);
  } else {
    button.innerHTML = "Editar Hachura";
    button.style.backgroundColor = "";
    wrapperImage.removeEventListener("mousedown", startDrawing);
    wrapperImage.removeEventListener("mousemove", draw);
    wrapperImage.removeEventListener("mouseup", finishDrawing);
    saveHatches(page, hachuras);
  }
  isEdit = !isEdit;
}

function onNextPage() {
  if (!isEdit) {
    page++;
    constructImageInScrem();
  } else {
    showToast("Salve ou termine a edição antes de avançar!", "ERROR");
  }
}

function onPrevPage() {
  if (!isEdit) {
    page--;
    constructImageInScrem();
  } else {
    showToast("Salve ou termine a edição antes de retroceder!", "ERROR");
  }
}

// Event Listeners
document
  .getElementById("edit-button")
  .addEventListener("click", onEditHachuraClick);
document.getElementById("next-button").addEventListener("click", onNextPage);
document.getElementById("prev-button").addEventListener("click", onPrevPage);

// Inicialização da página
constructImageInScrem();
