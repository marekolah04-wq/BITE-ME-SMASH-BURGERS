// Language dropdown (Variant A) + persistence (SVG flags)
(() => {
  const wrap = document.querySelector(".nav__lang");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  const label = document.getElementById("langLabel");
  const flagImg = document.getElementById("langFlag");

  if (!wrap || !btn || !menu || !label || !flagImg) return;

  const codes = { cs: "CZ", en: "EN", de: "DE" };
  const flagSrc = {
    cs: "assets/icons/cz.svg",
    en: "assets/icons/gb.svg",
    de: "assets/icons/de.svg",
  };

  const setLangUI = (lang) => {
    const safe = flagSrc[lang] ? lang : "cs";

    label.textContent = codes[safe];
    flagImg.src = flagSrc[safe];

    menu.querySelectorAll(".nav__langItem").forEach((b) => {
      const active = b.dataset.lang === safe;
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const open = () => {
    wrap.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    wrap.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggle = () => {
    if (wrap.classList.contains("is-open")) close();
    else open();
  };

  // Load saved language (or default cs)
  const saved = localStorage.getItem("lang") || "cs";
  setLangUI(saved);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  menu.addEventListener("click", (e) => {
    const item = e.target.closest(".nav__langItem");
    if (!item) return;

    const lang = item.dataset.lang || "cs";
    localStorage.setItem("lang", lang);
    setLangUI(lang);
    close();

    // později napojíme překlady: applyTranslations(lang)
  });

   // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

   // Close when clicking esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
