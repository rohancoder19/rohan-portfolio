/**
 * Interactive 3D Cyber Constellation & WebGL Background Scene
 * Powered by Three.js
 */
export function initCanvasBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  // Fallback to 2D canvas if Three.js is not loaded
  if (typeof THREE === 'undefined') {
    init2DFallback(canvas);
    return;
  }

  let width = window.innerWidth;
  let height = window.innerHeight;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06130e, 0.035);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 22;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. 3D Particle Starfield & Constellation Network
  const particleCount = 120;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 40;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 30;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015,
      z: (Math.random() - 0.5) * 0.015
    });
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x5eead4,
    size: 0.18,
    transparent: true,
    opacity: 0.8
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // 3. Lines connecting nearby 3D particles
  const maxConnections = particleCount * 6;
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(maxConnections * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x5eead4,
    transparent: true,
    opacity: 0.15
  });

  const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSystem);

  // 4. Floating 3D Deep Space Wireframe Polyhedra
  const floatingPolyhedra = [];
  const geometries = [
    new THREE.OctahedronGeometry(1.2, 0),
    new THREE.IcosahedronGeometry(1.4, 0),
    new THREE.TorusGeometry(1.2, 0.3, 8, 24),
    new THREE.TetrahedronGeometry(1.5, 0)
  ];

  const polyMatTeal = new THREE.MeshBasicMaterial({ color: 0x5eead4, wireframe: true, transparent: true, opacity: 0.22 });
  const polyMatCopper = new THREE.MeshBasicMaterial({ color: 0xe0a06b, wireframe: true, transparent: true, opacity: 0.22 });

  for (let i = 0; i < 6; i++) {
    const geo = geometries[i % geometries.length];
    const mat = i % 2 === 0 ? polyMatTeal : polyMatCopper;
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 20 - 5
    );

    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    scene.add(mesh);
    floatingPolyhedra.push({
      mesh: mesh,
      rotX: (Math.random() - 0.5) * 0.006,
      rotY: (Math.random() - 0.5) * 0.006,
      floatSpeed: Math.random() * 0.002 + 0.001,
      initialY: mesh.position.y
    });
  }

  // 5. Mouse Parallax & Light Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 4;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
  });

  // 6. Resize Handler
  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  // 7. Render & Animation Loop
  const connectionDistanceSq = 8 * 8;
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Mouse camera smoothing
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x = mouseX * 1.2;
    camera.position.y = mouseY * 1.2;
    camera.lookAt(scene.position);

    // Update particle positions
    const positions = particleGeometry.attributes.position.array;
    let lineVertexIdx = 0;

    for (let i = 0; i < particleCount; i++) {
      let px = positions[i * 3] + particleVelocities[i].x;
      let py = positions[i * 3 + 1] + particleVelocities[i].y;
      let pz = positions[i * 3 + 2] + particleVelocities[i].z;

      // Bounce at boundary limits
      if (Math.abs(px) > 22) particleVelocities[i].x *= -1;
      if (Math.abs(py) > 22) particleVelocities[i].y *= -1;
      if (Math.abs(pz) > 18) particleVelocities[i].z *= -1;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      // Check proximity for constellation line segments
      for (let j = i + 1; j < particleCount; j++) {
        const dx = px - positions[j * 3];
        const dy = py - positions[j * 3 + 1];
        const dz = pz - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < connectionDistanceSq) {
          const lineArray = lineGeometry.attributes.position.array;
          lineArray[lineVertexIdx++] = px;
          lineArray[lineVertexIdx++] = py;
          lineArray[lineVertexIdx++] = pz;
          lineArray[lineVertexIdx++] = positions[j * 3];
          lineArray[lineVertexIdx++] = positions[j * 3 + 1];
          lineArray[lineVertexIdx++] = positions[j * 3 + 2];
        }
      }
    }

    particleGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineVertexIdx / 3);

    // Animate floating polyhedra
    floatingPolyhedra.forEach((item, index) => {
      item.mesh.rotation.x += item.rotX;
      item.mesh.rotation.y += item.rotY;
      item.mesh.position.y = item.initialY + Math.sin(elapsedTime * 1.2 + index) * 0.8;
    });

    renderer.render(scene, camera);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
}

function init2DFallback(canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const connectionDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(94, 234, 212, 0.45)' : 'rgba(224, 160, 107, 0.45)'
    });
  }

  function animate2D() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(94, 234, 212, ${0.18 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate2D);
  }
  animate2D();
}
