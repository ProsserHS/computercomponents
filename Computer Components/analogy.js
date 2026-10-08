const analogyItems = [
  {
    id: 'cpu', name: 'CPU', fullName: 'Central processing unit', image: 'assets/cpu.svg',
    sublabel: 'PROCESSES INSTRUCTIONS', bodyIcon: '🧠', bodyName: 'The brain',
    bodyRole: 'Thoughts, decisions, consciousness, and control.',
    explanation: 'Like the brain, the CPU processes instructions and coordinates operations.'
  },
  {
    id: 'ram', name: 'RAM', fullName: 'Short-term memory', image: 'assets/ram.svg',
    sublabel: 'TEMPORARY WORKING MEMORY', bodyIcon: '💭', bodyName: 'Working memory',
    bodyRole: 'Immediate recall, focus, and current tasks.',
    explanation: 'RAM is like working memory: it holds information you need right now, but is temporary.'
  },
  {
    id: 'storage', name: 'HARD DRIVE / SSD', fullName: 'Long-term storage', image: 'assets/ssd.svg',
    sublabel: 'SAVES FILES AND APPS', bodyIcon: '📚', bodyName: 'Long-term memory',
    bodyRole: 'Stored knowledge, past experiences, and learned skills.',
    explanation: 'Storage is like long-term memory: saved files remain available, like retained knowledge and experiences.'
  },
  {
    id: 'motherboard', name: 'MOTHERBOARD', fullName: 'Main system board', image: 'assets/motherboard.svg',
    sublabel: 'CONNECTS COMPONENTS', bodyIcon: '🦴', bodyName: 'Nervous system & skeleton',
    bodyRole: 'Sends signals throughout the body and provides structural support.',
    explanation: 'The motherboard connects parts so they can communicate; the nervous system sends signals, while the skeleton provides structure.'
  },
  {
    id: 'psu', name: 'POWER SUPPLY (PSU)', fullName: 'Power supply unit', image: 'assets/psu.svg',
    sublabel: 'DELIVERS ELECTRICITY', bodyIcon: '❤️', bodyName: 'Heart & digestion',
    bodyRole: 'Pumps blood and supplies energy and nutrients.',
    explanation: 'The PSU supplies power to components, like the heart and digestive system help deliver energy around the body.'
  },
  {
    id: 'gpu', name: 'GRAPHICS CARD (GPU)', fullName: 'Graphics processing unit', image: 'assets/gpu.svg',
    sublabel: 'PROCESSES VISUALS', bodyIcon: '👁️', bodyName: 'Eyes & visual processing',
    bodyRole: 'Visual perception, sight, and recognition.',
    explanation: 'The GPU processes images for display, much like eyes and the brain’s visual pathways process what you see.'
  },
  {
    id: 'cooling', name: 'COOLING SYSTEM', fullName: 'Fans and heat sink', image: 'assets/cooling.svg',
    sublabel: 'DISSIPATES HEAT', bodyIcon: '🌡️', bodyName: 'Thermoregulation',
    bodyRole: 'Maintains a steady temperature through sweating and regulation.',
    explanation: 'Fans and heat sinks release heat; thermoregulation, including sweating, helps keep body temperature in a safe range.'
  },
  {
    id: 'io', name: 'INPUT / OUTPUT', fullName: 'Peripherals', image: 'assets/io.svg',
    sublabel: 'USER INTERACTION', bodyIcon: '🗣️', bodyName: 'Senses & expression',
    bodyRole: 'Receiving input, communication, and movement.',
    explanation: 'Peripherals carry information in and out: keyboards and mics are input, while screens and speakers are output.'
  }
];

const partContainer = document.querySelector('#analogy-parts');
const targetContainer = document.querySelector('#analogy-targets');
const feedback = document.querySelector('#analogy-feedback');
const matchCount = document.querySelector('#match-count');
const matchProgress = document.querySelector('#match-progress');
const partsLeft = document.querySelector('#parts-left');
const scoreMessage = document.querySelector('#score-message');
const finishPanel = document.querySelector('#analogy-finish');
let selectedPart = null;
let matchedCount = 0;

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function setFeedback(message, type = '') {
  feedback.textContent = message;
  feedback.classList.remove('success', 'error');
  if (type) feedback.classList.add(type);
}

function makePart(item) {
  const button = document.createElement('button');
  const image = document.createElement('img');
  const copy = document.createElement('span');
  const name = document.createElement('strong');
  const sublabel = document.createElement('small');
  const grip = document.createElement('span');
  button.type = 'button';
  button.className = 'analogy-part';
  button.draggable = true;
  button.dataset.component = item.id;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `${item.name}, ${item.fullName}. Select or drag this component.`);
  image.src = item.image;
  image.alt = `${item.name} hardware icon`;
  copy.className = 'analogy-part-copy';
  name.textContent = item.name;
  sublabel.textContent = item.sublabel;
  copy.append(name, sublabel);
  grip.className = 'analogy-part-grip';
  grip.setAttribute('aria-hidden', 'true');
  grip.textContent = '⠿';
  button.append(image, copy, grip);
  button.addEventListener('click', () => selectPart(button));
  button.addEventListener('dragstart', (event) => {
    selectedPart = button;
    event.dataTransfer.setData('text/plain', item.id);
    event.dataTransfer.effectAllowed = 'move';
    button.classList.add('dragging');
  });
  button.addEventListener('dragend', () => button.classList.remove('dragging'));
  return button;
}

function makeTarget(item) {
  const target = document.createElement('div');
  const icon = document.createElement('span');
  const copy = document.createElement('span');
  const name = document.createElement('strong');
  const role = document.createElement('small');
  const hint = document.createElement('span');
  target.className = 'analogy-target';
  target.dataset.answer = item.id;
  target.tabIndex = 0;
  target.setAttribute('role', 'button');
  target.setAttribute('aria-label', `Human body match: ${item.bodyName}. ${item.bodyRole} Select or drop the matching computer component here.`);
  icon.className = 'human-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = item.bodyIcon;
  copy.className = 'human-copy';
  name.textContent = item.bodyName;
  role.textContent = item.bodyRole;
  copy.append(name, role);
  hint.className = 'body-drop-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.append(document.createTextNode('MATCH '));
  const plus = document.createElement('span');
  plus.textContent = '＋';
  hint.append(plus);
  target.append(icon, copy, hint);
  target.addEventListener('click', () => {
    if (selectedPart) placePart(selectedPart.dataset.component, target);
  });
  target.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && selectedPart) {
      event.preventDefault();
      placePart(selectedPart.dataset.component, target);
    }
  });
  target.addEventListener('dragover', (event) => {
    if (target.classList.contains('matched')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    target.classList.add('drag-over');
  });
  target.addEventListener('dragleave', (event) => {
    if (!target.contains(event.relatedTarget)) target.classList.remove('drag-over');
  });
  target.addEventListener('drop', (event) => {
    event.preventDefault();
    target.classList.remove('drag-over');
    placePart(event.dataTransfer.getData('text/plain'), target);
  });
  return target;
}

function renderGame() {
  partContainer.replaceChildren(...shuffle(analogyItems).map(makePart));
  targetContainer.replaceChildren(...shuffle(analogyItems).map(makeTarget));
}

function selectPart(button) {
  if (button.classList.contains('matched')) return;
  partContainer.querySelectorAll('.analogy-part').forEach((card) => {
    const isSelected = card === button && selectedPart !== button;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-pressed', String(isSelected));
  });
  selectedPart = selectedPart === button ? null : button;
  setFeedback(selectedPart
    ? `${analogyItems.find((item) => item.id === selectedPart.dataset.component).name} selected. Choose the human-body function that is most similar.`
    : 'Selection cleared. Choose another component.');
}

function placePart(componentId, target) {
  const item = analogyItems.find((entry) => entry.id === componentId);
  if (!item || target.classList.contains('matched')) return;
  if (target.dataset.answer !== componentId) {
    target.classList.remove('incorrect-drop');
    void target.offsetWidth;
    target.classList.add('incorrect-drop');
    setFeedback(`Not quite. Think about the job of the ${item.name} and try another body function.`, 'error');
    return;
  }

  target.classList.remove('incorrect-drop');
  target.classList.add('matched');
  target.setAttribute('aria-label', `${item.name} matched with ${item.bodyName}. ${item.explanation}`);
  const matched = document.createElement('span');
  const image = document.createElement('img');
  matched.className = 'matched-hardware';
  image.src = item.image;
  image.alt = '';
  matched.append(image, document.createTextNode(`${item.name} ✓`));
  target.append(matched);

  const card = partContainer.querySelector(`[data-component="${componentId}"]`);
  card.classList.remove('selected');
  card.classList.add('matched');
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `${item.name} matched with ${item.bodyName}. ${item.explanation}`);
  if (selectedPart === card) selectedPart = null;

  matchedCount += 1;
  matchCount.textContent = String(matchedCount).padStart(2, '0');
  matchProgress.style.width = `${(matchedCount / analogyItems.length) * 100}%`;
  partsLeft.textContent = `${String(analogyItems.length - matchedCount).padStart(2, '0')} PARTS`;
  scoreMessage.textContent = item.explanation;
  setFeedback(`${item.name} ↔ ${item.bodyName}: ${item.explanation}`, 'success');

  if (matchedCount === analogyItems.length) {
    finishPanel.hidden = false;
    setFeedback('All eight comparisons are matched. You can now explain how the systems are alike.', 'success');
    finishPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function resetGame() {
  selectedPart = null;
  matchedCount = 0;
  matchCount.textContent = '00';
  matchProgress.style.width = '0%';
  partsLeft.textContent = '08 PARTS';
  scoreMessage.textContent = 'Start by choosing a computer component.';
  finishPanel.hidden = true;
  renderGame();
  setFeedback('Select any part to see where it belongs.');
}

document.querySelector('#reset-analogy').addEventListener('click', resetGame);
document.querySelector('#play-again').addEventListener('click', resetGame);
renderGame();
