import { contactData } from '../data/contact.js';

export function renderContactSection() {
  const container = document.getElementById('contactPanel');
  if (!container) return;

  container.innerHTML = '';

  // Header
  const head = document.createElement('div');
  head.className = 'contact-panel-head';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = contactData.header.title;
  head.appendChild(eyebrow);

  const note = document.createElement('span');
  note.className = 'note';
  note.textContent = contactData.header.subtitle;
  head.appendChild(note);

  container.appendChild(head);

  // Pins
  contactData.pins.forEach(pin => {
    const a = document.createElement('a');
    a.className = 'pin-row';
    a.href = pin.href;
    if (pin.href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }

    const idSpan = document.createElement('span');
    idSpan.className = 'pin-id';
    idSpan.textContent = pin.id;
    a.appendChild(idSpan);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'pin-label';
    labelSpan.textContent = pin.label;
    a.appendChild(labelSpan);

    const valSpan = document.createElement('span');
    valSpan.className = 'pin-value';
    valSpan.textContent = pin.value;
    a.appendChild(valSpan);

    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'pin-arrow';
    arrowSpan.textContent = '→';
    a.appendChild(arrowSpan);

    container.appendChild(a);
  });
}
