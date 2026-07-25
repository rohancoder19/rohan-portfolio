import { projectsData } from '../data/projects.js';
import { initCardTilt } from './cardTilt.js';

export function renderProjectsSection() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  container.innerHTML = '';

  projectsData.forEach(proj => {
    const article = document.createElement('article');
    article.className = 'proj-card reveal';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = proj.eyebrow;
    article.appendChild(eyebrow);

    const h3 = document.createElement('h3');
    h3.textContent = proj.title;
    article.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = proj.description;
    article.appendChild(p);

    const chipRow = document.createElement('div');
    chipRow.className = 'chip-row';
    proj.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = tag;
      chipRow.appendChild(span);
    });
    article.appendChild(chipRow);

    const linksDiv = document.createElement('div');
    linksDiv.className = 'proj-links';

    if (proj.links.github) {
      const gh = document.createElement('a');
      gh.href = proj.links.github;
      gh.target = '_blank';
      gh.rel = 'noopener';
      gh.textContent = 'GitHub';
      linksDiv.appendChild(gh);
    }

    if (proj.links.demo) {
      const demo = document.createElement('a');
      demo.href = proj.links.demo;
      demo.target = '_blank';
      demo.rel = 'noopener';
      demo.textContent = 'Live Demo';
      linksDiv.appendChild(demo);
    }

    if (proj.links.private) {
      const priv = document.createElement('span');
      priv.className = 'private';
      priv.textContent = proj.links.label || 'Repo Private';
      linksDiv.appendChild(priv);
    }

    article.appendChild(linksDiv);
    container.appendChild(article);
  });

  // Attach 3D card tilt effect
  initCardTilt('.proj-card');
}
