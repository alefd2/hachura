class HachuraModel {
  constructor() {
    this.hachuras = [];
  }

  loadHachuras(page) {
    const data = JSON.parse(localStorage.getItem("documentData")) || {
      pages: [],
    };
    const pageData = data.pages.find((_page) => _page.id === page);
    if (pageData) {
      this.hachuras.length = 0;
      this.hachuras.push(...pageData.hachuras);
    } else {
      this.hachuras = [];
    }
  }

  addHachura(hachura) {
    this.hachuras.push(hachura);
    this.saveHachuras();
  }

  removeHachura(index) {
    this.hachuras.splice(index, 1);
    this.saveHachuras();
  }

  saveHachuras() {
    const data = JSON.parse(localStorage.getItem("documentData")) || {
      pages: [],
    };
    const pageData = data.pages.find((_page) => _page.id === this.currentPage);
    if (!pageData) {
      data.pages.push({
        id: this.currentPage,
        img: "",
        hachuras: this.hachuras,
      });
    } else {
      pageData.hachuras = this.hachuras;
    }
    localStorage.setItem("documentData", JSON.stringify(data));
  }
}

export default HachuraModel;
