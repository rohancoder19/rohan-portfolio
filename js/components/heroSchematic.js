export function initHeroSchematic() {
  const schematic = document.querySelector('.schematic');
  if (!schematic) return;

  // Add interactive click/touch burst pulse effect to schematic pads and traces
  schematic.addEventListener('click', () => {
    const pulses = schematic.querySelectorAll('.pulse');
    pulses.forEach(p => {
      p.style.animation = 'none';
      // Trigger reflow
      void p.offsetWidth;
      p.style.animation = 'travel 1.5s linear infinite';
      setTimeout(() => {
        p.style.animation = '';
      }, 3000);
    });

    const chipBox = schematic.querySelector('.chip-box');
    if (chipBox) {
      chipBox.style.stroke = '#8cfaf0';
      chipBox.style.filter = 'drop-shadow(0 0 20px rgba(94, 234, 212, 0.8))';
      setTimeout(() => {
        chipBox.style.stroke = '';
        chipBox.style.filter = '';
      }, 800);
    }
  });
}
