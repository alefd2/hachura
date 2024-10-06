document.addEventListener("DOMContentLoaded", function () {
  const img = document.getElementById("wrapper-image");
  const container = document.getElementById("image-container");

  let scale = 1;
  let isDragging = false;
  let startY = 0;
  let translateY = 0;

  const zoomStep = 0.08;
  const maxZoom = 1.8;
  const minZoom = 0.98;

  let enableZoomAndDrag = true;

  function toggleZoomAndDrag(enabled) {
    enableZoomAndDrag = enabled;

    if (enableZoomAndDrag) {
      container.addEventListener("wheel", zoom);
      container.addEventListener("mousedown", startDrag);
      container.addEventListener("mousemove", drag);
      container.addEventListener("mouseup", endDrag);
      container.addEventListener("mouseleave", endDrag);
    } else {
      container.removeEventListener("wheel", zoom);
      container.removeEventListener("mousedown", startDrag);
      container.removeEventListener("mousemove", drag);
      container.removeEventListener("mouseup", endDrag);
      container.removeEventListener("mouseleave", endDrag);
    }
  }

  function zoom(e) {
    if (!enableZoomAndDrag) return; // Check if zoom is enabled
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

    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    checkBounds();
  }

  function checkBounds() {
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const minTranslateY = containerRect.top - imgRect.top;
    const maxTranslateY = containerRect.bottom - imgRect.bottom;

    translateY = Math.max(maxTranslateY, Math.min(translateY, minTranslateY));
    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  }

  function startDrag(e) {
    if (!enableZoomAndDrag) return; // Check if drag is enabled
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
    startY = e.clientY - translateY;
    img.classList.add("grabbing");
    e.preventDefault();
  }

  function drag(e) {
    if (!isDragging) return;
    translateY = e.clientY - startY;
    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  }

  function endDrag() {
    isDragging = false;
    img.classList.remove("grabbing");
  }

  toggleZoomAndDrag(true);

  document.getElementById("edit-button").addEventListener("click", () => {
    if (enableZoomAndDrag) {
      toggleZoomAndDrag(false);
    } else {
      toggleZoomAndDrag(true);
    }
  });
});
