document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("is-loaded");
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll (později + jednorázově)
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -20% 0px" }
      );

      revealEls.forEach((el) => io.observe(el));
    }
  }

// =========================
// Lightbox, varianty uvnitř lightboxu + šipky předchozí, další
// =========================
const lb = document.getElementById("lightbox");
if (lb) {
  const lbImg = lb.querySelector(".lightbox__img");
  const lbTitle = document.getElementById("lightboxTitle");
  const lbPrice = document.getElementById("lightboxPrice");
  const lbDesc = document.getElementById("lightboxDesc");
  const lbClose = lb.querySelector(".lightbox__close");
  const lbVariants = document.getElementById("lightboxVariants");
  const btnPrev = lb.querySelector(".lightbox__nav--prev");
  const btnNext = lb.querySelector(".lightbox__nav--next");

  let lastFocus = null;

  // seznam všech menu karet pro šipky
  const cards = Array.from(document.querySelectorAll(".menu-card[data-lightbox]"));
  let currentIndex = -1;
  let currentCard = null;

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
    try { return JSON.parse(card.dataset.variants || "[]"); }
    catch { return []; }
  };

  const findVariant = (variants, id) =>
    variants.find(v => String(v.id) === String(id)) || variants[0] || null;

  const renderVariantsInLightbox = (card) => {
    if (!lbVariants) return;
    const variants = parseVariants(card);

    // když nejsou varianty, vyprázdni a hotovo
    if (!variants.length) {
      lbVariants.innerHTML = "";
      return;
    }

    const lang = getLang();
    const selected = card.dataset.selected || card.dataset.default || variants[0].id;
    card.dataset.selected = selected;

    // když je jen 1 varianta, klidně to skryjeme
    if (variants.length <= 1) {
      lbVariants.innerHTML = "";
      return;
    }

    lbVariants.innerHTML = variants.map(v => {
      const active = String(v.id) === String(selected);
      return `
        <button
          class="lightbox__variantBtn ${active ? "is-active" : ""}"
          type="button"
          data-variant="${String(v.id)}"
          aria-pressed="${active ? "true" : "false"}"
        >${labelForLang(v.labels, lang)}</button>
      `;
    }).join("");

    // click na variant v lightboxu
    lbVariants.querySelectorAll(".lightbox__variantBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = btn.dataset.variant;
        if (!id) return;

        card.dataset.selected = id;

        // update active state
        lbVariants.querySelectorAll(".lightbox__variantBtn").forEach(b => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });

        // přepni cenu a případně fotku (pokud varianta nese img/full)
        applyVariantToLightbox(card);
      });
    });
  };

  const applyVariantToLightbox = (card) => {
    const variants = parseVariants(card);
    const selected = card.dataset.selected || card.dataset.default || "";
    const v = findVariant(variants, selected);

    const lang = getLang();
    const price = v ? priceForLang(v.prices, lang) : "";

    // full image pro lightbox, preferuj variant.full, jinak card.dataset.full
    const full = (v && v.full) ? v.full : (card.dataset.full || "");
    const title = card.dataset.title || "";
    const desc = card.dataset.desc || "";

    if (full) lbImg.src = full;
    lbImg.alt = title ? `Fotka: ${title}` : "Fotka";
    lbTitle.textContent = title;
    lbPrice.textContent = price;
    lbDesc.textContent = desc;
  };

  const openLightboxFromCard = (card) => {
    currentCard = card;
    currentIndex = cards.indexOf(card);

    lastFocus = document.activeElement;

    // naplň title, desc, full, price podle vybrané varianty
    applyVariantToLightbox(card);

    // vykresli tlačítka variant do lightboxu
    renderVariantsInLightbox(card);

    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    lbClose.focus();
  };

  const closeLightbox = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");

    lbImg.src = "";
    lbImg.alt = "";
    lbTitle.textContent = "";
    lbPrice.textContent = "";
    lbDesc.textContent = "";
    if (lbVariants) lbVariants.innerHTML = "";

    currentCard = null;
    currentIndex = -1;

    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  };

  const goTo = (dir) => {
    if (!cards.length) return;
    if (currentIndex < 0) return;

    let next = currentIndex + dir;
    if (next < 0) next = cards.length - 1;
    if (next >= cards.length) next = 0;

    openLightboxFromCard(cards[next]);
  };

  // Klik jen na fotku, najdi parent card
  document.addEventListener("click", (e) => {
    const media = e.target.closest("[data-open-lightbox]");
    if (!media) return;

    const card = media.closest(".menu-card");
    if (!card) return;

    openLightboxFromCard(card);
  });

  // Šipky v UI
  if (btnPrev) btnPrev.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); goTo(-1); });
  if (btnNext) btnNext.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); goTo(1); });

  // ESC, šipky na klávesnici
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goTo(-1);
    if (e.key === "ArrowRight") goTo(1);
  });

  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Když změníš jazyk, přepočítej jen cenu a texty pro aktuální otevřenou kartu
  window.addEventListener("langchange", () => {
    if (!lb.classList.contains("is-open")) return;
    if (!currentCard) return;
    applyVariantToLightbox(currentCard);
    renderVariantsInLightbox(currentCard);
  });
}

  // Highlight today opening hours
  const hoursRoot = document.querySelector("[data-hours]");
  if (hoursRoot) {
    const today = new Date().getDay();
    const row = hoursRoot.querySelector(`[data-day="${today}"]`);
    if (row) row.classList.add("is-today");
  }
});