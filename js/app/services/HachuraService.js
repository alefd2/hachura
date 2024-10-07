// js/app/service/ImageService.js
class HachuraService {
  constructor() {
    this.url = "https://api-hachuraservi1.websiteseguro.com/api/document";
    this.headers = new Headers({
      Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
      "Content-Type": "application/x-www-form-urlencoded",
    });
  }

  async fetchImagesBase64(page) {
    const body = new URLSearchParams({ page });

    const response = await fetch(this.url, {
      method: "POST",
      headers: this.headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error("Erro ao recuperar imagens");
    }

    const data = await response.json();
    const totalPages = response.headers.get("total_page");
    return { image: data.image, totalPages: totalPages || 0 };
  }
}
export default HachuraService;
