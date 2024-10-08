export const Model = (function () {
  let page = 1;
  let totalPages = 0;
  let hachuras = [];
  let hachuraId = Date.now();

  const TypeError = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
  };

  const TypeStatus = {
    START: "START",
    STOP: "STOP",
  };

  // buscar as imagens via API
  async function fetchImagesBase64(url, page) {
    try {
      const headers = new Headers({
        Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
        "Content-Type": "application/x-www-form-urlencoded",
      });

      const body = new URLSearchParams({
        page,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (response.ok) {
        const data = await response.json();
        const _totalPages = response.headers.get("total_page");
        totalPages = _totalPages || 0;
        return { data, totalPages: _totalPages };
      } else {
        throw new Error("Erro ao recuperar imagens");
      }
    } catch (error) {
      throw new Error("Erro ao recuperar imagens");
    }
  }

  // obter o array de hachuras
  function getHatches() {
    return hachuras;
  }

  function loadHatches(page) {
    const data = JSON.parse(localStorage.getItem("documentData")) || {
      pages: [],
    };

    // Limpa sempre o array local
    hachuras.length = 0;

    // Verifica se há páginas salvas
    if (!data.pages.length) {
      console.warn("Nenhuma página encontrada no localStorage.");
      return hachuras;
    }

    const pageData = data.pages.find((_page) => _page.id === page);

    if (pageData && pageData.hachuras) {
      hachuras.push(...pageData.hachuras);
      return hachuras;
    }

    console.warn(`Nenhuma hachura encontrada para a página ${page}`);
    return hachuras;
  }

  // salvar hachuras no localStorage
  function saveHatches(page) {
    const data = JSON.parse(localStorage.getItem("documentData")) || {
      pages: [],
    };

    const pageData = data.pages.find((_page) => _page.id === page);

    console.log(pageData);

    if (!pageData) {
      data.pages.push({ id: page, img: "", hachuras });
    } else {
      pageData.hachuras = hachuras;
    }
    localStorage.setItem("documentData", JSON.stringify(data));
  }

  // Função para adicionar hachuras ao array
  function addHatch(hachuraX, hachuraY, hachuraWidth, hachuraHeight) {
    const currentHachura = {
      id: hachuraId,
      position: { top: parseFloat(hachuraY), left: parseFloat(hachuraX) },
      size: {
        width: parseFloat(hachuraWidth),
        height: parseFloat(hachuraHeight),
      },
      color: "rgba(190, 15, 15, 0.3)",
    };
    hachuras.push(currentHachura);
  }

  // Função para remover hachura
  function removeHatch(index) {
    hachuras.splice(index, 1);
    // console.log("========= apos remover");
    // console.table(hachuras);
  }

  return {
    fetchImagesBase64,
    getHatches,
    loadHatches,
    saveHatches,
    addHatch,
    removeHatch,
  };
})();
