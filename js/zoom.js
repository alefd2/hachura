document.addEventListener("DOMContentLoaded", function () {
  const img = document.getElementById("zoom-image");
  const container = document.getElementById("image-container");

  let scale = 1;
  let isDragging = false;
  let startY = 0;
  let translateY = 0;

  const zoomStep = 0.1;
  const maxZoom = 1.8;
  const minZoom = 0.8;

  function zoom(e) {
    // Verifica se o mouse está sobre a imagem
    const rect = img.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    e.preventDefault();

    const offsetY = e.clientY - rect.top;

    if (e.deltaY < 0) {
      if (scale < maxZoom) {
        scale += zoomStep;
      }
    } else {
      if (scale > minZoom) {
        scale -= zoomStep;
      }
    }

    // Atualiza a transformação da imagem
    // img.style.transformOrigin = `50% ${offsetY}px`;
    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;

    checkBounds();
  }

  function checkBounds() {
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Limite superior: A parte superior da imagem não pode ultrapassar a parte superior do contêiner
    const minTranslateY = containerRect.top - imgRect.top;

    // Limite inferior: A parte inferior da imagem não pode ultrapassar a parte inferior do contêiner
    const maxTranslateY = containerRect.bottom - imgRect.bottom;

    // Limitar translateY com base nos limites definidos
    translateY = Math.max(maxTranslateY, Math.min(translateY, minTranslateY));

    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  }

  function startDrag(e) {
    // Verifica se o mouse está sobre a imagem
    const rect = img.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    isDragging = true;
    startY = e.clientY - translateY; // Ajusta a posição inicial
    container.classList.add("grabbing");

    e.preventDefault();
  }

  function drag(e) {
    if (isDragging) {
      translateY = e.clientY - startY;
      img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      // checkBounds();
    }
  }

  function endDrag() {
    isDragging = false;
    container.classList.remove("grabbing");
  }

  container.addEventListener("wheel", zoom);
  container.addEventListener("mousedown", startDrag);
  container.addEventListener("mousemove", drag);
  container.addEventListener("mouseup", endDrag);
  container.addEventListener("mouseleave", endDrag);
});
