import { Model as hatchModel } from "../models/HatchModel.js";
import { View as hatchView } from "../views/HatchView.js";

const url = "https://api-hachuraservi1.websiteseguro.com/api/document";

let isDrawing = false;
let isEdit = false;
let hachuraElement = null;
let startX, startY;
let hachuraX, hachuraY, hachuraWidth, hachuraHeight;
let page = 1;
let selectedColor = "#be0f0f";
let isBlur = false;

async function constructImageInScrem() {
  hatchView.showLoading("START");
  try {
    const responseFetch = await hatchModel.fetchImagesBase64(url, page);
    if (responseFetch) {
      const base64Image = responseFetch.data.image;

      // pega as o base64 manda para a view
      hatchView.renderImage(base64Image, page, responseFetch.totalPages);

      // pega as hachuras salvas no model e manda para a view
      const hatches = hatchModel.loadHatches(page);
      console.table(hatches);
      hatchView.renderHatches(hatches);
      setupHatchRemoval();
    }
  } catch (error) {
    console.error(error);
    hatchView.showToast("Erro ao recuperar a imagem!", "ERROR");
  } finally {
    hatchView.showLoading("STOP");
  }
}

function setupHatchRemoval() {
  const container = document.getElementById("hachura-container");

  container.addEventListener("mousedown", (event) => {
    if (event.button === 2 || event.button === 1) {
      const target = event.target;
      if (target && target.parentNode === container) {
        const index = Array.from(container.children).indexOf(target);

        if (index !== -1) {
          hatchModel.removeHatch(index);
          hatchModel.saveHatches(page);
          const hatches = hatchModel.loadHatches(page);
          hatchView.renderHatches(hatches);
        }
      }
      event.preventDefault();
    }
  });
}

// inicias o desenho e mostra em tempo real a hachura
function startDrawing(event) {
  const wrapperImage = document.getElementById("wrapper-image");
  const rect = wrapperImage.getBoundingClientRect();

  const hatchsExist = document.querySelectorAll("#hachura-container div");
  hatchsExist.forEach((hachura) => {
    hachura.style.pointerEvents = "none";
  });

  isDrawing = true;
  isEdit = true;

  const translateY = 0;
  const computedStyle = getComputedStyle(wrapperImage);
  const scale = parseFloat(computedStyle.transform.match(/matrix\(([^,]*)/)[1]);

  startX = (event.clientX - rect.left) / scale;
  startY = (event.clientY - rect.top) / scale;

  hachuraElement = document.createElement("div");
  hachuraElement.style.position = "absolute";
  hachuraElement.style.border = `1px solid ${selectedColor}`;
  hachuraElement.style.backgroundColor = selectedColor + "33";
  hachuraElement.style.pointerEvents = "none";
  hachuraElement.style.zIndex = hatchModel.getHatches().length + 1;
  if (isBlur) {
    hachuraElement.style.filter = "blur(5px)";
  }

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

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;

  const hachurasExistentes = document.querySelectorAll(
    "#hachura-container div"
  );
  hachurasExistentes.forEach((hachura) => {
    hachura.style.pointerEvents = "auto";
  });

  if (hachuraElement) {
    hatchModel.addHatch(
      hachuraX,
      hachuraY,
      hachuraWidth,
      hachuraHeight,
      hexToRgba(selectedColor),
      isBlur
    );
    hatchModel.saveHatches(page);
  }
}

// Função para alternar o modo de edição
function onEditHachuraClick() {
  const button = document.getElementById("edit-button");

  const img = document.getElementById("image");
  const toolBox = document.getElementById("tools-edit-box");

  const hachurasExistentes = document.querySelectorAll(
    "#hachura-container div"
  );
  if (!isEdit) {
    button.innerHTML = "Salvar Hachura";
    button.style.backgroundColor = "red";
    toolBox.style.display = "";
    img.addEventListener("mousedown", startDrawing);
    img.addEventListener("mousemove", draw);
    img.addEventListener("mouseup", stopDrawing);
    img.addEventListener("mouseleave", stopDrawing);

    hachurasExistentes.forEach((hachura) => {
      hachura.style.pointerEvents = "none";
    });
  } else {
    button.innerHTML = "Editar Hachura";
    button.style.backgroundColor = "";
    img.removeEventListener("mousedown", startDrawing);
    img.removeEventListener("mousemove", draw);
    img.removeEventListener("mouseleave", stopDrawing);
    toolBox.style.display = "none";
    hachurasExistentes.forEach((hachura) => {
      hachura.style.pointerEvents = "auto";
    });

    hatchModel.saveHatches(page);
  }
  isEdit = !isEdit;
}

function onNextPage(step = 1) {
  let totalPages = 1493;

  if (!isEdit) {
    const remainingPages = totalPages - page;

    if (remainingPages > 0) {
      page += Math.min(step, remainingPages);
      constructImageInScrem();
    } else {
      hatchView.showToast("Você já está na última página!", "INFO");
    }
  } else {
    hatchView.showToast("Salve ou termine a edição antes de avançar!", "ERROR");
  }
}

function onPrevPage(step = 1) {
  if (!isEdit) {
    if (page - step >= 1) {
      page -= step;
      constructImageInScrem();
    } else {
      page = 1;
      constructImageInScrem();
      hatchView.showToast("Você já está na primeira página!", "INFO");
    }
  } else {
    hatchView.showToast(
      "Salve ou termine a edição antes de retroceder!",
      "ERROR"
    );
  }
}

function hexToRgba(hex, alpha = 0.3) {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Event Listeners
document
  .getElementById("edit-button")
  .addEventListener("click", onEditHachuraClick);
document
  .getElementById("next-button")
  .addEventListener("click", () => onNextPage(1));
document
  .getElementById("prev-button")
  .addEventListener("click", () => onPrevPage(1));

document
  .getElementById("next-ten-button")
  .addEventListener("click", () => onNextPage(10));
document
  .getElementById("prev-ten-button")
  .addEventListener("click", () => onPrevPage(10));

document
  .getElementById("hachura-blur-checkbox")
  .addEventListener("input", (event) => {
    isBlur = event.target.checked;
  });

document
  .getElementById("hachura-color-picker")
  .addEventListener("input", (event) => {
    selectedColor = event.target.value;
  });

// Inicialização da página
constructImageInScrem();
