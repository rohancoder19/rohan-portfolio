/**
 * Multi-Layer 3D Perspective Card Tilt & Specular Lighting Component
 */
export function initCardTilt(selector, options = {}) {
  const cards = document.querySelectorAll(selector);
  const maxTilt = options.maxTilt || 10;
  const perspective = options.perspective || 1000;
  
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  cards.forEach(card => {
    // Ensure card has preserve-3d class/style for nested Z-depth layers
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate 3D tilt rotation angles
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      
      // Set CSS variables for dynamic specular spotlight effect
      card.style.setProperty('--mouse-x', `${(x / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height * 100).toFixed(1)}%`);
      
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease';
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)`;
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease';
    });
  });
}
