/**
 * Interactive 3D PCB Circuit & Schematic Burst Engine
 * Powered by Three.js WebGL
 * Visualizes a central processor core with radiating glowing circuit traces,
 * signal pulse packets, floating IC components, and cursor-reactive 3D parallax.
 */
export function initHeroSchematic() {
  const container = document.getElementById('hero-3d-core');
  if (!container) return;

  // Fallback to SVG schematic if Three.js is not loaded
  if (typeof THREE === 'undefined') {
    initSVGSchematicFallback(container);
    return;
  }

  let width = container.clientWidth || 520;
  let height = container.clientHeight || 520;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const schematicGroup = new THREE.Group();
  scene.add(schematicGroup);

  // -------------------------------------------------------------
  // 2. Central Processor IC Chip & Base PCB Substrate
  // -------------------------------------------------------------

  // PCB Base Grid Board
  const pcbGeo = new THREE.BoxGeometry(7.5, 7.5, 0.2);
  const pcbMat = new THREE.MeshBasicMaterial({
    color: 0x071e16,
    transparent: true,
    opacity: 0.85
  });
  const pcbBoard = new THREE.Mesh(pcbGeo, pcbMat);
  pcbBoard.position.z = -0.6;
  schematicGroup.add(pcbBoard);

  // PCB Wireframe Grid Border
  const pcbEdges = new THREE.EdgesGeometry(pcbGeo);
  const pcbLineMat = new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.35 });
  const pcbWireframe = new THREE.LineSegments(pcbEdges, pcbLineMat);
  pcbBoard.add(pcbWireframe);

  // Central Processor Substrate
  const chipGeo = new THREE.BoxGeometry(3.2, 3.2, 0.4);
  const chipMat = new THREE.MeshBasicMaterial({ color: 0x0e2920 });
  const chipMesh = new THREE.Mesh(chipGeo, chipMat);
  schematicGroup.add(chipMesh);

  // Metallic Die Core Highlight
  const dieGeo = new THREE.BoxGeometry(1.6, 1.6, 0.45);
  const dieMat = new THREE.MeshBasicMaterial({ color: 0x163f32 });
  const dieMesh = new THREE.Mesh(dieGeo, dieMat);
  schematicGroup.add(dieMesh);

  // Glowing Silicon Logo Glyph Box
  const logoGeo = new THREE.PlaneGeometry(0.9, 0.9);
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 128; logoCanvas.height = 128;
  const logoCtx = logoCanvas.getContext('2d');
  logoCtx.fillStyle = '#0e2920'; logoCtx.fillRect(0, 0, 128, 128);
  logoCtx.strokeStyle = '#5eead4'; logoCtx.lineWidth = 8;
  logoCtx.strokeRect(12, 12, 104, 104);
  logoCtx.fillStyle = '#8cfaf0'; logoCtx.font = 'bold 44px "JetBrains Mono", monospace';
  logoCtx.textAlign = 'center'; logoCtx.textBaseline = 'middle';
  logoCtx.fillText('RM', 64, 64);
  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  const logoMat = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.z = 0.24;
  dieMesh.add(logoMesh);

  // Gold/Copper IC Pin Leads around Central Processor
  const pinCountPerSide = 8;
  const pinSpacing = 3.0 / (pinCountPerSide - 1);
  const pinMat = new THREE.MeshBasicMaterial({ color: 0xe0a06b });

  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < pinCountPerSide; i++) {
      const pinGeo = new THREE.BoxGeometry(0.12, 0.5, 0.15);
      const pin = new THREE.Mesh(pinGeo, pinMat);

      const offset = -1.5 + i * pinSpacing;
      if (side === 0) { // Top
        pin.position.set(offset, 1.8, 0);
      } else if (side === 1) { // Bottom
        pin.position.set(offset, -1.8, 0);
      } else if (side === 2) { // Left
        pin.rotation.z = Math.PI / 2;
        pin.position.set(-1.8, offset, 0);
      } else if (side === 3) { // Right
        pin.rotation.z = Math.PI / 2;
        pin.position.set(1.8, offset, 0);
      }
      schematicGroup.add(pin);
    }
  }

  // -------------------------------------------------------------
  // 3. Radiating 3D Circuit Traces & Glowing Bus Lines
  // -------------------------------------------------------------

  const tracesGroup = new THREE.Group();
  schematicGroup.add(tracesGroup);

  const signalPulses = [];
  const traceLineMat = new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.6 });
  const copperLineMat = new THREE.LineBasicMaterial({ color: 0xe0a06b, transparent: true, opacity: 0.5 });

  // Generate PCB right-angle trace paths radiating outward
  const traceAngles = [0, 0.45, 0.9, 1.35, 1.8, 2.25, 2.7, 3.15, 3.6, 4.05, 4.5, 4.95, 5.4, 5.85];

  traceAngles.forEach((angle, idx) => {
    const r1 = 1.8;
    const r2 = 3.2 + (idx % 3) * 0.6;
    const r3 = 5.2 + (idx % 2) * 1.2;

    const x1 = Math.cos(angle) * r1;
    const y1 = Math.sin(angle) * r1;
    
    // Right angle bend
    const midAngle = angle + (idx % 2 === 0 ? 0.35 : -0.35);
    const x2 = Math.cos(midAngle) * r2;
    const y2 = Math.sin(midAngle) * r2;

    const x3 = Math.cos(midAngle) * r3;
    const y3 = Math.sin(midAngle) * r3;

    const points = [
      new THREE.Vector3(x1, y1, 0),
      new THREE.Vector3(x2, y2, 0),
      new THREE.Vector3(x3, y3, 0)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = idx % 3 === 0 ? copperLineMat : traceLineMat;
    const line = new THREE.Line(geometry, lineMat);
    tracesGroup.add(line);

    // Terminal Node Pad Solder Ring
    const padGeo = new THREE.RingGeometry(0.12, 0.22, 16);
    const padMat = new THREE.MeshBasicMaterial({
      color: idx % 3 === 0 ? 0xe0a06b : 0x5eead4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(x3, y3, 0.02);
    tracesGroup.add(padMesh);

    // Glowing Pulse Packet traveling along trace path
    const pulseGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: idx % 3 === 0 ? 0xffc48c : 0x8cfaf0
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    pulseMesh.position.copy(points[0]);
    tracesGroup.add(pulseMesh);

    signalPulses.push({
      mesh: pulseMesh,
      points: points,
      progress: Math.random(),
      speed: 0.006 + Math.random() * 0.008
    });
  });

  // -------------------------------------------------------------
  // 4. Floating Auxiliary SMD Components & Text Sprites
  // -------------------------------------------------------------

  const auxGroup = new THREE.Group();
  schematicGroup.add(auxGroup);

  // Helper to create high-tech text sprites
  function createSchematicLabel(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(7, 24, 19, 0.85)';
    ctx.strokeStyle = colorHex || '#5eead4';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(6, 6, 244, 52, 10); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.6, 0.4, 1);
    return sprite;
  }

  // Floating Component Badges
  const badgeLabels = [
    { text: 'U0 · PROFILE', pos: [-3.8, 3.2, 0.8], color: '#e0a06b' },
    { text: 'AI_CORE', pos: [3.8, 3.2, 0.8], color: '#5eead4' },
    { text: 'ESP32_BUS', pos: [-4.2, -3.2, 0.8], color: '#8cfaf0' },
    { text: 'SYS_OK', pos: [4.2, -3.2, 0.8], color: '#e8b34d' }
  ];

  badgeLabels.forEach(b => {
    const sprite = createSchematicLabel(b.text, b.color);
    sprite.position.set(...b.pos);
    auxGroup.add(sprite);
  });

  // Floating SMD Capacitors & Resistor Blocks
  for (let i = 0; i < 8; i++) {
    const capGeo = new THREE.BoxGeometry(0.6, 0.3, 0.3);
    const capMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x224438 : 0x4a321e });
    const capMesh = new THREE.Mesh(capGeo, capMat);

    const angle = (i / 8) * Math.PI * 2 + 0.2;
    const dist = 4.2;
    capMesh.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, 0.2);
    capMesh.rotation.z = angle;
    auxGroup.add(capMesh);
  }

  // -------------------------------------------------------------
  // 5. Mouse Parallax & Interactive Rotation Controls
  // -------------------------------------------------------------

  let targetRotX = 0.2;
  let targetRotY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;

      targetRotY = mouseX * 0.45;
      targetRotX = 0.2 + mouseY * 0.35;
    }
  });

  // -------------------------------------------------------------
  // 6. Animation Loop
  // -------------------------------------------------------------

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Pulse signal packet movement along traces
    signalPulses.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;

      // Piecewise linear interpolation along 3 point path
      if (p.progress < 0.5) {
        const t = p.progress * 2;
        p.mesh.position.lerpVectors(p.points[0], p.points[1], t);
      } else {
        const t = (p.progress - 0.5) * 2;
        p.mesh.position.lerpVectors(p.points[1], p.points[2], t);
      }
    });

    // Gentle floating oscillations
    chipMesh.position.z = Math.sin(elapsedTime * 2) * 0.06;
    dieMesh.position.z = 0.2 + Math.sin(elapsedTime * 2 + 0.5) * 0.08;
    auxGroup.position.z = Math.sin(elapsedTime * 1.5) * 0.12;

    // Smooth spring rotation towards mouse
    schematicGroup.rotation.y += (targetRotY - schematicGroup.rotation.y) * 0.06;
    schematicGroup.rotation.x += (targetRotX - schematicGroup.rotation.x) * 0.06;

    renderer.render(scene, camera);
  }

  function onResize() {
    if (!container) return;
    width = container.clientWidth || 520;
    height = container.clientHeight || 520;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
}

function initSVGSchematicFallback(container) {
  container.innerHTML = `
    <svg class="schematic" viewBox="0 0 400 400" width="100%" height="100%">
      <rect x="130" y="130" width="140" height="140" rx="10" fill="#0e2920" stroke="#5eead4" stroke-width="2" class="chip-box" />
      <rect x="160" y="160" width="80" height="80" rx="6" fill="#163f32" stroke="#e0a06b" stroke-width="2" />
      <text x="200" y="208" font-family="JetBrains Mono" font-size="24" font-weight="bold" fill="#8cfaf0" text-anchor="middle">RM</text>
      <circle cx="200" cy="60" r="10" fill="none" stroke="#5eead4" stroke-width="2" />
      <line x1="200" y1="130" x2="200" y2="70" stroke="#5eead4" stroke-width="2" stroke-dasharray="4 4" class="pulse" />
      <circle cx="340" cy="200" r="10" fill="none" stroke="#e0a06b" stroke-width="2" />
      <line x1="270" y1="200" x2="330" y2="200" stroke="#e0a06b" stroke-width="2" stroke-dasharray="4 4" class="pulse" />
    </svg>
  `;
}
