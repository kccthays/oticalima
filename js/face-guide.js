(() => {
const { FACE_SHAPES, FRAME_SHAPES, renderFaceSvg, renderFrameSvg } = window.OTICA_LIMA_FRAMES || {};

const root = document.querySelector("[data-face-guide]");
if (root) {
  const state = { face: "oval" };
  const faceOptions = root.querySelector("[data-face-options]");
  const recommendationArea = root.querySelector("[data-recommendations]");

  faceOptions.innerHTML = FACE_SHAPES.map((face) => `
    <button class="face-option" type="button" data-face="${face.id}" aria-pressed="${face.id === state.face}">
      <span class="face-option-art">${renderFaceSvg(face)}</span>
      <span>${face.label}</span>
    </button>`).join("");

  function update() {
    const face = FACE_SHAPES.find((item) => item.id === state.face) || FACE_SHAPES[0];
    faceOptions.querySelectorAll("[data-face]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.face === state.face)));
    recommendationArea.setAttribute("aria-label", `Sugestões para rosto ${face.label.toLowerCase()}`);
    recommendationArea.innerHTML = `
      <div class="recommendation-intro"><p class="eyebrow">Sugestões para rosto ${face.label.toLowerCase()}</p><p>${face.description}</p></div>
      <div class="recommendation-grid">
        ${face.recommendations.map((recommendation) => {
          const frame = FRAME_SHAPES.find((item) => item.id === recommendation.frame);
          return `<article class="recommendation-card">
            <div class="recommendation-art">${renderFrameSvg(recommendation.frame, { color: "#20211d", label: `Ilustração de armação ${frame.label.toLowerCase()}` })}</div>
            <h3>${recommendation.title}</h3><p>${recommendation.note}</p>
          </article>`;
        }).join("")}
      </div>`;
  }

  faceOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-face]");
    if (!button) return;
    state.face = button.dataset.face;
    update();
  });
  update();
}
})();
