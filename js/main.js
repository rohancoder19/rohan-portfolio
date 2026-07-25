import { profileData } from './data/profile.js';
import { initNavbar } from './components/navbar.js';
import { renderSkillsSection } from './components/skillsSection.js';
import { renderProjectsSection } from './components/projectsSection.js';
import { renderContactSection } from './components/contactSection.js';
import { initHeroSchematic } from './components/heroSchematic.js';
import { initCanvasBackground } from './components/canvasBackground.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render data-driven sections
  renderSpecSheet();
  renderSkillsSection();
  renderProjectsSection();
  renderContactSection();

  // 2. Initialize interactive UI components
  initNavbar();
  initHeroSchematic();
  initCanvasBackground();

  // 3. Setup Scroll Reveal Intersection Observer
  initScrollReveal();
});

function renderSpecSheet() {
  const specContainer = document.getElementById('specSheetRows');
  if (!specContainer || !profileData.specSheet) return;

  specContainer.innerHTML = '';
  profileData.specSheet.forEach(item => {
    const row = document.createElement('div');
    row.className = 'spec-row';

    const dt = document.createElement('dt');
    dt.textContent = item.label;
    row.appendChild(dt);

    const dd = document.createElement('dd');
    dd.textContent = item.value;
    row.appendChild(dd);

    specContainer.appendChild(row);
  });
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
}
