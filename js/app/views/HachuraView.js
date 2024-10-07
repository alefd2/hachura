class HachuraView {
  constructor() {
    this.img = document.getElementById("image");
    this.hachuraContainer = document.getElementById("hachura-container");
    this.totalPageElement = document.getElementById("total-pages");
    this.toastContent = document.getElementById("toast");
    this.toastMessage = document.getElementById("toast-message");
    this.toastIcon = document.getElementById("toast-icon");
  }

  renderImage(base64Image) {
    this.img.src = base64Image;
    this.img.alt = "Imagem do documento";
    this.img.style.width = "auto";
    this.img.style.transition = "transform 0.3s ease";
    this.img.style.transformOrigin = "center center";
    this.img.style.boxShadow = "0 4px 22px rgba(0, 0, 0, 0.4)";
    this.img.style.borderRadius = "5px";
  }

  renderHachuras(hachuras) {
    this.hachuraContainer.innerHTML = "";
    hachuras.forEach((hachura, index) => {
      const hachuraElement = document.createElement("div");
      hachuraElement.style.position = "absolute";
      hachuraElement.id = hachura.id;
      hachuraElement.style.width = `${hachura.size.width}px`;
      hachuraElement.style.height = `${hachura.size.height}px`;
      hachuraElement.style.backgroundColor = hachura.color;
      hachuraElement.style.top = `${hachura.position.top}px`;
      hachuraElement.style.left = `${hachura.position.left}px`;
      hachuraElement.dataset.index = index;

      this.hachuraContainer.appendChild(hachuraElement);
    });
  }

  updateTotalPages(currentPage, totalPages) {
    this.totalPageElement.innerText = `${currentPage}/${totalPages}`;
  }

  showLoading(statusLoading = "STOP") {
    if (statusLoading == "START") {
      const loadingContainer = document.getElementById("isLoading");
      loadingContainer.style.display = "flex";
    } else if (statusLoading == "STOP") {
      const loadingContainer = document.getElementById("isLoading");
      loadingContainer.style.display = "none";
    }
  }

  showToast(message, type) {
    this.toastMessage.textContent = message;

    this.toastContent.className =
      type === "SUCCESS" ? "toast-success" : "toast-error";
    this.toastIcon.className =
      type === "SUCCESS" ? "fas fa-check-circle" : "fas fa-exclamation-circle";

    this.toastContent.classList.add("show");

    setTimeout(() => {
      this.toastContent.classList.remove("show");
    }, 5000);
  }
}

export default HachuraView;
