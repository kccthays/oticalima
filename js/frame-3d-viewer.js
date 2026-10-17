(() => {
  const root = document.querySelector("[data-frame-customizer]");
  const canvas = root?.querySelector("[data-frame-canvas]");
  const preview = root?.querySelector("[data-frame-preview]");
  const hint = root?.querySelector("[data-preview-hint]");
  const data = window.OTICA_LIMA_FRAMES;

  if (!root || !canvas || !preview || !data || !window.THREE) return;

  const THREE = window.THREE;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: window.devicePixelRatio < 2, powerPreference: "low-power" });
  } catch {
    hint.textContent = "Ilustração vetorial · arraste não disponível neste navegador";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.75, 2.75, 2.75, -2.75, 0.1, 40);
  camera.position.set(0, 0, 6.2);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x8d927a, 2.1);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(-3, 4, 5);
  const rimLight = new THREE.DirectionalLight(0xc9edaa, 1.1);
  rimLight.position.set(3, 0, -3);
  scene.add(ambient, keyLight, rimLight);

  const model = new THREE.Group();
  scene.add(model);

  const state = { shape: "round", color: "#20211d", pattern: null, lens: "clear", label: "Demonstração conceitual em 3D de armação" };
  const pointer = { x: 0, y: 0, down: false, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 };
  let animationFrame = 0;
  let visible = true;
  let disposed = false;

  function disposeModel() {
    while (model.children.length) {
      const child = model.children.pop();
      child.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => {
          material.map?.dispose();
          material.dispose();
        });
        else if (object.material) {
          object.material.map?.dispose();
          object.material.dispose();
        }
      });
    }
  }

  function sampleSvgPath(pathData, offsetX = 0, segments = 88) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("viewBox", "0 0 600 320");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:fixed;left:-10000px;top:0;width:600px;height:320px;visibility:hidden";
    path.setAttribute("d", pathData);
    svg.append(path);
    document.body.append(svg);

    const length = path.getTotalLength();
    const points = Array.from({ length: segments }, (_, index) => {
      const point = path.getPointAtLength((length * index) / segments);
      return new THREE.Vector3((point.x + offsetX - 300) * 0.0085, (160 - point.y) * 0.0085, 0);
    });
    svg.remove();
    return points;
  }

  function addContour(points, material, radius = 0.038) {
    const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, points.length, radius, 9, true), material);
    model.add(mesh);
  }

  function addCurve(points, material, radius = 0.035) {
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    model.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 8, false), material));
  }

  function createTortoiseshellTexture() {
    const surface = document.createElement("canvas");
    surface.width = 128;
    surface.height = 128;
    const context = surface.getContext("2d");
    context.fillStyle = "#261710";
    context.fillRect(0, 0, surface.width, surface.height);
    const streaks = [
      { fill: "#8e4d23", path: "M -10 14 C 8 1 17 7 27 18 C 36 28 45 23 53 8 C 61 -4 72 1 82 13 L 82 31 C 69 20 62 25 54 39 C 44 54 34 48 23 37 C 12 26 3 31 -10 43 Z" },
      { fill: "#d08a3b", path: "M 35 -8 C 49 3 54 14 66 17 C 80 20 86 5 99 1 C 111 -3 120 5 138 16 L 138 34 C 123 25 114 23 104 34 C 89 50 75 43 64 34 C 53 25 47 22 35 29 Z" },
      { fill: "#b76c2c", path: "M -8 65 C 8 53 18 60 29 70 C 42 82 48 76 57 63 C 66 50 81 52 91 66 L 91 83 C 78 72 68 76 60 91 C 50 107 39 101 27 89 C 14 77 5 85 -8 94 Z" },
      { fill: "#dda34f", path: "M 76 55 C 89 45 99 51 108 63 C 118 76 126 69 138 60 L 138 78 C 124 90 114 96 103 84 C 91 72 85 73 76 82 Z" },
      { fill: "#8e4d23", path: "M 22 108 C 36 96 48 103 59 114 C 70 125 79 119 88 107 C 100 93 115 99 138 112 L 138 138 L 20 138 Z" },
      { fill: "#d08a3b", path: "M -9 112 C 2 102 12 105 21 116 C 30 127 39 126 47 117 L 47 138 L -9 138 Z" }
    ];
    streaks.forEach(({ fill, path }) => {
      context.fillStyle = fill;
      context.beginPath();
      const commands = path.match(/[MLC][-\d .,]+/g) || [];
      commands.forEach((command) => {
        const [type, ...values] = command.match(/[MLC]|-?\d+(?:\.\d+)?/g) || [];
        const numbers = values.map(Number);
        if (type === "M") context.moveTo(numbers[0], numbers[1]);
        if (type === "L") context.lineTo(numbers[0], numbers[1]);
        if (type === "C") context.bezierCurveTo(...numbers);
      });
      context.closePath();
      context.fill();
    });
    context.globalAlpha = 0.42;
    context.strokeStyle = "#f0bd67";
    context.lineWidth = 2;
    [[2, 25, 18, 16, 31, 29], [66, 12, 81, 4, 94, 17], [39, 91, 53, 82, 70, 95], [93, 109, 107, 97, 124, 110]].forEach((points) => {
      context.beginPath();
      context.moveTo(points[0], points[1]);
      context.bezierCurveTo(points[2], points[3], points[4], points[3], points[5], points[5]);
      context.stroke();
    });
    context.globalAlpha = 1;
    const texture = new THREE.CanvasTexture(surface);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3.5, 2.5);
    if ("colorSpace" in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function rebuild() {
    const shape = data.FRAME_SHAPES.find((item) => item.id === state.shape) || data.FRAME_SHAPES[0];
    const color = new THREE.Color(state.color);
    const metal = ["gold", "silver"].includes(data.FRAME_COLORS.find((item) => item.value === state.color)?.id);
    const frameTexture = state.pattern === "tortoiseshell" ? createTortoiseshellTexture() : null;
    const frameMaterial = new THREE.MeshStandardMaterial({ color: frameTexture ? 0xffffff : color, map: frameTexture, metalness: metal ? 0.58 : 0.12, roughness: metal ? 0.32 : 0.3 });
    const lensStyles = {
      clear: { color: 0xa9c6be, opacity: 0.1 },
      "blue-filter": { color: 0x9dc5db, opacity: 0.25 },
      photo: { color: 0x82907a, opacity: 0.24 },
      smoke: { color: 0x303d34, opacity: 0.48 },
      gradient: { color: 0xffffff, opacity: 0.42 },
      mirrored: { color: 0xc6d2d8, opacity: 0.48 }
    };
    const lensStyle = lensStyles[state.lens] || lensStyles.clear;
    const lensMaterial = new THREE.MeshBasicMaterial({
      color: lensStyle.color,
      transparent: true,
      opacity: lensStyle.opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      vertexColors: state.lens === "gradient"
    });

    disposeModel();

    const left = sampleSvgPath(shape.lens);
    const right = shape.rightLens ? sampleSvgPath(shape.rightLens) : sampleSvgPath(shape.lens, 250);
    [left, right].forEach((points) => {
      const center = points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).divideScalar(points.length);
      const outerPoints = points.map((point) => center.clone().add(point.clone().sub(center).multiplyScalar(1.055)));
      const rim = new THREE.Shape();
      outerPoints.forEach((point, index) => {
        if (index === 0) rim.moveTo(point.x, point.y);
        else rim.lineTo(point.x, point.y);
      });
      rim.closePath();
      const innerEdge = new THREE.Path();
      [...points].reverse().forEach((point, index) => {
        if (index === 0) innerEdge.moveTo(point.x, point.y);
        else innerEdge.lineTo(point.x, point.y);
      });
      innerEdge.closePath();
      rim.holes.push(innerEdge);
      model.add(new THREE.Mesh(new THREE.ExtrudeGeometry(rim, {
        depth: 0.055,
        steps: 1,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.012,
        bevelThickness: 0.009,
        curveSegments: 16
      }), frameMaterial));

      const lensShape = new THREE.Shape();
      points.forEach((point, index) => {
        if (index === 0) lensShape.moveTo(point.x, point.y);
        else lensShape.lineTo(point.x, point.y);
      });
      lensShape.closePath();
      const lensGeometry = new THREE.ShapeGeometry(lensShape, 24);
      if (state.lens === "gradient") {
        const positions = lensGeometry.attributes.position;
        const colors = [];
        const top = new THREE.Color(0x343b38);
        const bottom = new THREE.Color(0xe6ebdc);
        const minY = Math.min(...Array.from(positions.array).filter((_, index) => index % 3 === 1));
        const maxY = Math.max(...Array.from(positions.array).filter((_, index) => index % 3 === 1));
        for (let index = 0; index < positions.count; index += 1) {
          const amount = THREE.MathUtils.clamp((positions.getY(index) - minY) / Math.max(0.001, maxY - minY), 0, 1);
          const color = bottom.clone().lerp(top, amount);
          colors.push(color.r, color.g, color.b);
        }
        lensGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      }
      const lensMesh = new THREE.Mesh(lensGeometry, lensMaterial);
      lensMesh.position.z = 0.035;
      model.add(lensMesh);
    });

    if (shape.bridge) {
      addCurve(sampleSvgPath(shape.bridge, 0, 24).map((point) => point.setZ(0.04)), frameMaterial, 0.038);
    } else {
      addCurve([
        new THREE.Vector3(-0.34, 0.17, 0.035), new THREE.Vector3(-0.2, 0.27, 0.035),
        new THREE.Vector3(0, 0.3, 0.04), new THREE.Vector3(0.2, 0.27, 0.035),
        new THREE.Vector3(0.34, 0.17, 0.035)
      ], frameMaterial, 0.038);
    }

    const hinges = shape.hinges || [{ x: 87, y: 143 }, { x: 513, y: 143 }];
    [-1, 1].forEach((side, index) => {
      const anchor = hinges[index];
      const hingeX = (anchor.x - 300) * 0.0085;
      const hingeY = (160 - anchor.y) * 0.0085;
      addCurve([
        new THREE.Vector3(hingeX, hingeY, 0.045),
        new THREE.Vector3(side * 1.9, hingeY - 0.01, -0.22),
        new THREE.Vector3(side * 1.92, hingeY - 0.095, -0.9),
        new THREE.Vector3(side * 1.84, hingeY - 0.22, -1.5)
      ], frameMaterial, metal ? 0.021 : 0.028);

      const hinge = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 8), frameMaterial);
      hinge.position.set(hingeX, hingeY, 0.065);
      model.add(hinge);
    });

    model.rotation.set(0, 0, 0);
    canvas.setAttribute("aria-label", `${state.label}. Não representa um produto específico. Arraste para girar.`);
    render();
  }

  function resize() {
    if (disposed) return;
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.left = -2.75;
    camera.right = 2.75;
    camera.top = 2.75 / camera.aspect;
    camera.bottom = -2.75 / camera.aspect;
    camera.updateProjectionMatrix();
    render();
  }

  function render() {
    if (visible && !disposed) renderer.render(scene, camera);
  }

  function animate() {
    if (disposed) return;
    if (visible) {
      if (!pointer.down) {
        model.rotation.y += pointer.velocityX;
        model.rotation.x += pointer.velocityY;
        pointer.velocityX *= 0.92;
        pointer.velocityY *= 0.92;
        if (!reducedMotion) {
          model.rotation.y += (pointer.x * 0.08 - model.rotation.y) * 0.018;
          model.rotation.x += (pointer.y * 0.06 - model.rotation.x) * 0.018;
        }
      }
      renderer.render(scene, camera);
    }
    animationFrame = window.requestAnimationFrame(animate);
  }

  canvas.addEventListener("pointerdown", (event) => {
    pointer.down = true;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });
  canvas.addEventListener("pointermove", (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    if (!pointer.down) return;
    const dx = event.clientX - pointer.lastX;
    const dy = event.clientY - pointer.lastY;
    const sensitivity = 0.009;
    model.rotation.y += dx * sensitivity;
    model.rotation.x += dy * sensitivity;
    model.rotation.x = THREE.MathUtils.clamp(model.rotation.x, -0.8, 0.8);
    pointer.velocityX = dx * sensitivity * 0.045;
    pointer.velocityY = dy * sensitivity * 0.045;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    if (reducedMotion) render();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => canvas.addEventListener(eventName, () => {
    pointer.down = false;
    canvas.classList.remove("is-dragging");
    if (reducedMotion) render();
  }));
  canvas.addEventListener("pointerleave", () => {
    if (!pointer.down) {
      pointer.x = 0;
      pointer.y = 0;
    }
  });

  root.addEventListener("frameconfigurationchange", (event) => {
    Object.assign(state, event.detail);
    rebuild();
  });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) render();
  }, { threshold: 0.01 });
  observer.observe(canvas);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", () => {
    disposed = true;
    cancelAnimationFrame(animationFrame);
    observer.disconnect();
    window.removeEventListener("resize", resize);
    disposeModel();
    renderer.dispose();
  }, { once: true });

  root.classList.add("has-3d-preview");
  hint.textContent = "Demonstração conceitual · arraste para girar";
  const selectedColor = root.querySelector('[data-color][aria-pressed="true"]')?.dataset.color || "black";
  state.color = data.FRAME_COLORS.find((item) => item.id === selectedColor)?.value || state.color;
  rebuild();
  resize();
  if (!reducedMotion) animate();
})();
