export const focusJs = `const cta = document.querySelector("#cta");
const originalText = cta.textContent;

cta.addEventListener("click", () => {
  if (cta.dataset.busy === "true") return;
  cta.dataset.busy = "true";
  cta.textContent = "欢迎加入 Focus ✦";
  cta.setAttribute("aria-live", "polite");

  window.setTimeout(() => {
    cta.textContent = originalText;
    cta.dataset.busy = "false";
  }, 2200);
});`;
