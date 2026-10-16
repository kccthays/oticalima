(() => {
  const config = window.OTICA_LIMA;
  const number = String(config.whatsappNumber || "").replace(/\D/g, "");
  const instagramUrl = config.instagramUrl;

  document.querySelectorAll(".wa-link").forEach((link) => {
    const message = link.dataset.message || "Olá! Gostaria de falar com a Ótica Lima.";
    if (number) {
      link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${link.textContent.trim()} — abre o WhatsApp em uma nova aba`);
    } else {
      link.href = instagramUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Fale com a Ótica Lima pelo Instagram — abre em uma nova aba");
    }
  });

  document.querySelectorAll(".instagram-link").forEach((link) => {
    link.href = instagramUrl;
  });
  document.querySelectorAll("[data-whatsapp-display]").forEach((node) => {
    node.textContent = config.whatsappDisplay;
  });
  document.querySelectorAll(".phone-link").forEach((link) => {
    if (number) link.href = `tel:+${number}`;
    else link.hidden = true;
  });
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    const business = JSON.parse(structuredData.textContent);
    if (number) business.telephone = `+${number}`;
    else delete business.telephone;
    structuredData.textContent = JSON.stringify(business);
  }

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
    nav.classList.toggle("is-open", !open);
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("is-open");
    });
  });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section-heading, .category-card, .product-card, .about-copy, .gallery-tile, .contact-block").forEach((item) => {
      item.classList.add("will-reveal");
      revealObserver.observe(item);
    });
  }
})();

