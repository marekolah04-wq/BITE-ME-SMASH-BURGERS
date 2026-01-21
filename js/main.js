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

  // Reusable lightbox for anything with [data-lightbox]
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  const lbImg = lb.querySelector(".lightbox__img");
  const lbTitle = document.getElementById("lightboxTitle");
  const lbPrice = document.getElementById("lightboxPrice");
  const lbDesc = document.getElementById("lightboxDesc");
  const lbClose = lb.querySelector(".lightbox__close");

  let lastFocus = null;

  const openLightbox = (el) => {
    const full = el.dataset.full || "";
    const title = el.dataset.title || "";
    const price = el.dataset.price || "";
    const desc = el.dataset.desc || "";

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


  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-lightbox]");
    if (!card) return;


    if (e.target.closest("a")) return;

    openLightbox(card);
  });


  document.addEventListener("keydown", (e) => {
    if (lb.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      return;
    }

    if (e.key !== "Enter" && e.key !== " ") return;
    const active = document.activeElement;
    if (!active || !active.matches("[data-lightbox]")) return;

    e.preventDefault();
    openLightbox(active);
  });


  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });
});

// highliht today opening hours
const hoursRoot = document.querySelector("[data-hours]");
if (hoursRoot) {
  const today = new Date().getDay();
  const row = hoursRoot.querySelector(`[data-day="${today}"]`);
  if (row) row.classList.add("is-today");
}


// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();










