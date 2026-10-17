(() => {
  const hero = document.querySelector(".hero");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!hero || motionPreference.matches) return;

  hero.classList.add("hero-motion-ready");
  window.requestAnimationFrame(() => hero.classList.add("is-entered"));

  if (!finePointer.matches) return;
  let pointerFrame = 0;
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = 0;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      const copy = hero.querySelector(".hero-copy");
      copy?.style.setProperty("--pointer-x", `${(x * 8).toFixed(1)}px`);
      copy?.style.setProperty("--pointer-y", `${(y * 5).toFixed(1)}px`);
      hero.style.setProperty("--pointer-image-x", `${(x * -9).toFixed(1)}px`);
      hero.style.setProperty("--pointer-image-y", `${(y * -7).toFixed(1)}px`);
    });
  });
  hero.addEventListener("pointerleave", () => {
    const copy = hero.querySelector(".hero-copy");
    copy?.style.setProperty("--pointer-x", "0px");
    copy?.style.setProperty("--pointer-y", "0px");
    hero.style.setProperty("--pointer-image-x", "0px");
    hero.style.setProperty("--pointer-image-y", "0px");
  });

  document.querySelectorAll(".category-card, .product-card, .gallery-tile").forEach((card) => {
    card.classList.add("motion-tilt");
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
})();
