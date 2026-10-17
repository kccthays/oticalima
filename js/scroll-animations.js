(() => {
  const root = document.documentElement;
  if (root.dataset.scrollAnimationsInitialized) return;
  root.dataset.scrollAnimationsInitialized = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const revealSelector = [
    ".section-heading", ".collection-top", ".interactive-heading",
    ".customizer-preview-column", ".customizer-controls", ".face-options",
    ".recommendation-intro", ".recommendation-card", ".category-card",
    ".product-card", ".about-photo", ".about-copy", ".gallery-heading",
    ".gallery-tile", ".contact-banner-inner", ".contact-intro",
    ".contact-details", ".contact-block"
  ].join(",");
  const groups = [
    ".category-grid", ".product-grid", ".face-options", ".recommendation-grid", ".gallery-grid"
  ];
  const parallaxEnabled = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)").matches;
  const parallaxImages = parallaxEnabled
    ? [...document.querySelectorAll(".hero-visual img, .about-photo img")]
    : [];
  const parallaxSet = new Set(parallaxImages);
  const revealItems = [...document.querySelectorAll(revealSelector)];

  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((group) => {
      [...group.children].forEach((item, index) => {
        item.style.setProperty("--scroll-delay", `${Math.min(index * 85, 425)}ms`);
      });
    });
  });

  const targets = new Set(revealItems);
  parallaxImages.forEach((image) => targets.add(image));
  const parallaxVisible = new Set();
  let scrollFrame = 0;

  const updateParallax = () => {
    scrollFrame = 0;
    parallaxVisible.forEach((image) => {
      const bounds = image.parentElement.getBoundingClientRect();
      const progress = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const offset = Math.max(-18, Math.min(18, progress * -18));
      image.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    });
  };
  const requestParallax = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateParallax);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;
      if (entry.isIntersecting) {
        target.classList.add("scroll-reveal", "is-visible");
        if (parallaxSet.has(target)) parallaxVisible.add(target);
        else observer.unobserve(target);
      } else {
        parallaxVisible.delete(target);
        target.style.removeProperty("--parallax-y");
      }
    });
    requestParallax();
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  targets.forEach((target) => {
    if (parallaxSet.has(target)) target.classList.add("scroll-parallax");
    if (!parallaxSet.has(target)) target.classList.add("scroll-reveal");
    observer.observe(target);
  });

  if (parallaxEnabled && parallaxImages.length) {
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
  }
})();
