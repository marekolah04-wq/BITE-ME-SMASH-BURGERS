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

  const setPrice = (card) => {
    const priceEl = card.querySelector("[data-menu-price]");
    if (!priceEl) return;

    const lang = getLang();
    const variants = parseVariants(card);
    if (!variants.length) return;

    const selected = card.dataset.selected || card.dataset.default || variants[0].id;
    const v = variants.find((x) => String(x.id) === String(selected)) || variants[0];

    priceEl.textContent = priceForLang(v.prices, lang);
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

    // Klik na variant: přepne selected + cenu, a NIKDY neotevírá lightbox
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

        setPrice(card);

        // Pokud je otevřený lightbox a user klikl na variantu, nic se nemá dít samo.
        // Cena se aktualizuje až při dalším otevření lightboxu.
      });
    });
  };

  const initCard = (card) => {
    // default selected (pokud ještě není)
    const variants = parseVariants(card);
    if (!variants.length) return;

    if (!card.dataset.selected) {
      card.dataset.selected = card.dataset.default || variants[0].id;
    }

    renderButtons(card);
    setPrice(card);
  };

  const initAll = () => {
    document.querySelectorAll(".menu-card[data-variants]").forEach(initCard);
  };

  // 1) init na startu
  initAll();

  // 2) při změně jazyka: refresh button labely + ceny
  // language.js vždy uloží localStorage lang a zavolá applyTranslations.
  // My jen sledujeme změny localStorage (přes custom event).
  window.addEventListener("langchange", () => {
    document.querySelectorAll(".menu-card[data-variants]").forEach((card) => {
      renderButtons(card);
      setPrice(card);
    });
  });
})();