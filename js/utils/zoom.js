document.addEventListener("DOMContentLoaded", function () {
  const wrapperImage = document.getElementById("wrapper-image");
  const img = document.getElementById("image");
  const container = document.getElementById("image-container");

  let scale = 1;
  let isDragging = false;
  let startY = 0;
  let translateX = 0,
    translateY = 0;

  const zoomStep = 0.08;
  const maxZoom = 2.8;
  const minZoom = 0.7;

  let enableZoomAndDrag = true;

  const toggleDrag = (enabled) => {
    enableZoomAndDrag = enabled;

    if (enableZoomAndDrag) {
      img.addEventListener("mousedown", startDrag);
      img.addEventListener("mousemove", drag);
      img.addEventListener("mouseup", endDrag);
      img.addEventListener("mouseleave", endDrag);
    } else {
      img.removeEventListener("mousedown", startDrag);
      img.removeEventListener("mousemove", drag);
      img.removeEventListener("mouseup", endDrag);
      img.removeEventListener("mouseleave", endDrag);
    }
  };

  const toggleZoomAndDrag = (enabled) => {
    enableZoomAndDrag = enabled;

    if (enableZoomAndDrag) {
      img.addEventListener("wheel", zoom);
      img.addEventListener("mousedown", startDrag);
      img.addEventListener("mousemove", drag);
      img.addEventListener("mouseup", endDrag);
      img.addEventListener("mouseleave", endDrag);
    } else {
      img.removeEventListener("wheel", zoom);
      img.removeEventListener("mousedown", startDrag);
      img.removeEventListener("mousemove", drag);
      img.removeEventListener("mouseup", endDrag);
      img.removeEventListener("mouseleave", endDrag);
    }
  };

  const zoom = (e) => {
    e.preventDefault();

    // Define o tamanho máximo e mínimo do zoom
    if (scale >= maxZoom && e.deltaY < 0) {
      return;
    } else if (scale <= minZoom && e.deltaY > 0) {
      return;
    } else {
    }

    // Definir a quantidade de zoom
    const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= zoomAmount;

    // Ajustar a origem do zoom para o centro
    originX = 0.5;
    originY = 0.5;

    wrapperImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    wrapperImage.style.transformOrigin = `${originX * 100}% ${originY * 100}%`;
  };

  const startDrag = (e) => {
    if (!enableZoomAndDrag) return;
    const rect = wrapperImage.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    isDragging = true;
    startY = e.clientY - translateY;
    img.classList.add("grabbing");
    e.preventDefault();
  };

  const drag = (e) => {
    if (!isDragging) return;
    translateY = e.clientY - startY;

    originX = 0.5;
    originY = 0.5;
    wrapperImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    img.style.transformOrigin = `${originX * 100}% ${originY * 100}%`;
  };

  const endDrag = () => {
    isDragging = false;
    img.classList.remove("grabbing");
  };

  toggleZoomAndDrag(true);

  document.getElementById("edit-button").addEventListener("click", () => {
    if (enableZoomAndDrag) {
      toggleDrag(false);
    } else {
      toggleZoomAndDrag(true);
      toggleDrag(true);
    }
  });
});
