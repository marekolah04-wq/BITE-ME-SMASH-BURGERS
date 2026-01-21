// FAQ Accordion (stable open/close), only one item open
(() => {
  const root = document.querySelector("[data-accordion]");
  if (!root) return;

  // pojistka proti dvojímu inicializování
  if (root.dataset.accordionInit === "1") return;
  root.dataset.accordionInit = "1";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 260;
  const items = Array.from(root.querySelectorAll(".faq__item"));

  const getParts = (item) => {
    const btn = item.querySelector(".faq__q");
    const panel = item.querySelector(".faq__a");
    return { btn, panel };
  };

  const clearTimer = (panel) => {
    if (panel._t) clearTimeout(panel._t);
    panel._t = null;
  };

  const closeItem = (item) => {
    const { btn, panel } = getParts(item);
    if (!btn || !panel) return;

    clearTimer(panel);

    btn.setAttribute("aria-expanded", "false");
    item.classList.remove("is-open");

    if (prefersReducedMotion) {
      panel.style.height = "0px";
      panel.hidden = true;
      return;
    }

    // nastav aktuální výšku, ať má animace odkud jet
    panel.hidden = false;
    panel.style.height = panel.scrollHeight + "px";

    // reflow, aby prohlížeč fakt viděl tu výšku jako start
    panel.offsetHeight;

    // animuj na 0
    panel.style.height = "0px";

    // po doběhnutí animace panel skryj
    panel._t = setTimeout(() => {
      panel.hidden = true;
    }, DURATION + 20);
  };

  const openItem = (item) => {
    const { btn, panel } = getParts(item);
    if (!btn || !panel) return;

    clearTimer(panel);

    btn.setAttribute("aria-expanded", "true");
    item.classList.add("is-open");

    if (prefersReducedMotion) {
      panel.hidden = false;
      panel.style.height = "";
      return;
    }

    panel.hidden = false;

    // start z 0
    panel.style.height = "0px";
    panel.offsetHeight;

    // animuj na výšku obsahu
    panel.style.height = panel.scrollHeight + "px";
  };

  const syncOpenHeights = () => {
    if (prefersReducedMotion) return;
    items.forEach((item) => {
      if (!item.classList.contains("is-open")) return;
      const { panel } = getParts(item);
      if (!panel || panel.hidden) return;
      panel.style.height = panel.scrollHeight + "px";
    });
  };

  const toggle = (item) => {
    const isOpen = item.classList.contains("is-open");

    // zavři ostatní, ať je vždy otevřená jen jedna
    items.forEach((it) => {
      if (it !== item && it.classList.contains("is-open")) closeItem(it);
    });

    if (isOpen) closeItem(item);
    else openItem(item);
  };

  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq__q");
    if (!btn || !root.contains(btn)) return;

    const item = btn.closest(".faq__item");
    if (!item) return;

    toggle(item);
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    const btn = e.target.closest(".faq__q");
    if (!btn || !root.contains(btn)) return;

    e.preventDefault();

    const item = btn.closest(".faq__item");
    if (!item) return;

    toggle(item);
  });

  // když se změní šířka stránky, přepočítej výšky otevřeného panelu
  window.addEventListener("resize", syncOpenHeights);
})();
