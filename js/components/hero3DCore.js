/**
 * Interactive 3D Holographic Cyber Core Component
 * Powered by Three.js WebGL
 */
export function initHero3DCore() {
  const container = document.getElementById('hero-3d-core');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 450;
  const height = container.clientHeight || 450;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 8.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // 2. Main Hologram Core Group
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Outer Cyber Wireframe Dodecahedron
  const outerGeo = new THREE.DodecahedronGeometry(2.2, 0);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x5eead4,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  coreGroup.add(outerMesh);

  // Secondary Inner Icosahedron Frame
  const midGeo = new THREE.IcosahedronGeometry(1.6, 0);
  const midMat = new THREE.MeshBasicMaterial({
    color: 0xe0a06b,
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });
  const midMesh = new THREE.Mesh(midGeo, midMat);
  coreGroup.add(midMesh);

  // Inner Glowing Nucleus Sphere
  const innerGeo = new THREE.SphereGeometry(0.9, 32, 32);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x0e2920,
    emissive: 0x5eead4,
    emissiveIntensity: 0.8,
    shininess: 90,
    transparent: true,
    opacity: 0.9
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerMesh);

  // Core Point Light inside nucleus
  const coreLight = new THREE.PointLight(0x5eead4, 3, 10);
  coreGroup.add(coreLight);

  const amberLight = new THREE.PointLight(0xe0a06b, 2.5, 10);
  amberLight.position.set(3, 3, 3);
  scene.add(amberLight);

  const ambientLight = new THREE.AmbientLight(0x06130e, 1.5);
  scene.add(ambientLight);

  // 3. Orbital Rings with Discipline Badges
  const ringGroup = new THREE.Group();
  coreGroup.add(ringGroup);

  function createOrbitRing(radius, tiltX, tiltY, color) {
    const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = tiltX;
    ring.rotation.y = tiltY;
    return ring;
  }

  const ring1 = createOrbitRing(3.1, Math.PI / 4, 0, 0x5eead4);
  const ring2 = createOrbitRing(3.5, -Math.PI / 3, Math.PI / 6, 0xe0a06b);
  const ring3 = createOrbitRing(2.7, Math.PI / 6, Math.PI / 3, 0x8cfaf0);
  ringGroup.add(ring1, ring2, ring3);

  // Helper to create 3D Text Canvas Sprites for WEB, AI, ROBOTICS, RM
  function createTextSprite(text, colorHex, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Glass pill background
    ctx.fillStyle = bgColor || 'rgba(14, 41, 32, 0.85)';
    ctx.strokeStyle = colorHex || '#5eead4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 236, 108, 20);
    ctx.fill();
    ctx.stroke();

    // Text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.4, 0.7, 1);
    return sprite;
  }

  // Create Discipline Nodes
  const nodeWeb = createTextSprite('WEB', '#5eead4', 'rgba(14, 41, 32, 0.9)');
  const nodeAI = createTextSprite('AI', '#e0a06b', 'rgba(40, 24, 14, 0.9)');
  const nodeRobotics = createTextSprite('ROBOTICS', '#8cfaf0', 'rgba(14, 41, 32, 0.9)');
  const nodeCore = createTextSprite('RM · CORE', '#5eead4', 'rgba(7, 24, 19, 0.95)');

  nodeWeb.scale.set(1.2, 0.6, 1);
  nodeAI.scale.set(1.2, 0.6, 1);
  nodeRobotics.scale.set(1.6, 0.8, 1);
  nodeCore.scale.set(1.6, 0.8, 1);

  scene.add(nodeWeb, nodeAI, nodeRobotics, nodeCore);

  // 4. Interactivity & Drag Rotation Controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationX = 0;
  let targetRotationY = 0;
  let mousePos = { x: 0, y: 0 };

  const dom = renderer.domElement;

  dom.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    // Global mouse tracking for smooth camera movement
    const rect = dom.getBoundingClientRect();
    mousePos.x = ((e.clientX - rect.left) / width) * 2 - 1;
    mousePos.y = -((e.clientY - rect.top) / height) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  dom.addEventListener('mouseleave', () => { isDragging = false; });

  // Touch Support
  dom.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  dom.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  dom.addEventListener('touchend', () => { isDragging = false; });

  // 5. Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Auto continuous rotation
    if (!isDragging) {
      targetRotationY += 0.005;
      targetRotationX += 0.002;
    }

    // Dampened smooth rotation
    coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.08;
    coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.08;

    // Sub-geometries counter-rotations
    outerMesh.rotation.y -= 0.006;
    midMesh.rotation.x += 0.008;

    // Pulsing inner nucleus
    const pulseScale = 1 + Math.sin(elapsedTime * 3) * 0.08;
    innerMesh.scale.set(pulseScale, pulseScale, pulseScale);
    coreLight.intensity = 2.5 + Math.sin(elapsedTime * 4) * 1.0;

    // Orbiting 3D Nodes around the core
    const angle1 = elapsedTime * 0.7;
    const angle2 = elapsedTime * 0.7 + (Math.PI * 2 / 3);
    const angle3 = elapsedTime * 0.7 + (Math.PI * 4 / 3);

    const radius = 3.6;
    nodeWeb.position.x = Math.cos(angle1) * radius;
    nodeWeb.position.z = Math.sin(angle1) * radius;
    nodeWeb.position.y = Math.sin(elapsedTime * 1.5) * 0.5;

    nodeAI.position.x = Math.cos(angle2) * (radius * 1.1);
    nodeAI.position.z = Math.sin(angle2) * (radius * 1.1);
    nodeAI.position.y = Math.cos(elapsedTime * 1.3) * 0.6;

    nodeRobotics.position.x = Math.cos(angle3) * (radius * 0.95);
    nodeRobotics.position.z = Math.sin(angle3) * (radius * 0.95);
    nodeRobotics.position.y = Math.sin(elapsedTime * 1.8) * 0.7;

    nodeCore.position.set(0, 0, 0);

    // Parallax Camera shift
    camera.position.x += (mousePos.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (mousePos.y * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Handle Resize
  function onWindowResize() {
    if (!container) return;
    const newWidth = container.clientWidth || 450;
    const newHeight = container.clientHeight || 450;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }

  window.addEventListener('resize', onWindowResize);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
}
