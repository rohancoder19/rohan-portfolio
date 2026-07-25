import { skillsData } from '../data/skills.js';
import { initCardTilt } from './cardTilt.js';

export function renderSkillsSection() {
  const container = document.getElementById('skillsGrid');
  if (!container) return;

  container.innerHTML = '';

  skillsData.forEach(group => {
    const tray = document.createElement('div');
    tray.className = 'tray reveal';

    const h3 = document.createElement('h3');
    h3.textContent = group.category;
    tray.appendChild(h3);

    const chipRow = document.createElement('div');
    chipRow.className = 'chip-row';

    group.skills.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = skill;
      chipRow.appendChild(span);
    });

    tray.appendChild(chipRow);
    container.appendChild(tray);
  });

  // Attach 3D tilt effect to skill trays for interactive AI developer feel
  initCardTilt('.tray');
}
