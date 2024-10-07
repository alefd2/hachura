let page = 1;
let totalPages = 0;
let hachuras = [];
let hachuraId = Date.now();

export const TypeError = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

export const TypeStatus = {
  START: "START",
  STOP: "STOP",
};

// Função responsável por buscar as imagens via API
export async function fetchImagesBase64(url, page) {
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

// Função responsável por carregar hachuras do localStorage
export function loadHatches(page) {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };
  const pageData = data.pages.find((_page) => _page.id === page);
  if (pageData) {
    hachuras.length = 0;
    hachuras.push(...pageData.hachuras);
  }
  return hachuras;
}

// Função responsável por salvar hachuras no localStorage
export function saveHatches(page, hachuras) {
  const data = JSON.parse(localStorage.getItem("documentData")) || {
    pages: [],
  };
  const pageData = data.pages.find((_page) => _page.id === page);
  if (!pageData) {
    data.pages.push({ id: page, img: "", hachuras });
  } else {
    pageData.hachuras = hachuras;
  }
  localStorage.setItem("documentData", JSON.stringify(data));
}

// Função para adicionar hachuras ao array
export function addHatch(hachuraX, hachuraY, hachuraWidth, hachuraHeight) {
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
export function removeHatch(index) {
  hachuras.splice(index, 1);
}
