(() => {
const FRAME_SHAPES = [
  {
    id: "round",
    label: "Redonda",
    lens: "M 88 160 C 88 108 124 78 174 78 C 224 78 260 108 260 160 C 260 212 224 242 174 242 C 124 242 88 212 88 160 Z"
  },
  {
    id: "square",
    label: "Quadrada",
    lens: "M 88 112 Q 88 88 112 88 H 236 Q 260 88 260 112 V 208 Q 260 232 236 232 H 112 Q 88 232 88 208 Z"
  },
  {
    id: "rectangular",
    label: "Retangular",
    lens: "M 82 120 Q 82 96 106 96 H 242 Q 266 96 266 120 V 200 Q 266 224 242 224 H 106 Q 82 224 82 200 Z"
  },
  {
    id: "cat-eye",
    label: "Gatinho",
    lens: "M 75 91 C 116 84 178 91 222 101 Q 250 107 260 125 L 246 174 C 238 202 214 218 180 218 C 142 218 107 203 91 177 C 80 158 76 126 75 91 Z",
    rightLens: "M 525 91 C 484 84 422 91 378 101 Q 350 107 340 125 L 354 174 C 362 202 386 218 420 218 C 458 218 493 203 509 177 C 520 158 524 126 525 91 Z",
    bridge: "M 260 125 C 278 111 322 111 340 125",
    temples: "M 76 96 L 14 88 M 524 96 L 586 88",
    hinges: [{ x: 75, y: 91 }, { x: 525, y: 91 }]
  },
  {
    id: "aviator",
    label: "Aviador",
    lens: "M 80 111 C 103 93 138 87 174 91 C 214 94 248 98 268 113 L 254 169 C 247 204 221 227 177 239 C 137 243 103 220 94 181 Z",
    rightLens: "M 520 111 C 497 93 462 87 426 91 C 386 94 352 98 332 113 L 346 169 C 353 204 379 227 423 239 C 463 243 497 220 506 181 Z",
    bridge: "M 268 113 C 282 101 318 101 332 113",
    temples: "M 81 116 L 14 107 M 519 116 L 586 107",
    hinges: [{ x: 80, y: 111 }, { x: 520, y: 111 }]
  },
  {
    id: "oval",
    label: "Oval",
    lens: "M 78 160 C 78 112 116 88 174 88 C 232 88 270 112 270 160 C 270 208 232 232 174 232 C 116 232 78 208 78 160 Z"
  },
  {
    id: "geometric",
    label: "Geométrica",
    lens: "M 108 88 H 222 L 260 124 V 196 L 222 232 H 108 L 82 196 V 124 Z"
  },
  {
    id: "clubmaster",
    label: "Clubmaster",
    lens: "M 86 148 Q 86 116 114 110 Q 174 94 234 110 Q 262 116 262 148 V 194 Q 262 222 234 230 Q 174 246 114 230 Q 86 222 86 194 Z",
    brow: "M 88 148 Q 88 116 116 110 Q 174 95 232 110 Q 260 116 260 148"
  }
];

const FRAME_COLORS = [
  { id: "black", label: "Preto", value: "#20211d", swatch: "#20211d" },
  { id: "brown", label: "Marrom", value: "#704731", swatch: "#704731" },
  { id: "clear", label: "Transparente", value: "#aeb9b0", swatch: "linear-gradient(135deg, #eef2ec 0 45%, #aeb9b0 46% 100%)" },
  { id: "gold", label: "Dourado", value: "#b28a36", swatch: "#b28a36" },
  { id: "silver", label: "Prata", value: "#8f9897", swatch: "#aeb5b4" },
  { id: "red", label: "Vermelho", value: "#a83d43", swatch: "#a83d43" },
  { id: "leopard", label: "Oncinha", value: "#261710", pattern: "tortoiseshell", swatch: "radial-gradient(ellipse 11px 4px at 22% 28%, #d08a3b 0 48%, transparent 65%), radial-gradient(ellipse 9px 5px at 74% 66%, #a85e2a 0 48%, transparent 66%), radial-gradient(ellipse 8px 4px at 81% 18%, #dda44d 0 44%, transparent 64%), radial-gradient(ellipse 14px 5px at 44% 84%, #6f3b1d 0 44%, transparent 64%), #261710" },
  { id: "pink", label: "Rosa", value: "#c27f91", swatch: "#c27f91" }
];

const LENS_TYPES = [
  { id: "clear", label: "Incolor", description: "Aparência clara" },
  { id: "blue-filter", label: "Filtro azul", description: "Tonalidade azul ilustrativa" },
  { id: "photo", label: "Fotossensível", description: "Aparência em transição" },
  { id: "smoke", label: "Fumê", description: "Aparência escurecida" },
  { id: "gradient", label: "Degradê", description: "Escura em cima, clara embaixo" },
  { id: "mirrored", label: "Espelhada", description: "Reflexo ilustrativo" }
];

const FACE_SHAPES = [
  {
    id: "oval",
    label: "Oval",
    description: "Proporções suaves e equilibradas.",
    illustration: "M 80 24 C 43 24 28 58 31 103 C 34 151 53 179 80 181 C 107 179 126 151 129 103 C 132 58 117 24 80 24 Z",
    recommendations: [
      { frame: "square", title: "Quadradas", note: "Criam contraste com as linhas suaves do rosto." },
      { frame: "rectangular", title: "Retangulares", note: "Acrescentam definição sem perder equilíbrio." },
      { frame: "aviator", title: "Aviadoras", note: "Um clássico versátil para experimentar." }
    ]
  },
  {
    id: "round",
    label: "Redondo",
    description: "Linhas curvas e proporções próximas.",
    illustration: "M 80 24 C 45 24 27 54 27 101 C 27 149 47 181 80 181 C 113 181 133 149 133 101 C 133 54 115 24 80 24 Z",
    recommendations: [
      { frame: "rectangular", title: "Retangulares", note: "Linhas retas adicionam contraste visual." },
      { frame: "square", title: "Quadradas", note: "Ajudam a destacar os contornos do rosto." },
      { frame: "geometric", title: "Geométricas", note: "Ângulos marcantes criam um visual expressivo." }
    ]
  },
  {
    id: "square",
    label: "Quadrado",
    description: "Mandíbula e testa com linhas mais marcadas.",
    illustration: "M 45 27 Q 80 18 115 27 L 131 49 L 127 130 Q 117 169 80 181 Q 43 169 33 130 L 29 49 Z",
    recommendations: [
      { frame: "round", title: "Redondas", note: "Curvas suavizam o contraste das linhas retas." },
      { frame: "oval", title: "Ovais", note: "Uma silhueta delicada para equilibrar os contornos." },
      { frame: "aviator", title: "Aviadoras", note: "A parte inferior curva cria um contraponto leve." }
    ]
  },
  {
    id: "heart",
    label: "Coração",
    description: "Testa mais ampla e queixo delicado.",
    illustration: "M 80 180 C 65 166 34 138 25 104 C 15 69 28 38 52 29 C 64 25 74 31 80 43 C 86 31 96 25 108 29 C 132 38 145 69 135 104 C 126 138 95 166 80 180 Z",
    recommendations: [
      { frame: "oval", title: "Ovais", note: "Uma linha suave que distribui o destaque." },
      { frame: "aviator", title: "Aviadoras", note: "A parte inferior mais ampla pode equilibrar o visual." },
      { frame: "round", title: "Armações leves", note: "Contornos delicados mantêm o conjunto equilibrado." }
    ]
  }
];

let frameSvgId = 0;

function renderFrameSvg(shapeId, options = {}) {
  const shape = FRAME_SHAPES.find((item) => item.id === shapeId) || FRAME_SHAPES[0];
  const frameColor = options.color || "#20211d";
  const lens = options.lens || "clear";
  const pattern = options.pattern === "tortoiseshell";
  const gradientId = `lens-${++frameSvgId}`;
  const frameStroke = pattern ? `url(#${gradientId}-tortoiseshell)` : frameColor;
  const rightLens = shape.rightLens || shape.lens;
  const rightTransform = shape.rightLens ? "" : "translate(250 0)";
  const temples = shape.temples || "M 92 143 L 16 122 M 508 143 L 584 122";
  const bridge = shape.bridge || "M 260 143 C 278 128 320 128 338 143";
  const lensFill = `url(#${gradientId}-${lens in { clear: 1, "blue-filter": 1, photo: 1, smoke: 1, gradient: 1, mirrored: 1 } ? lens : "clear"})`;
  const strokeWidth = options.strokeWidth || 8;
  const label = options.label || `${shape.label} illustration`;
  const semantics = options.decorative ? 'aria-hidden="true"' : `role="img" aria-label="${label}"`;

  return `<svg class="frame-drawing" viewBox="0 0 600 320" ${semantics} xmlns="http://www.w3.org/2000/svg" focusable="false">
    <defs>
      <linearGradient id="${gradientId}-clear" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#b8d0d0" stop-opacity=".12"/></linearGradient>
      <linearGradient id="${gradientId}-blue-filter" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b9d9e8" stop-opacity=".42"/><stop offset="1" stop-color="#718fa3" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${gradientId}-photo" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8a9c83" stop-opacity=".32"/><stop offset="1" stop-color="#dae2d1" stop-opacity=".15"/></linearGradient>
      <linearGradient id="${gradientId}-smoke" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#18201d" stop-opacity=".68"/><stop offset="1" stop-color="#394a3c" stop-opacity=".48"/></linearGradient>
      <linearGradient id="${gradientId}-gradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#343b38" stop-opacity=".62"/><stop offset="1" stop-color="#e6ebdc" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${gradientId}-mirrored" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef7f5" stop-opacity=".76"/><stop offset=".45" stop-color="#7f9195" stop-opacity=".48"/><stop offset=".7" stop-color="#f5ffff" stop-opacity=".78"/><stop offset="1" stop-color="#9eacb2" stop-opacity=".38"/></linearGradient>
      ${pattern ? `<pattern id="${gradientId}-tortoiseshell" width="48" height="32" patternUnits="userSpaceOnUse"><rect width="48" height="32" fill="#261710"/><path d="M -4 9 C 6 1 12 3 19 10 C 25 16 30 13 34 5 C 38 -1 44 2 52 7 L 52 14 C 43 10 39 12 34 22 C 29 31 22 28 16 21 C 10 15 4 16 -4 22 Z" fill="#8e4d23"/><path d="M 5 4 C 12 0 16 4 22 11 C 27 17 32 17 36 11 C 40 6 44 7 50 12 L 50 17 C 42 14 40 17 36 25 C 31 31 25 27 20 21 C 14 14 10 14 4 19 Z" fill="#d08a3b" opacity=".9"/><path d="M -2 25 C 8 18 13 23 18 28 C 22 32 29 31 34 25 C 38 20 44 21 50 25 L 50 32 L -2 32 Z" fill="#572d18" opacity=".9"/><path d="M 0 11 C 7 8 12 10 17 15 M 28 5 C 32 2 36 3 40 6" fill="none" stroke="#e1ae5b" stroke-width="2" opacity=".72"/></pattern>` : ""}
    </defs>
    <g fill="none" stroke="${frameStroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      <path d="${temples}" stroke-width="${Math.max(7, strokeWidth * 0.72)}"/>
      <path d="${shape.lens}" fill="${lensFill}"/><path d="${rightLens}" transform="${rightTransform}" fill="${lensFill}"/>
      <path d="${bridge}"/>
      ${shape.brow ? `<path d="${shape.brow}" stroke-width="${strokeWidth * 1.7}"/><path d="${shape.brow}" transform="translate(250 0)" stroke-width="${strokeWidth * 1.7}"/>` : ""}
      <path d="M 91 137 L 91 158 M 509 137 L 509 158" stroke-width="${strokeWidth * 0.72}"/>
    </g>
  </svg>`;
}

function renderFaceSvg(face, selected = false) {
  return `<svg class="face-drawing${selected ? " is-selected" : ""}" viewBox="0 0 160 200" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path d="${face.illustration}" fill="#eeefd9" stroke="#20211d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 57 96 Q 66 90 73 96 M 87 96 Q 95 90 103 96 M 80 101 L 77 119 Q 81 123 86 119 M 67 137 Q 80 143 94 137" fill="none" stroke="#696c62" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

window.OTICA_LIMA_FRAMES = Object.freeze({ FRAME_SHAPES, FRAME_COLORS, LENS_TYPES, FACE_SHAPES, renderFrameSvg, renderFaceSvg });
})();
