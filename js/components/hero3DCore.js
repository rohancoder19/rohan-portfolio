/**
 * Interactive 3D Solar System Engine Component
 * Powered by Three.js WebGL
 */
export function initHero3DCore() {
  const container = document.getElementById('hero-3d-core');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 500;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
  camera.position.set(0, 7.5, 14.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Solar System Parent Group
  const solarSystemGroup = new THREE.Group();
  scene.add(solarSystemGroup);

  // 2. Central Sun
  const sunGeo = new THREE.SphereGeometry(1.35, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xffaa22
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  solarSystemGroup.add(sunMesh);

  // Sun Solar Atmosphere Glow Layer
  const sunGlowGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffdd66,
    transparent: true,
    opacity: 0.28,
    side: THREE.BackSide
  });
  const sunGlowMesh = new THREE.Mesh(sunGlowGeo, sunGlowMat);
  solarSystemGroup.add(sunGlowMesh);

  // Sun Point Light (illuminates planets in 3D space)
  const sunLight = new THREE.PointLight(0xffeedd, 3.8, 40);
  sunLight.position.set(0, 0, 0);
  solarSystemGroup.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x1a2e26, 1.2);
  scene.add(ambientLight);

  // 3. Helper to create 3D Text Canvas Sprites for Labels
  function createTextSprite(text, colorHex, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor || 'rgba(14, 41, 32, 0.88)';
    ctx.strokeStyle = colorHex || '#5eead4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 236, 108, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.4, 0.7, 1);
    return sprite;
  }

  // Sun Badge
  const sunBadge = createTextSprite('RM CORE', '#e0a06b', 'rgba(40, 24, 14, 0.92)');
  sunBadge.position.set(0, 2.1, 0);
  sunBadge.scale.set(1.3, 0.65, 1);
  solarSystemGroup.add(sunBadge);

  // 4. Planets Definition
  const planetsData = [
    { name: 'Mercury', radius: 0.18, distance: 2.2, speed: 2.2, color: 0xa9b2b9, specular: 0x333333 },
    { name: 'Venus', radius: 0.28, distance: 3.1, speed: 1.6, color: 0xe3bb76, specular: 0x554422 },
    { name: 'Earth', radius: 0.32, distance: 4.2, speed: 1.1, color: 0x4198d7, specular: 0x5eead4, hasMoon: true, badge: 'FULL-STACK' },
    { name: 'Mars', radius: 0.24, distance: 5.3, speed: 0.85, color: 0xd15c3d, specular: 0x442211 },
    { name: 'Jupiter', radius: 0.72, distance: 6.8, speed: 0.55, color: 0xc49a6c, specular: 0x664422, badge: 'AI & ML' },
    { name: 'Saturn', radius: 0.58, distance: 8.5, speed: 0.38, color: 0xe0c888, specular: 0x554422, hasRings: true, badge: 'ROBOTICS' },
    { name: 'Uranus', radius: 0.42, distance: 10.0, speed: 0.26, color: 0x68d8d6, specular: 0x225555 },
    { name: 'Neptune', radius: 0.4, distance: 11.4, speed: 0.18, color: 0x3861d8, specular: 0x112255 }
  ];

  const planets = [];

  planetsData.forEach(pData => {
    // Orbital path ring line
    const orbitGeo = new THREE.TorusGeometry(pData.distance, 0.015, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.18 });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2;
    solarSystemGroup.add(orbitMesh);

    // Planet pivot group
    const pivot = new THREE.Group();
    solarSystemGroup.add(pivot);

    // Planet sphere mesh
    const pGeo = new THREE.SphereGeometry(pData.radius, 32, 32);
    const pMat = new THREE.MeshPhongMaterial({
      color: pData.color,
      specular: pData.specular || 0x222222,
      shininess: 25
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.x = pData.distance;
    pivot.add(pMesh);

    // Saturn 3D Rings
    if (pData.hasRings) {
      const ringGeo = new THREE.RingGeometry(pData.radius * 1.35, pData.radius * 2.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xdfc588,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.6;
      pMesh.add(ringMesh);
    }

    // Earth's Moon
    let moonMesh = null;
    if (pData.hasMoon) {
      const moonGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const moonMat = new THREE.MeshPhongMaterial({ color: 0xd0d0d0 });
      moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.position.x = 0.6;
      pMesh.add(moonMesh);
    }

    // Floating Badge Label
    let badgeSprite = null;
    if (pData.badge) {
      const color = pData.name === 'Earth' ? '#5eead4' : (pData.name === 'Jupiter' ? '#e0a06b' : '#8cfaf0');
      badgeSprite = createTextSprite(pData.badge, color);
      badgeSprite.scale.set(1.2, 0.6, 1);
      badgeSprite.position.set(0, pData.radius + 0.6, 0);
      pMesh.add(badgeSprite);
    }

    planets.push({
      pivot: pivot,
      mesh: pMesh,
      moonMesh: moonMesh,
      badge: badgeSprite,
      speed: pData.speed,
      distance: pData.distance,
      angle: Math.random() * Math.PI * 2
    });
  });

  // 5. Interactivity & 360° Drag Controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationX = 0.25;
  let targetRotationY = 0;
  let mousePos = { x: 0, y: 0 };

  const dom = renderer.domElement;

  dom.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    const rect = dom.getBoundingClientRect();
    mousePos.x = ((e.clientX - rect.left) / width) * 2 - 1;
    mousePos.y = -((e.clientY - rect.top) / height) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.006;
      targetRotationX += deltaY * 0.006;
      // Clamp vertical tilt angle
      targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  dom.addEventListener('mouseleave', () => { isDragging = false; });

  // Touch Controls
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
      targetRotationY += deltaX * 0.006;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  dom.addEventListener('touchend', () => { isDragging = false; });

  // 6. Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Rotate Sun
    sunMesh.rotation.y += 0.004;

    // Orbit & Rotate Planets
    planets.forEach(p => {
      p.angle += p.speed * 0.006;
      p.pivot.rotation.y = p.angle;
      p.mesh.rotation.y += 0.015;

      if (p.moonMesh) {
        p.moonMesh.position.x = Math.cos(elapsedTime * 3) * 0.65;
        p.moonMesh.position.z = Math.sin(elapsedTime * 3) * 0.65;
      }
    });

    // Smooth Drag Rotation
    solarSystemGroup.rotation.y += (targetRotationY - solarSystemGroup.rotation.y) * 0.08;
    solarSystemGroup.rotation.x += (targetRotationX - solarSystemGroup.rotation.x) * 0.08;

    // Smooth Camera Mouse Parallax
    camera.position.x += (mousePos.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (7.5 + mousePos.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  // Handle Window Resize
  function onWindowResize() {
    if (!container) return;
    const newWidth = container.clientWidth || 500;
    const newHeight = container.clientHeight || 500;
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
