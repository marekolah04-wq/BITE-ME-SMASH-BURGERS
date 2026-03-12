// Menu variants in cards (pills) + CZK for CS, EUR for EN/DE
(() => {
  const getLang = () => localStorage.getItem("lang") || "cs";

  const priceForLang = (prices, lang) => {
    if (!prices) return "";
    if (lang === "cs") return prices.cs || "";
    if (lang === "de") return prices.de || prices.en || "";
    return prices.en || prices.de || "";
  };

  const labelForLang = (labels, lang) => {
    if (!labels) return "";
    if (lang === "cs") return labels.cs || "";
    if (lang === "de") return labels.de || labels.en || "";
    return labels.en || labels.de || "";
  };

  const parseVariants = (card) => {
    try {
      return JSON.parse(card.dataset.variants || "[]");
    } catch {
      return [];
    }
  };

  // Najde vybranou variantu podle card.dataset.selected (fallback na default)
  const getSelectedVariant = (card) => {
    const variants = parseVariants(card);
    if (!variants.length) return null;

    const selected = card.dataset.selected || card.dataset.default || variants[0].id;
    return variants.find((x) => String(x.id) === String(selected)) || variants[0];
  };

  // Aplikuje variantu: cena + obrazek v karte + zdroj pro lightbox
  const applyVariant = (card) => {
    const lang = getLang();
    const v = getSelectedVariant(card);
    if (!v) return;

    // 1) cena v kartě
    const priceEl = card.querySelector("[data-menu-price]");
    if (priceEl) priceEl.textContent = priceForLang(v.prices, lang);

    // 2) obrazek v kartě (pokud varianta obsahuje img/full)
    const imgEl = card.querySelector(".menu-card__img");
    if (imgEl && v.img) {
      imgEl.src = v.img;
    }

    // 3) lightbox zdroj: dáváme to na článek i na trigger element
    // (protože podle tvého main.js se může posílat do lightboxu element s data-open-lightbox)
    const fullSrc = v.full || v.img;
    if (fullSrc) {
      card.dataset.full = fullSrc;

      const trigger = card.querySelector("[data-open-lightbox]") || card;
      trigger.dataset.full = fullSrc;

      // bonus: ať lightbox vždycky bere správný title/desc/price, i když se kliká na trigger
      // title + desc už řeší language.js na card.dataset.title / card.dataset.desc
      if (card.dataset.title) trigger.dataset.title = card.dataset.title;
      if (card.dataset.desc) trigger.dataset.desc = card.dataset.desc;
      trigger.dataset.price = priceForLang(v.prices, lang);
    }
  };

  const renderButtons = (card) => {
    const wrap = card.querySelector("[data-menu-variants]");
    if (!wrap) return;

    const variants = parseVariants(card);

    // Pokud je jen 1 varianta, tlačítka nedáváme
    if (variants.length <= 1) {
      wrap.innerHTML = "";
      wrap.style.display = "none";
      return;
    }

    wrap.style.display = "";
    const lang = getLang();

    const selected = card.dataset.selected || card.dataset.default || variants[0].id;
    card.dataset.selected = selected;

    wrap.innerHTML = variants
      .map((v) => {
        const active = String(v.id) === String(selected);
        return `
          <button
            class="menu-variantBtn ${active ? "is-active" : ""}"
            type="button"
            data-variant="${String(v.id)}"
            aria-pressed="${active ? "true" : "false"}"
          >${labelForLang(v.labels, lang)}</button>
        `;
      })
      .join("");

    // Klik na variant: přepne selected + cenu + img, a NIKDY neotevírá lightbox
    wrap.querySelectorAll(".menu-variantBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = btn.dataset.variant;
        if (!id) return;

        card.dataset.selected = id;

        wrap.querySelectorAll(".menu-variantBtn").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });

        applyVariant(card);
      });
    });
  };

  const initCard = (card) => {
    const variants = parseVariants(card);
    if (!variants.length) return;

    if (!card.dataset.selected) {
      card.dataset.selected = card.dataset.default || variants[0].id;
    }

    renderButtons(card);
    applyVariant(card);
  };

  const initAll = () => {
    document.querySelectorAll(".menu-card[data-variants]").forEach(initCard);
  };

  // 1) init na startu
  initAll();

  // 2) při změně jazyka: refresh button labely + ceny (+ img/price do lightbox datasetu)
  window.addEventListener("langchange", () => {
    document.querySelectorAll(".menu-card[data-variants]").forEach((card) => {
      renderButtons(card);
      applyVariant(card);
    });
  });
})();