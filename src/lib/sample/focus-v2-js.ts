export const focusV2Js = `const cta = document.querySelector("#cta");
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
});

const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "浅色模式" : "深色模式";
});`;
