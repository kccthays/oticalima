(() => {
const { FRAME_COLORS, FRAME_SHAPES, LENS_TYPES, renderFrameSvg } = window.OTICA_LIMA_FRAMES || {};

const root = document.querySelector("[data-frame-customizer]");
if (root) {
  const state = { shape: "round", color: "black", lens: "clear", purpose: "degree" };
  const preview = root.querySelector("[data-frame-preview]");
  const shapeOptions = root.querySelector("[data-shape-options]");
  const colorOptions = root.querySelector("[data-color-options]");
  const lensOptions = root.querySelector("[data-lens-options]");
  const purposeOptions = root.querySelector("[data-purpose-options]");
  const summary = root.querySelector("[data-configuration-summary]");
  const whatsappLink = root.querySelector("[data-customizer-whatsapp]");
  const resetButton = root.querySelector("[data-reset-customizer]");
  const whatsappNumber = String(window.OTICA_LIMA?.whatsappNumber || "").replace(/\D/g, "");
  const purposes = [
    { id: "degree", label: "De grau" },
    { id: "sun", label: "De sol" },
    { id: "frame", label: "Só armação" }
  ];

  const selected = () => ({
    shape: FRAME_SHAPES.find((item) => item.id === state.shape),
    color: FRAME_COLORS.find((item) => item.id === state.color),
    lens: LENS_TYPES.find((item) => item.id === state.lens)
  });

  shapeOptions.innerHTML = FRAME_SHAPES.map((shape) => `
    <button class="shape-option" type="button" data-shape="${shape.id}" aria-pressed="${shape.id === state.shape}">
      <span class="shape-option-art">${renderFrameSvg(shape.id, { color: "#20211d", decorative: true })}</span>
      <span>${shape.label}</span>
    </button>`).join("");

  colorOptions.innerHTML = FRAME_COLORS.map((color) => `
    <button class="color-option" type="button" data-color="${color.id}" aria-label="${color.label}" aria-pressed="${color.id === state.color}">
      <span class="color-swatch" style="--swatch: ${color.swatch};" aria-hidden="true"></span>
      <span class="color-option-label">${color.label}</span>
    </button>`).join("");

  lensOptions.innerHTML = LENS_TYPES.map((lens) => `
    <button class="lens-option" type="button" data-lens="${lens.id}" aria-pressed="${lens.id === state.lens}">
      <span class="lens-option-mark lens-mark-${lens.id}" aria-hidden="true"></span>
      <span><strong>${lens.label}</strong><small>${lens.description}</small></span>
    </button>`).join("");

  purposeOptions.innerHTML = purposes.map((purpose) => `
    <button class="purpose-option" type="button" data-purpose="${purpose.id}" aria-pressed="${purpose.id === state.purpose}">${purpose.label}</button>`).join("");

  function update() {
    const choice = selected();
    preview.innerHTML = renderFrameSvg(state.shape, {
      color: choice.color.value,
      pattern: choice.color.pattern,
      lens: state.lens,
      label: `Prévia de armação ${choice.shape.label.toLowerCase()}, cor ${choice.color.label.toLowerCase()}, lente ${choice.lens.label.toLowerCase()}`
    });
    root.dispatchEvent(new CustomEvent("frameconfigurationchange", {
      detail: { shape: state.shape, color: choice.color.value, pattern: choice.color.pattern || null, lens: state.lens, label: `Prévia de armação ${choice.shape.label.toLowerCase()}, cor ${choice.color.label.toLowerCase()}, lente ${choice.lens.label.toLowerCase()}` }
    }));
    const purpose = purposes.find((item) => item.id === state.purpose);
    summary.innerHTML = `<span><strong>Formato</strong>${choice.shape.label}</span><span><strong>Cor</strong>${choice.color.label}</span><span><strong>Lente</strong>${choice.lens.label}</span><span><strong>Uso</strong>${purpose.label}</span>`;
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de consultar este óculos: armação ${choice.shape.label.toLowerCase()}, cor ${choice.color.label.toLowerCase()}, lente ${choice.lens.label.toLowerCase()} e uso ${purpose.label.toLowerCase()}.`)}`;
    whatsappLink.hidden = !whatsappNumber;

    root.querySelectorAll("[data-shape]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.shape === state.shape)));
    root.querySelectorAll("[data-color]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.color === state.color)));
    root.querySelectorAll("[data-lens]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lens === state.lens)));
    root.querySelectorAll("[data-purpose]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.purpose === state.purpose)));
  }

  shapeOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-shape]");
    if (!button) return;
    state.shape = button.dataset.shape;
    update();
  });
  colorOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-color]");
    if (!button) return;
    state.color = button.dataset.color;
    update();
  });
  lensOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lens]");
    if (!button) return;
    state.lens = button.dataset.lens;
    update();
  });
  purposeOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-purpose]");
    if (!button) return;
    state.purpose = button.dataset.purpose;
    update();
  });
  resetButton.addEventListener("click", () => {
    state.shape = "round";
    state.color = "black";
    state.lens = "clear";
    state.purpose = "degree";
    update();
    shapeOptions.querySelector(`[data-shape="${state.shape}"]`).focus();
  });

  update();
}
})();
