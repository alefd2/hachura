export function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  // Mostra o toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Remove o toast após 3 segundos
  setTimeout(() => {
    toast.classList.remove("show");
    document.body.removeChild(toast);
  }, 3000);
}
