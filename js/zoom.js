document.addEventListener("DOMContentLoaded", function () {
  const img = document.getElementById("zoom-image");
  const container = document.getElementById("image-container");

  let scale = 1; // Valor inicial do zoom
  let isDragging = false; // Variável para verificar se está arrastando
  let startY = 0;
  let translateY = 0;

  const zoomStep = 0.1; // Passo do zoom
  const maxZoom = 1.8; // Zoom máximo
  const minZoom = 0.8; // Zoom mínimo

  // Função para centralizar a imagem
  function centerImage() {
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Ajusta a posição com base na escala atual da imagem
    const scaledHeight = imgRect.height * scale;

    // Calcula a posição central para a imagem dentro do contêiner
    translateY = (containerRect.height - scaledHeight) / 2;

    // Atualiza a transformação da imagem
    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  }

  // Função para calcular o zoom no local do cursor
  function zoom(e) {
    // Verifica se o mouse está sobre a imagem
    const rect = img.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return; // Se não estiver sobre a imagem, sai da função
    }

    e.preventDefault(); // Previne a rolagem da página

    // Obtém a posição do cursor em relação à imagem
    const offsetY = e.clientY - rect.top;

    // Zoom com base na rolagem do mouse
    if (e.deltaY < 0) {
      // Scroll para cima, aumenta o zoom
      if (scale < maxZoom) {
        scale += zoomStep;
      }
    } else {
      // Scroll para baixo, diminui o zoom
      if (scale > minZoom) {
        scale -= zoomStep;
      }
    }

    // Atualiza a transformação da imagem
    img.style.transformOrigin = `50% ${offsetY}px`;
    img.style.transform = `scale(${scale}) translateY(${translateY}px)`;

    // Chama a função de verificação de limites após o zoom
    checkBounds();
  }

  function checkBounds() {
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Limites para a parte superior e inferior da imagem
    const minTranslateY = containerRect.height - imgRect.height * scale + 20; // 20px acima da parte inferior do contêiner
    const maxTranslateY = 20; // 20px abaixo da parte superior do contêiner

    // Limitar translateY com base nos limites definidos
    translateY = Math.max(minTranslateY, Math.min(translateY, maxTranslateY));

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
      translateY = e.clientY - startY; // Atualiza a posição com base na posição do mouse
      img.style.transform = `scale(${scale}) translateY(${translateY}px)`; // Atualiza a transformação da imagem
      checkBounds(); // Verifica os limites após o arrasto
    }
  }

  function endDrag() {
    isDragging = false;
    container.classList.remove("grabbing");
  }

  container.addEventListener("wheel", zoom);
  container.addEventListener("mousedown", startDrag); // Inicia o arrasto ao pressionar o botão do mouse
  container.addEventListener("mousemove", drag); // Arrasta enquanto o botão do mouse estiver pressionado
  container.addEventListener("mouseup", endDrag); // Para o arrasto ao soltar o botão do mouse
  container.addEventListener("mouseleave", endDrag); // Para o arrasto se o mouse sair do contêiner
});
