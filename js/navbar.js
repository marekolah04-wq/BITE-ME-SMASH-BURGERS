(() => {
  const nav = document.getElementById("nav");
  const hero = document.getElementById("hero");
  const heroLogo = document.getElementById("heroLogo");
  const navLogo = document.getElementById("navLogo");

  if (!nav || !hero || !heroLogo || !navLogo) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Smooth scroll offset nav
  const navOffset = () => nav.getBoundingClientRect().height + 10;

  document.querySelectorAll('.nav__link[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = window.scrollY + target.getBoundingClientRect().top - navOffset();
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      history.pushState(null, "", id);
    });
  });

  // Stav
  let inNav = false;
  let busy = false;

  // Kdy se přepne (cca když hero mizí)
const getTriggerY = () => {
  const r = hero.getBoundingClientRect();
  const heroTop = window.scrollY + r.top;
  return heroTop + 140;
};
  let triggerY = getTriggerY();

  const cloneFly = (fromEl, toEl, done) => {
    if (prefersReducedMotion) {
      done();
      return;
    }

    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();

    const clone = fromEl.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${from.left}px`;
    clone.style.top = `${from.top}px`;
    clone.style.width = `${from.width}px`;
    clone.style.height = `${from.height}px`;
    clone.style.margin = "0";
    clone.style.zIndex = "999";
    clone.style.pointerEvents = "none";
    clone.style.transformOrigin = "top left";

    document.body.appendChild(clone);

    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const sx = to.width / from.width;
    const sy = to.height / from.height;

    const anim = clone.animate(
      [
        { transform: "translate(0,0) scale(1,1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 1 }
      ],
      { duration: 520, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
    );

    anim.onfinish = () => {
      clone.remove();
      done();
    };
  };

  const toNav = () => {
    if (busy || inNav) return;
    busy = true;

    // Připrav místo pro logo v nav, menu se rozestoupí
    nav.classList.add("is-logo");

    // Změříme až po přepnutí layoutu, ať letí na správné místo
    requestAnimationFrame(() => {
      heroLogo.style.opacity = "1";
      navLogo.style.opacity = "0";

      cloneFly(heroLogo, navLogo, () => {
        heroLogo.style.opacity = "0";
        navLogo.style.opacity = "";
        inNav = true;
        busy = false;
      });
    });
  };

  const toHero = () => {
    if (busy || !inNav) return;
    busy = true;

    // Necháme logo v nav vidět během letu
    navLogo.style.opacity = "1";
    heroLogo.style.opacity = "0";

    requestAnimationFrame(() => {
      cloneFly(navLogo, heroLogo, () => {
        nav.classList.remove("is-logo");
        heroLogo.style.opacity = "1";
        navLogo.style.opacity = "";
        inNav = false;
        busy = false;
      });
    });
  };

  const onScroll = () => {
    if (window.scrollY > triggerY) toNav();
    else toHero();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    triggerY = getTriggerY();

  });

  onScroll();
})();
