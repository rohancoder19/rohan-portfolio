/**
 * Hyper-Realistic 3D Solar System Engine Component
 * Powered by Three.js WebGL with Procedural 2K Textures & Fresnel Rim Shaders
 */
export function initHero3DCore() {
  const container = document.getElementById('hero-3d-core');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 520;
  const height = container.clientHeight || 520;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
  camera.position.set(0, 8.0, 15.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const solarSystemGroup = new THREE.Group();
  scene.add(solarSystemGroup);

  // -------------------------------------------------------------
  // 2. Procedural Texture Generators
  // -------------------------------------------------------------

  function createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    grad.addColorStop(0, '#fff5cc');
    grad.addColorStop(0.3, '#ffaa00');
    grad.addColorStop(0.7, '#ff5500');
    grad.addColorStop(1, '#990000');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 512);

    // Sunspots & Solar Flares Noise
    ctx.fillStyle = 'rgba(60, 0, 0, 0.35)';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 6 + 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createMercuryTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#686561'; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#484542';
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 512; const y = Math.random() * 256;
      const r = Math.random() * 4 + 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // Craters
    ctx.strokeStyle = '#888480'; ctx.lineWidth = 1;
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 512; const y = Math.random() * 256;
      const r = Math.random() * 8 + 2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createVenusTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#e8cf94');
    grad.addColorStop(0.3, '#cda75f');
    grad.addColorStop(0.6, '#aa823c');
    grad.addColorStop(1, '#e8cf94');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);
    // Swirling Sulfuric Clouds
    ctx.fillStyle = 'rgba(255, 240, 200, 0.25)';
    for (let y = 0; y < 256; y += 8) {
      ctx.beginPath();
      ctx.ellipse(256 + Math.sin(y * 0.05) * 80, y, 200, 12, Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Oceans
    ctx.fillStyle = '#0f3869'; ctx.fillRect(0, 0, 1024, 512);

    // Continents
    ctx.fillStyle = '#2d6a4f';
    const landMasses = [
      { x: 200, y: 160, r: 120 }, { x: 260, y: 320, r: 100 }, // Americas
      { x: 520, y: 160, r: 110 }, { x: 550, y: 280, r: 120 }, // Europe & Africa
      { x: 740, y: 150, r: 140 }, { x: 820, y: 340, r: 75 }   // Asia & Australia
    ];
    landMasses.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      // Terrain highlights
      ctx.fillStyle = '#52b788';
      ctx.beginPath();
      ctx.arc(m.x + 10, m.y - 10, m.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2d6a4f';
    });

    // Polar Ice Caps
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, 1024, 30);
    ctx.fillRect(0, 482, 1024, 30);
    return new THREE.CanvasTexture(canvas);
  }

  function createEarthCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 0)'; ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 400 + 56;
      const rx = Math.random() * 140 + 30;
      const ry = Math.random() * 25 + 8;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.random() * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Rusted terrain
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#bc4749');
    grad.addColorStop(0.5, '#9e2a2b');
    grad.addColorStop(1, '#6b1718');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#541212';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512; const y = Math.random() * 256;
      const r = Math.random() * 6 + 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    // White Polar Ice Caps
    ctx.fillStyle = 'rgba(240, 245, 255, 0.95)';
    ctx.beginPath(); ctx.arc(256, 12, 45, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(256, 244, 40, 0, Math.PI * 2); ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  function createJupiterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const colors = ['#d4a373', '#bc6c25', '#f4a261', '#e76f51', '#264653', '#e9c46a', '#dda15e'];
    for (let y = 0; y < 512; y += 16) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(0, y, 1024, 16 + Math.sin(y * 0.1) * 6);
    }

    // The Great Red Spot
    ctx.fillStyle = '#b7094c';
    ctx.beginPath();
    ctx.ellipse(650, 340, 65, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a71e34'; ctx.lineWidth = 6;
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  function createSaturnTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const colors = ['#e9c46a', '#f4a261', '#e76f51', '#2a9d8f', '#e9c46a'];
    for (let y = 0; y < 256; y += 12) {
      ctx.fillStyle = colors[(y / 12) % colors.length];
      ctx.fillRect(0, y, 512, 12);
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 64);

    for (let x = 0; x < 512; x++) {
      // Cassini Division gap between x = 320 and 340
      if (x > 315 && x < 340) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      } else {
        const alpha = Math.sin((x / 512) * Math.PI) * 0.85;
        ctx.fillStyle = `rgba(233, 196, 106, ${alpha})`;
      }
      ctx.fillRect(x, 0, 1, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createUranusTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#a8dedf');
    grad.addColorStop(0.5, '#56b3b4');
    grad.addColorStop(1, '#328b8c');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);
    return new THREE.CanvasTexture(canvas);
  }

  function createNeptuneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#4361ee');
    grad.addColorStop(0.5, '#3a0ca3');
    grad.addColorStop(1, '#190a5e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);

    // Great Dark Spot
    ctx.fillStyle = '#0f0536';
    ctx.beginPath(); ctx.ellipse(320, 150, 45, 25, Math.PI / 10, 0, Math.PI * 2); ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  // -------------------------------------------------------------
  // 3. Atmospheric Fresnel Rim Shader Generator
  // -------------------------------------------------------------

  function createAtmosphereMesh(geometry, glowColorHex, scale = 1.12) {
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vPosition = normalize(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform vec3 glowColor;
      void main() {
        float intensity = pow(0.62 - dot(vNormal, -vPosition), 2.2);
        gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.95;
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(glowColorHex) }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, mat);
    mesh.scale.set(scale, scale, scale);
    return mesh;
  }

  // -------------------------------------------------------------
  // 4. Central Sun & Lighting
  // -------------------------------------------------------------

  const sunGeo = new THREE.SphereGeometry(1.35, 64, 64);
  const sunMat = new THREE.MeshBasicMaterial({
    map: createSunTexture()
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  solarSystemGroup.add(sunMesh);

  // Outer Corona Flare Mesh
  const coronaGeo = new THREE.SphereGeometry(1.6, 32, 32);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide
  });
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  solarSystemGroup.add(coronaMesh);

  // Sun Point Light
  const sunLight = new THREE.PointLight(0xfff5ea, 4.2, 45);
  sunLight.position.set(0, 0, 0);
  solarSystemGroup.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x1a2e26, 1.1);
  scene.add(ambientLight);

  // -------------------------------------------------------------
  // 5. 3D Text Canvas Sprites for Discipline Badges
  // -------------------------------------------------------------

  function createTextSprite(text, colorHex, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor || 'rgba(14, 41, 32, 0.88)';
    ctx.strokeStyle = colorHex || '#5eead4';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(10, 10, 236, 108, 20); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.4, 0.7, 1);
    return sprite;
  }

  const sunBadge = createTextSprite('RM CORE', '#e0a06b', 'rgba(40, 24, 14, 0.92)');
  sunBadge.position.set(0, 2.2, 0);
  sunBadge.scale.set(1.3, 0.65, 1);
  solarSystemGroup.add(sunBadge);

  // -------------------------------------------------------------
  // 6. Photorealistic Planets Construction
  // -------------------------------------------------------------

  const planetsData = [
    { name: 'Mercury', radius: 0.18, distance: 2.2, speed: 2.2, texture: createMercuryTexture(), specular: 0x222222, glow: 0x888888 },
    { name: 'Venus', radius: 0.28, distance: 3.1, speed: 1.6, texture: createVenusTexture(), specular: 0x443311, glow: 0xe8cf94 },
    { name: 'Earth', radius: 0.34, distance: 4.2, speed: 1.1, texture: createEarthTexture(), specular: 0x5eead4, glow: 0x4198d7, hasClouds: true, hasMoon: true, badge: 'FULL-STACK' },
    { name: 'Mars', radius: 0.24, distance: 5.3, speed: 0.85, texture: createMarsTexture(), specular: 0x331111, glow: 0xbc4749 },
    { name: 'Jupiter', radius: 0.72, distance: 6.8, speed: 0.55, texture: createJupiterTexture(), specular: 0x553311, glow: 0xd4a373, badge: 'AI & ML' },
    { name: 'Saturn', radius: 0.58, distance: 8.5, speed: 0.38, texture: createSaturnTexture(), specular: 0x554422, glow: 0xe9c46a, hasRings: true, badge: 'ROBOTICS' },
    { name: 'Uranus', radius: 0.42, distance: 10.0, speed: 0.26, texture: createUranusTexture(), specular: 0x224444, glow: 0x56b3b4 },
    { name: 'Neptune', radius: 0.40, distance: 11.4, speed: 0.18, texture: createNeptuneTexture(), specular: 0x112244, glow: 0x4361ee }
  ];

  const planets = [];

  planetsData.forEach(pData => {
    // Orbital path torus ring
    const orbitGeo = new THREE.TorusGeometry(pData.distance, 0.015, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.18 });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2;
    solarSystemGroup.add(orbitMesh);

    // Planet pivot group
    const pivot = new THREE.Group();
    solarSystemGroup.add(pivot);

    // Planet Mesh
    const pGeo = new THREE.SphereGeometry(pData.radius, 64, 64);
    const pMat = new THREE.MeshPhongMaterial({
      map: pData.texture,
      specular: pData.specular || 0x222222,
      shininess: pData.name === 'Earth' ? 40 : 15
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.x = pData.distance;
    pivot.add(pMesh);

    // Atmospheric Rim Glow Shader
    if (pData.glow) {
      const atmosMesh = createAtmosphereMesh(pGeo, pData.glow, 1.12);
      pMesh.add(atmosMesh);
    }

    // Earth Cloud Layer Mesh (Rotating independently)
    let earthCloudsMesh = null;
    if (pData.hasClouds) {
      const cloudGeo = new THREE.SphereGeometry(pData.radius * 1.03, 64, 64);
      const cloudMat = new THREE.MeshPhongMaterial({
        map: createEarthCloudTexture(),
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      earthCloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
      pMesh.add(earthCloudsMesh);
    }

    // Saturn 3D Rings with Cassini Division gap
    if (pData.hasRings) {
      const ringGeo = new THREE.RingGeometry(pData.radius * 1.35, pData.radius * 2.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        map: createSaturnRingTexture(),
        side: THREE.DoubleSide,
        transparent: true
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.6;
      pMesh.add(ringMesh);
    }

    // Earth's Moon
    let moonMesh = null;
    if (pData.hasMoon) {
      const moonGeo = new THREE.SphereGeometry(0.09, 32, 32);
      const moonMat = new THREE.MeshPhongMaterial({
        map: createMercuryTexture()
      });
      moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.position.x = 0.65;
      pMesh.add(moonMesh);
    }

    // Floating Badge Label
    let badgeSprite = null;
    if (pData.badge) {
      const color = pData.name === 'Earth' ? '#5eead4' : (pData.name === 'Jupiter' ? '#e0a06b' : '#8cfaf0');
      badgeSprite = createTextSprite(pData.badge, color);
      badgeSprite.scale.set(1.2, 0.6, 1);
      badgeSprite.position.set(0, pData.radius + 0.65, 0);
      pMesh.add(badgeSprite);
    }

    planets.push({
      pivot: pivot,
      mesh: pMesh,
      cloudsMesh: earthCloudsMesh,
      moonMesh: moonMesh,
      badge: badgeSprite,
      speed: pData.speed,
      distance: pData.distance,
      angle: Math.random() * Math.PI * 2
    });
  });

  // -------------------------------------------------------------
  // 7. Interactivity & 360° Camera Drag Controls
  // -------------------------------------------------------------

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

  // -------------------------------------------------------------
  // 8. Render & Animation Loop
  // -------------------------------------------------------------

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate Sun
    sunMesh.rotation.y += 0.003;
    coronaMesh.rotation.y -= 0.002;

    // Orbit & Rotate Planets
    planets.forEach(p => {
      p.angle += p.speed * 0.005;
      p.pivot.rotation.y = p.angle;
      p.mesh.rotation.y += 0.012;

      // Independent Earth Clouds rotation
      if (p.cloudsMesh) {
        p.cloudsMesh.rotation.y += 0.016;
      }

      // Moon orbit around Earth
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
    camera.position.y += (8.0 + mousePos.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    if (!container) return;
    const newWidth = container.clientWidth || 520;
    const newHeight = container.clientHeight || 520;
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
