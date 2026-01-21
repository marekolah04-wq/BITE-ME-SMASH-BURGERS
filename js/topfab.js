  // Floating "back to top" button, shows only when scrolling up
  const topFab = document.getElementById("topFab");
  if (topFab) {
    let lastY = window.scrollY;
    let ticking = false;

    const showAt = 320;     // kdy to vůbec dává smysl ukázat
    const delta = 6;        // citlivost směru scrollu

    const updateFab = () => {
      const y = window.scrollY;
      const goingUp = y < lastY - delta;
      const goingDown = y > lastY + delta;

      if (y < showAt) {
        topFab.classList.remove("is-show");
      } else {
        if (goingUp) topFab.classList.add("is-show");
        if (goingDown) topFab.classList.remove("is-show");
      }

      lastY = y;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFab);
    }, { passive: true });

    topFab.addEventListener("click", () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
