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
  // Lightbox (open ONLY by clicking photo)
  // =========================
  const lb = document.getElementById("lightbox");
  if (lb) {
    const lbImg = lb.querySelector(".lightbox__img");
    const lbTitle = document.getElementById("lightboxTitle");
    const lbPrice = document.getElementById("lightboxPrice");
    const lbDesc = document.getElementById("lightboxDesc");
    const lbClose = lb.querySelector(".lightbox__close");

    let lastFocus = null;

    const getLang = () => localStorage.getItem("lang") || "cs";
    const getPriceForLang = (prices, lang) => {
      if (!prices) return "";
      if (lang === "cs") return prices.cs || "";
      // EN + DE -> EUR
      if (lang === "de") return prices.de || prices.en || "";
      return prices.en || prices.de || "";
    };

    const openLightboxFromCard = (card) => {
      const full = card.dataset.full || "";
      const title = card.dataset.title || "";
      const desc = card.dataset.desc || "";

      // Cena: vezmi z aktuálně vybrané varianty v kartě
      let price = "";
      try {
        const variants = JSON.parse(card.dataset.variants || "[]");
        const selected = card.dataset.selected || card.dataset.default || "";
        const lang = getLang();
        const v = variants.find((x) => String(x.id) === String(selected)) || variants[0];
        price = v ? getPriceForLang(v.prices, lang) : "";
      } catch {
        price = "";
      }

      lastFocus = document.activeElement;

      lbImg.src = full;
      lbImg.alt = title ? `Fotka: ${title}` : "Fotka";
      lbTitle.textContent = title;
      lbPrice.textContent = price;
      lbDesc.textContent = desc;

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

      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    };

    // Klik: jen na fotku (data-open-lightbox), najdi parent card a otevři z něj
    document.addEventListener("click", (e) => {
      const media = e.target.closest("[data-open-lightbox]");
      if (!media) return;

      const card = media.closest(".menu-card");
      if (!card) return;

      openLightboxFromCard(card);
    });

    // ESC zavírá
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
    });

    lbClose.addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });

    // Expose helper, aby menu-variants.js mohl po změně varianty refreshnout cenu v lightboxu,
    // pokud je lightbox otevřený na té samé kartě.
    window.__openLightboxFromCard = openLightboxFromCard;
  }

  // Highlight today opening hours
  const hoursRoot = document.querySelector("[data-hours]");
  if (hoursRoot) {
    const today = new Date().getDay();
    const row = hoursRoot.querySelector(`[data-day="${today}"]`);
    if (row) row.classList.add("is-today");
  }
});