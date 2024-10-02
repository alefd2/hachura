async function getImageBase64() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (response.ok) {
      const data = await response.json();
      const base64Image = data.image;

      const img = document.createElement("img");
      img.src = `data:image/png;base64,${base64Image}`;
      img.alt = "Imagem da API";
      img.style.width = "300px";

      const container = document.getElementById("image-container");
      container.innerHTML = "";
      container.appendChild(img);
    } else {
      console.error("Erro ao fazer a requisição:", response.status);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

getImageBase64();

async function fetchImages() {
  try {
    const url = "https://api-hachuraservi1.websiteseguro.com/api/document";
    const headers = new Headers({
      Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams({
      page: "1",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
  } catch (e) {}
}
