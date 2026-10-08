const parts = {
  cpu: { name: 'CPU', fullName: 'Central processing unit', image: 'assets/cpu.svg', explanation: 'The CPU fetches and executes instructions, performs calculations, and coordinates tasks.' },
  ram: { name: 'RAM', fullName: 'Random-access memory', image: 'assets/ram.svg', explanation: 'RAM is fast, temporary working memory for information currently used by active programs.' },
  ssd: { name: 'SSD', fullName: 'Solid-state drive', image: 'assets/ssd.svg', explanation: 'An SSD stores files and applications long term, retaining data when the computer is switched off.' },
  gpu: { name: 'GPU', fullName: 'Graphics processing unit', image: 'assets/gpu.svg', explanation: 'A GPU specializes in rendering images and video, and accelerating graphics-heavy calculations.' },
  psu: { name: 'PSU', fullName: 'Power supply unit', image: 'assets/psu.svg', explanation: 'The PSU converts wall power into regulated DC electricity that computer components can use.' },
  motherboard: { name: 'MOTHERBOARD', fullName: 'Main circuit board', image: 'assets/motherboard.svg', explanation: 'The motherboard connects the computer’s components and provides pathways for them to communicate.' }
};

const bin = document.querySelector('#component-bin');
const slots = [...document.querySelectorAll('.mission-slot')];
const feedback = document.querySelector('#match-feedback');
const placedCount = document.querySelector('#placed-count');
const placedProgress = document.querySelector('#placed-progress');
const binCount = document.querySelector('#bin-count');
const summaryCaption = document.querySelector('#summary-caption');
const finishPanel = document.querySelector('#match-finish');
let selectedPart = null;
let placed = 0;

function setFeedback(message, type = '') {
  feedback.textContent = message;
  feedback.classList.remove('success', 'error');
  if (type) feedback.classList.add(type);
}

function selectPart(card) {
  if (card.classList.contains('matched')) return;
  bin.querySelectorAll('.part-card').forEach((partCard) => {
    const isSelected = partCard === card && selectedPart !== card;
    partCard.classList.toggle('selected', isSelected);
    partCard.setAttribute('aria-pressed', String(isSelected));
  });
  selectedPart = selectedPart === card ? null : card;
  if (selectedPart) {
    setFeedback(`${parts[selectedPart.dataset.component].name} selected. Choose the mission it performs.`);
  } else {
    setFeedback('Selection cleared. Choose a component to continue.');
  }
}

function placePart(componentId, slot) {
  const part = parts[componentId];
  if (!part || slot.classList.contains('matched')) return;

  if (slot.dataset.answer !== componentId) {
    slot.classList.remove('incorrect-drop');
    void slot.offsetWidth;
    slot.classList.add('incorrect-drop');
    setFeedback(`Not quite. ${part.name} doesn’t perform that job—try another mission.`, 'error');
    return;
  }

  slot.classList.remove('incorrect-drop');
  slot.classList.add('matched');
  slot.setAttribute('aria-label', `${part.name} matched. ${part.explanation}`);
  const confirmation = document.createElement('span');
  const image = document.createElement('img');
  confirmation.className = 'matched-part';
  image.src = part.image;
  image.alt = '';
  confirmation.append(image, document.createTextNode(`${part.name} ✓`));
  slot.append(confirmation);

  const card = bin.querySelector(`[data-component="${componentId}"]`);
  card.classList.remove('selected');
  card.classList.add('matched');
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `${part.name} matched. ${part.explanation}`);
  if (selectedPart === card) selectedPart = null;

  placed += 1;
  placedCount.textContent = String(placed).padStart(2, '0');
  placedProgress.style.width = `${(placed / Object.keys(parts).length) * 100}%`;
  binCount.textContent = `${String(Object.keys(parts).length - placed).padStart(2, '0')} LEFT`;
  summaryCaption.textContent = placed === Object.keys(parts).length ? 'Every component found its function.' : `${part.name}: ${part.explanation}`;
  setFeedback(`${part.name} — ${part.explanation}`, 'success');

  if (placed === Object.keys(parts).length) {
    finishPanel.hidden = false;
    setFeedback('All six matches are correct. System knowledge: online.', 'success');
    finishPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

bin.addEventListener('click', (event) => {
  const card = event.target.closest('.part-card');
  if (card) selectPart(card);
});

bin.addEventListener('dragstart', (event) => {
  const card = event.target.closest('.part-card');
  if (!card || card.classList.contains('matched')) return;
  selectedPart = card;
  event.dataTransfer.setData('text/plain', card.dataset.component);
  event.dataTransfer.effectAllowed = 'move';
  card.classList.add('dragging');
});

bin.addEventListener('dragend', (event) => {
  event.target.closest('.part-card')?.classList.remove('dragging');
});

slots.forEach((slot) => {
  slot.addEventListener('dragover', (event) => {
    if (slot.classList.contains('matched')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    slot.classList.add('drag-over');
  });

  slot.addEventListener('dragleave', (event) => {
    if (!slot.contains(event.relatedTarget)) slot.classList.remove('drag-over');
  });

  slot.addEventListener('drop', (event) => {
    event.preventDefault();
    slot.classList.remove('drag-over');
    placePart(event.dataTransfer.getData('text/plain'), slot);
  });

  slot.addEventListener('click', () => {
    if (selectedPart) placePart(selectedPart.dataset.component, slot);
  });

  slot.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && selectedPart) {
      event.preventDefault();
      placePart(selectedPart.dataset.component, slot);
    }
  });
});

function resetLab() {
  placed = 0;
  selectedPart = null;
  placedCount.textContent = '00';
  placedProgress.style.width = '0%';
  binCount.textContent = '06 LEFT';
  summaryCaption.textContent = 'All parts are waiting for a job.';
  finishPanel.hidden = true;
  bin.querySelectorAll('.part-card').forEach((card) => {
    card.classList.remove('matched', 'selected', 'dragging');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('draggable', 'true');
    card.setAttribute('aria-label', `${parts[card.dataset.component].name}, ${parts[card.dataset.component].fullName}. Select or drag this component.`);
  });
  slots.forEach((slot) => {
    slot.classList.remove('matched', 'incorrect-drop', 'drag-over');
    slot.querySelector('.matched-part')?.remove();
    slot.setAttribute('aria-label', `Mission: ${slot.querySelector('.slot-copy strong').textContent} Drop or select the matching component here.`);
  });
  setFeedback('Select a hardware card to get started.');
}

document.querySelector('#reset-lab').addEventListener('click', resetLab);
document.querySelector('#play-again').addEventListener('click', resetLab);
