class HachuraController {
  constructor(service, model, view) {
    this.model = model;
    this.view = view;
    this.service = service;
    this.page = 1;
    this.totalPages = 0;
    this.isDrawing = false;
    this.isEdit = false;

    this.setupEventListeners();
  }

  async loadImages() {
    // faz o request para trazer a imagem
    this.view.showLoading("START");
    const { image, totalPages } = await this.service.fetchImagesBase64(
      this.page
    );

    // renderiza a imagem no view
    this.view.renderImage(image);

    // carregas as hachuras existentes no localstorage
    this.model.loadHachuras(this.page);

    // renderiza as hachuras
    this.view.renderHachuras(this.model.hachuras);

    // pega as hachuras salva lo cal no model e passa para a camada de view
    console.log(this.model.hachuras);

    // atualiza para a pageina atual
    this.view.updateTotalPages(this.page, totalPages);

    this.view.showLoading("STOP");
  }

  setupEventListeners() {
    document
      .getElementById("edit-button")
      .addEventListener("click", () => this.toggleEditMode());
    document
      .getElementById("prev-button")
      .addEventListener("click", () => this.changePage(-1));
    document
      .getElementById("next-button")
      .addEventListener("click", () => this.changePage(1));
    document
      .getElementById("next-ten-button")
      .addEventListener("click", () => this.changePage(10));
    document
      .getElementById("prev-ten-button")
      .addEventListener("click", () => this.changePage(-10));
    document
      .getElementById("hachura-container")
      .addEventListener("mousedown", (event) => this.handleHachuraClick(event));
  }

  toggleEditMode() {
    const editButton = document.getElementById("edit-button");
    const img = document.getElementById("image");

    if (editButton.innerText === "Editar Hachura" && !this.isDrawing) {
      editButton.style.backgroundColor = "red";
      editButton.innerText = "Salvar Hachura";
      img.addEventListener("mousedown", (event) => this.startDrawing(event));
      img.addEventListener("mousemove", (event) => this.draw(event));
      img.addEventListener("mouseup", () => this.stopDrawing());
      img.addEventListener("mouseleave", () => this.stopDrawing());
    } else {
      editButton.style.backgroundColor = "";
      editButton.innerText = "Editar Hachura";
      this.saveHachuras();
      img.removeEventListener("mousedown", (event) => this.startDrawing(event));
      img.removeEventListener("mousemove", (event) => this.draw(event));
      img.removeEventListener("mouseup", () => this.stopDrawing());
      img.removeEventListener("mouseleave", () => this.stopDrawing());
    }
  }

  async changePage(delta) {
    if (!this.isDrawing && !this.isEdit) {
      const newPage = this.page + delta;

      if (this.page === 1 && delta < 0) {
        this.view.showToast("Você já está na primeira página", "INFO");
      } else {
        this.page = newPage;
        await this.loadImages();
      }
    } else {
      this.view.showToast("Termine a sua edição", "ERROR");
    }
  }

  startDrawing(event) {
    this.isDrawing = true;
    const hachura = {
      id: Date.now(),
      position: { top: event.offsetY, left: event.offsetX },
      size: { width: 100, height: 100 },
      color: "rgba(255, 0, 0, 0.5)",
    };
    this.model.addHachura(hachura);
    this.view.renderHachuras(this.model.hachuras);
  }

  draw(event) {
    if (!this.isDrawing) return;

    const wrapperImage = document.getElementById("wrapper-image");
    const containerRect = wrapperImage.getBoundingClientRect();

    if (
      event.clientX < containerRect.left ||
      event.clientX > containerRect.right ||
      event.clientY < containerRect.top ||
      event.clientY > containerRect.bottom
    ) {
      return;
    }

    const computedStyle = getComputedStyle(wrapperImage);
    const scale = parseFloat(
      computedStyle.transform.match(/matrix\(([^,]*)/)[1]
    );

    const offsetX = (event.clientX - containerRect.left) / scale;
    const offsetY = (event.clientY - containerRect.top) / scale;

    const width = offsetX - startX;
    const height = offsetY - startY;
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
  }

  handleHachuraClick(event) {
    const index = event.target.dataset.index;
    if (index !== undefined) {
      this.model.removeHachura(index);
      this.view.renderHachuras(this.model.hachuras);
    }

    const hachurasExistentes = document.querySelectorAll(
      "#hachura-container div"
    );
    hachurasExistentes.forEach((hachura) => {
      hachura.style.pointerEvents = "auto";
    });

    this.model.addHachura();
  }

  saveHachuras() {
    this.model.saveHachuras();
    this.isEdit = false;
  }
}

export default HachuraController;
