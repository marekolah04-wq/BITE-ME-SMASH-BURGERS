// Language dropdown (Variant A) + persistence + translations + auto-detect (first visit)
// Works with:
// - data-i18n on texts
// - menu cards having data-menu-id + data-variants (for variants/currency handled elsewhere)
// - lightbox reading card.dataset.title/desc (we update those here)
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

  const translations = {
    cs: {
      nav: { menu: "Menu", visit: "Navštívit", faq: "FAQ" },

      hero: {
        title: "STREET SMASH BURGERS",
        text: "Smash burgery, co tě trefí hned napoprvý.",
        nav: "Navigovat",
        call: "Zavolat",
        ig: "Instagram",
      },

      menu: {
        title: "Menu",
        lead: "Naše kompletní nabídka.",
        badgeFavorite: "Oblíbené",
        items: {
          classic: {
            title: "Classic Smash",
            desc: "Šťavnatý hovězí Angus, Cheddar, Dresing dle výběru, Karamelizovaná cibulka, Opečená slanina, Nakládaná okurka",
          },
          spicy: {
            title: "Spicy Smash🌶️",
            desc: "Šťavnatý hovězí Angus, Cheddar, Pálivý dresing, Karamelizovaná cibulka, Opečené chorizo, Nakládané jalapeno",
          },
          smashBox: {
            title: "SMASH BOX",
            desc: "Smash Burger Classic / Spicy + 150g Hranolky + Nápoj + Coleslaw",
          },
          chopped: {
            title: "Chopped Cheese",
            desc: "Legenda ulic New Yorku. Šťavnatý hovězí Angus nasekaný přímo na grilu s roztopeným cheddarem spolu s rajčetem a ledovým salátem v nadýchané bagetě.",
          },
          stripsBox: {
            title: "Strips Box",
            desc: "Kuřecí stripsy + 150g česnekových hranolek + dresing dle výběru",
          },
          nuggetsBox: {
            title: "Nuggets Box",
            desc: "Kuřecí nugetky + 150g česnekových hranolek + dresing dle výběru",
          },
        },
        list: {
          snacks: "Kuřecí snacky",
          stripsLine: "Kuřecí stripsy 3ks / 5ks, 129 Kč / 179 Kč",
          nuggetsLine: "Kuřecí nugetky 6ks / 9ks, 99 Kč / 139 Kč",
          dips: "Dresingy",
          dip1: "Bite Me Uzená Mayo",
          dip2: "Bite Me Chipotle Mayo",
          dip3: "Kečup",
          dip4: "Tatarka",
          sides: "Přílohy / Doplňky",
          side1: "150g Česnekové hranolky, 59 Kč",
          side2: "Coleslaw, 45 Kč",
        },
      },

      visit: {
        title: "Navštívit",
        lead: "Zastav se za námi osobně.",
        where: "Kde nás najdeš",
        hours: "Otevíračka",
        contact: "Kontakt",
        mapOpen: "Otevřít v Mapách",
        note: "Sleduj Instagram pro změny a speciály.",
        addressPlaceholder: "Sem doplň reálnou adresu, město",
      },

      labels: {
        phone: "Telefon",
        email: "Email",
        instagram: "Instagram",
      },

      hours: {
        mon: "Po",
        tue: "Út",
        wed: "St",
        thu: "Čt",
        fri: "Pá",
        sat: "So",
        sun: "Ne",
        closed: "Zavřeno",

        tueTime: "11:00, 19:00",
        wedTime: "11:00, 19:00",
        thuTime: "11:00, 19:00",
        friTime: "12:00, 21:00",
        satTime: "12:00, 21:00",
        sunTime: "11:00, 19:00",
      },

      faq: {
        title: "FAQ",
        lead: "Rychlé odpovědi na časté dotazy.",
        q1: "Máte alergeny?",
        a1a: "Seznam alergenů doplníme co nejdřív. Když spěcháš, zeptej se u okýnka, nebo napiš na Instagram",
        q2: "Dá se platit kartou?",
        a2: "Jo, platba kartou je v pohodě. Máme bezkontaktní terminál, takže můžeš přiložit kartu nebo použít mobilní peněženku. Hotovost samozřejmě bereme taky.",
        q3: "Jak dlouho trvá výdej?",
        a3: "Většinou pár minut. Když je špička a fronta, tak podle počtu lidí. Snažíme se jet rychle, ale ne odfláknutě.",
        q4: "Kde budou novinky a speciály?",
        a4a: "Nejrychlejší je Instagram,",
        a4b: "Tam budou limitky, změny a vše důležité.",
      },

      footer: {
        contact: "Kontakt",
        address: "Adresa",
        hours: "Otevíračka",
        hoursSummary: "Út–Čt 11:00–19:00, Pá–So 12:00–21:00, Ne 11:00–19:00",
        copySuffix: "BITE ME. Všechna práva vyhrazena.",
        madeby: "Vytvořil Marek Oláh",
        addressPlaceholder: "Sem doplň reálnou adresu, město",
      },
    },

    en: {
      nav: { menu: "Menu", visit: "Visit", faq: "FAQ" },

      hero: {
        title: "STREET SMASH BURGERS",
        text: "Smash burgers that hit you right from the first bite.",
        nav: "Navigate",
        call: "Call",
        ig: "Instagram",
      },

      menu: {
        title: "Menu",
        lead: "Our full menu.",
        badgeFavorite: "Popular",
        items: {
          classic: {
            title: "Classic Smash",
            desc: "Juicy Angus beef, cheddar, dip of your choice, caramelized onions, crispy bacon, pickles",
          },
          spicy: {
            title: "Spicy Smash🌶️",
            desc: "Juicy Angus beef, cheddar, spicy dip, caramelized onions, grilled chorizo, pickled jalapeño",
          },
          smashBox: {
            title: "SMASH BOX",
            desc: "Smash Burger Classic / Spicy + 150g fries + drink + coleslaw",
          },
          chopped: {
            title: "Chopped Cheese",
            desc: "A New York street legend. Juicy Angus beef chopped on the grill with melted cheddar, tomato, and iceberg lettuce in a soft baguette.",
          },
          stripsBox: {
            title: "Strips Box",
            desc: "Chicken strips + 150g garlic fries + dip of your choice",
          },
          nuggetsBox: {
            title: "Nuggets Box",
            desc: "Chicken nuggets + 150g garlic fries + dip of your choice",
          },
        },
        list: {
          snacks: "Chicken snacks",
          stripsLine: "Chicken strips 3 pcs / 5 pcs, €5.50 / €7.50",
          nuggetsLine: "Chicken nuggets 6 pcs / 9 pcs, €4.00 / €6.00",
          dips: "Dips",
          dip1: "Bite Me Smoked Mayo",
          dip2: "Bite Me Chipotle Mayo",
          dip3: "Ketchup",
          dip4: "Tartar sauce",
          sides: "Sides / Extras",
          side1: "150g garlic fries, €2.50",
          side2: "Coleslaw, €2.00",
        },
      },

      visit: {
        title: "Visit",
        lead: "Come see us in person.",
        where: "Find us",
        hours: "Opening hours",
        contact: "Contact",
        mapOpen: "Open in Maps",
        note: "Follow Instagram for changes and specials.",
        addressPlaceholder: "Add the real address here, city",
      },

      labels: {
        phone: "Phone",
        email: "Email",
        instagram: "Instagram",
      },

      hours: {
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        sun: "Sun",
        closed: "Closed",

        tueTime: "11:00–19:00",
        wedTime: "11:00–19:00",
        thuTime: "11:00–19:00",
        friTime: "12:00–21:00",
        satTime: "12:00–21:00",
        sunTime: "11:00–19:00",
      },

      faq: {
        title: "FAQ",
        lead: "Quick answers to common questions.",
        q1: "Allergens?",
        a1a: "We’ll add the allergen list as soon as possible. If you need it now, ask at the window or message us on Instagram",
        q2: "Can I pay by card?",
        a2: "Yep, card payment is no problem. We have a contactless terminal, so you can tap your card or use a mobile wallet. We also accept cash.",
        q3: "How long does it take?",
        a3: "Usually a few minutes. During peak time it depends on the queue. We try to be fast, but not sloppy.",
        q4: "Where will updates and specials be?",
        a4a: "Instagram is the fastest,",
        a4b: "Limited drops, changes, and everything important will be there.",
      },

      footer: {
        contact: "Contact",
        address: "Address",
        hours: "Opening hours",
        hoursSummary: "Tue–Thu 11:00–19:00, Fri–Sat 12:00–21:00, Sun 11:00–19:00",
        copySuffix: "BITE ME. All rights reserved.",
        madeby: "Built by Marek Oláh",
        addressPlaceholder: "Add the real address here, city",
      },
    },

    de: {
      nav: { menu: "Menü", visit: "Besuchen", faq: "FAQ" },

      hero: {
        title: "STREET SMASH BURGERS",
        text: "Smash Burger, die dich gleich beim ersten Biss treffen.",
        nav: "Navigation",
        call: "Anrufen",
        ig: "Instagram",
      },

      menu: {
        title: "Menü",
        lead: "Unsere komplette Auswahl.",
        badgeFavorite: "Beliebt",
        items: {
          classic: {
            title: "Classic Smash",
            desc: "Saftiges Angus-Rind, Cheddar, Dip nach Wahl, karamellisierte Zwiebeln, knuspriger Bacon, Essiggurke",
          },
          spicy: {
            title: "Spicy Smash🌶️",
            desc: "Saftiges Angus-Rind, Cheddar, scharfer Dip, karamellisierte Zwiebeln, gegrillte Chorizo, eingelegte Jalapeño",
          },
          smashBox: {
            title: "SMASH BOX",
            desc: "Smash Burger Classic / Spicy + 150g Pommes + Getränk + Coleslaw",
          },
          chopped: {
            title: "Chopped Cheese",
            desc: "Eine New Yorker Street-Legende. Saftiges Angus-Rind direkt auf dem Grill gehackt, mit geschmolzenem Cheddar, Tomate und Eisbergsalat im weichen Baguette.",
          },
          stripsBox: {
            title: "Strips Box",
            desc: "Chicken Strips + 150g Knoblauch-Pommes + Dip nach Wahl",
          },
          nuggetsBox: {
            title: "Nuggets Box",
            desc: "Chicken Nuggets + 150g Knoblauch-Pommes + Dip nach Wahl",
          },
        },
        list: {
          snacks: "Chicken Snacks",
          stripsLine: "Chicken Strips 3 Stk. / 5 Stk., €5,50 / €7,50",
          nuggetsLine: "Chicken Nuggets 6 Stk. / 9 Stk., €4,00 / €6,00",
          dips: "Dips",
          dip1: "Bite Me Smoked Mayo",
          dip2: "Bite Me Chipotle Mayo",
          dip3: "Ketchup",
          dip4: "Remoulade",
          sides: "Beilagen / Extras",
          side1: "150g Knoblauch-Pommes, €2,50",
          side2: "Coleslaw, €2,00",
        },
      },

      visit: {
        title: "Besuchen",
        lead: "Komm persönlich vorbei.",
        where: "So findest du uns",
        hours: "Öffnungszeiten",
        contact: "Kontakt",
        mapOpen: "In Maps öffnen",
        note: "Folge Instagram für Änderungen und Specials.",
        addressPlaceholder: "Hier die echte Adresse eintragen, Stadt",
      },

      labels: {
        phone: "Telefon",
        email: "E-Mail",
        instagram: "Instagram",
      },

      hours: {
        mon: "Mo",
        tue: "Di",
        wed: "Mi",
        thu: "Do",
        fri: "Fr",
        sat: "Sa",
        sun: "So",
        closed: "Geschlossen",

        tueTime: "11:00–19:00",
        wedTime: "11:00–19:00",
        thuTime: "11:00–19:00",
        friTime: "12:00–21:00",
        satTime: "12:00–21:00",
        sunTime: "11:00–19:00",
      },

      faq: {
        title: "FAQ",
        lead: "Kurze Antworten auf häufige Fragen.",
        q1: "Allergene?",
        a1a: "Die Allergenliste ergänzen wir so bald wie möglich. Wenn du sie jetzt brauchst, frag am Fenster oder schreib uns auf Instagram",
        q2: "Kartenzahlung möglich?",
        a2: "Ja, Kartenzahlung ist kein Problem. Wir haben ein kontaktloses Terminal, du kannst also Karte auflegen oder mit dem Handy zahlen. Bar nehmen wir natürlich auch.",
        q3: "Wie lange dauert die Ausgabe?",
        a3: "Meist nur ein paar Minuten. In der Stoßzeit je nach Schlange. Wir sind schnell, aber nicht schlampig.",
        q4: "Wo gibt es Updates und Specials?",
        a4a: "Am schnellsten über Instagram,",
        a4b: "Dort findest du Specials, Änderungen und alles Wichtige.",
      },

      footer: {
        contact: "Kontakt",
        address: "Adresse",
        hours: "Öffnungszeiten",
        hoursSummary: "Di–Do 11:00–19:00, Fr–Sa 12:00–21:00, So 11:00–19:00",
        copySuffix: "BITE ME. Alle Rechte vorbehalten.",
        madeby: "Erstellt von Marek Oláh",
        addressPlaceholder: "Hier die echte Adresse eintragen, Stadt",
      },
    },
  };

  const normalizeLang = (lang) => {
    if (lang === "cs" || lang === "en" || lang === "de") return lang;
    return "cs";
  };

  // Auto-detect only if there is NO saved language yet
  const detectPreferredLang = () => {
    const langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || "cs"];

    // Find first supported match
    for (const raw of langs) {
      const l = String(raw || "").toLowerCase();

      // match "de", "de-de" etc.
      if (l.startsWith("de")) return "de";
      if (l.startsWith("en")) return "en";
      if (l.startsWith("cs") || l.startsWith("cz")) return "cs";
    }
    return "cs";
  };

  const get = (lang, path) => {
    const src = translations[lang] || translations.cs;
    const fallback = translations.cs;

    const pick = (obj) =>
      path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);

    return pick(src) ?? pick(fallback) ?? "";
  };

  const applyTranslations = (lang) => {
    const safe = normalizeLang(lang);
    document.documentElement.lang = safe;

    // 1) texty
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = get(safe, key);
    });

    // 2) aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      el.setAttribute("aria-label", get(safe, key));
    });

    // 3) dataset pro lightbox (jen title + desc) podle data-menu-id
    document.querySelectorAll(".menu-card[data-menu-id]").forEach((card) => {
      const id = card.dataset.menuId;
      if (!id) return;

      card.dataset.title = get(safe, `menu.items.${id}.title`);
      card.dataset.desc = get(safe, `menu.items.${id}.desc`);
    });

    // 4) signal pro menu-variants (přepne labely + ceny)
    window.dispatchEvent(new Event("langchange"));

    return safe;
  };

  const setLangUI = (lang) => {
    const safe = normalizeLang(lang);

    label.textContent = codes[safe] || "CZ";
    flagImg.src = flagSrc[safe] || flagSrc.cs;

    menu.querySelectorAll(".nav__langItem").forEach((b) => {
      const active = b.dataset.lang === safe;
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    applyTranslations(safe);
  };

  const open = () => {
    wrap.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    wrap.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggle = () => (wrap.classList.contains("is-open") ? close() : open());

  // ===== Init language (auto-detect first visit) =====
  let saved = localStorage.getItem("lang");
  if (!saved) {
    saved = detectPreferredLang();
    localStorage.setItem("lang", saved);
  }
  setLangUI(saved);

  // ===== UI events =====
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  menu.addEventListener("click", (e) => {
    const item = e.target.closest(".nav__langItem");
    if (!item) return;

    const lang = normalizeLang(item.dataset.lang || "cs");
    localStorage.setItem("lang", lang);
    setLangUI(lang);
    close();
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();