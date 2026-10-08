const questionBank = [
  {
    category: 'PROCESSING',
    icon: '🧠',
    prompt: 'Which component acts as the computer’s main processor, carrying out instructions and calculations?',
    choices: ['CPU', 'SSD', 'Power supply', 'RAM'],
    answer: 'CPU',
    explanation: 'The CPU (central processing unit) executes program instructions and coordinates work. It is often called the computer’s “brain.”'
  },
  {
    category: 'SHORT-TERM MEMORY',
    icon: '⚡',
    prompt: 'A game needs quick access to the data it is using right now. Where does that temporary working data go?',
    choices: ['RAM', 'Hard drive', 'Motherboard', 'GPU'],
    answer: 'RAM',
    explanation: 'RAM (random-access memory) holds data that active programs need quickly. It is temporary: its contents clear when the computer powers off.'
  },
  {
    category: 'LONG-TERM STORAGE',
    icon: '💾',
    prompt: 'Where are your saved files and applications kept, even after you turn the computer off?',
    choices: ['SSD or hard drive', 'CPU cache', 'RAM', 'Cooling fan'],
    answer: 'SSD or hard drive',
    explanation: 'An SSD or hard drive provides long-term, nonvolatile storage. Unlike RAM, it keeps files when power is off.'
  },
  {
    category: 'GRAPHICS & VIDEO',
    icon: '🎨',
    prompt: 'Which component specializes in rendering images, animations, and 3D scenes for the display?',
    choices: ['GPU', 'Power supply', 'Network card', 'CPU cooler'],
    answer: 'GPU',
    explanation: 'The GPU (graphics processing unit) performs the many parallel calculations needed for images, video, and 3D graphics.'
  },
  {
    category: 'THE CONNECTION HUB',
    icon: '🔗',
    prompt: 'The CPU, memory, storage, and other parts all connect to which main circuit board?',
    choices: ['Motherboard', 'Monitor', 'SSD', 'Power supply'],
    answer: 'Motherboard',
    explanation: 'The motherboard holds and connects the major components, allowing them to communicate through circuits and data pathways.'
  },
  {
    category: 'POWER',
    icon: '🔋',
    prompt: 'Which component converts electricity from a wall outlet into the power the computer’s parts can use?',
    choices: ['Power supply (PSU)', 'RAM', 'GPU', 'Motherboard'],
    answer: 'Power supply (PSU)',
    explanation: 'The PSU converts AC electricity from the outlet into regulated DC power for the CPU, GPU, drives, and other components.'
  },
  {
    category: 'COOLING',
    icon: '❄️',
    prompt: 'A processor is getting too hot. Which hardware part helps move heat away and keep it at a safe temperature?',
    choices: ['CPU cooler', 'SSD', 'Keyboard', 'Network card'],
    answer: 'CPU cooler',
    explanation: 'A heat sink and fan—or a liquid cooler—carry heat away from the CPU. Good cooling helps the processor work reliably.'
  },
  {
    category: 'INPUT',
    icon: '⌨️',
    prompt: 'You type a message and send it to your computer. What kind of device is a keyboard?',
    choices: ['Input device', 'Output device', 'Storage device', 'Processing device'],
    answer: 'Input device',
    explanation: 'Input devices send information or commands into a computer. Keyboards, mice, microphones, and cameras are examples.'
  },
  {
    category: 'OUTPUT',
    icon: '🖥️',
    prompt: 'Which kind of device shows the computer’s visual results so a person can see them?',
    choices: ['Output device', 'Input device', 'Memory device', 'Cooling device'],
    answer: 'Output device',
    explanation: 'Output devices present information from the computer. Monitors display images; speakers play sound; printers make paper copies.'
  },
  {
    category: 'CONNECTIVITY',
    icon: '🌐',
    prompt: 'Which hardware lets a computer communicate over a wired or wireless network?',
    choices: ['Network adapter (NIC)', 'Power supply', 'CPU cooler', 'RAM'],
    answer: 'Network adapter (NIC)',
    explanation: 'A network interface card (NIC), sometimes built into the motherboard, connects a computer to Ethernet or Wi-Fi networks.'
  }
];

const elements = {
  answerList: document.querySelector('#answer-list'),
  componentIcon: document.querySelector('#component-icon'),
  feedback: document.querySelector('#feedback'),
  feedbackIcon: document.querySelector('#feedback-icon'),
  feedbackText: document.querySelector('#feedback-text'),
  feedbackTitle: document.querySelector('#feedback-title'),
  nextButton: document.querySelector('#next-button'),
  progressFill: document.querySelector('#progress-fill'),
  progressText: document.querySelector('#progress-text'),
  questionHint: document.querySelector('#question-hint'),
  questionKicker: document.querySelector('#question-kicker'),
  questionNumber: document.querySelector('#question-number'),
  questionText: document.querySelector('#question-text'),
  resetButton: document.querySelector('#reset-button'),
  score: document.querySelector('#score'),
  streak: document.querySelector('#streak'),
  progressBar: document.querySelector('[role="progressbar"]'),
  questionArea: document.querySelector('.question-area')
};

const letters = ['A', 'B', 'C', 'D'];
let questions = [];
let questionIndex = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let answered = false;

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function startGame() {
  questions = shuffle(questionBank);
  questionIndex = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  answered = false;
  elements.score.textContent = '00';
  elements.streak.textContent = '0';
  elements.nextButton.textContent = 'NEXT →';
  elements.feedback.hidden = true;
  elements.feedback.classList.remove('wrong');
  elements.questionArea.hidden = false;
  elements.answerList.hidden = false;
  document.querySelector('.quiz-topline').hidden = false;
  document.querySelector('.quiz-footer').hidden = false;
  renderQuestion();
}

function renderQuestion() {
  const question = questions[questionIndex];
  const questionNumber = questionIndex + 1;
  const progress = questionIndex;

  answered = false;
  elements.feedback.hidden = true;
  elements.feedback.classList.remove('wrong');
  elements.componentIcon.textContent = question.icon;
  elements.questionKicker.textContent = question.category;
  elements.questionText.textContent = question.prompt;
  elements.questionHint.textContent = 'Choose the component that best fits the job.';
  elements.questionNumber.innerHTML = `QUESTION ${String(questionNumber).padStart(2, '0')} <span>/ ${questions.length}</span>`;
  elements.progressText.innerHTML = `${String(questionNumber).padStart(2, '0')} <span class="muted">/ ${questions.length}</span>`;
  elements.progressFill.style.width = `${(progress / questions.length) * 100}%`;
  elements.progressBar.setAttribute('aria-valuenow', String(progress));
  elements.answerList.replaceChildren();

  shuffle(question.choices).forEach((choice, index) => {
    const button = document.createElement('button');
    const letter = document.createElement('span');
    const label = document.createElement('span');

    button.type = 'button';
    button.className = 'answer-option';
    letter.className = 'answer-letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = letters[index];
    label.textContent = choice;
    button.append(letter, label);
    button.addEventListener('click', () => checkAnswer(button, choice, question));
    elements.answerList.append(button);
  });
}

function checkAnswer(selectedButton, choice, question) {
  if (answered) return;
  answered = true;

  const isCorrect = choice === question.answer;
  elements.answerList.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
    const label = button.lastElementChild.textContent;
    if (label === question.answer) button.classList.add('correct');
  });

  if (isCorrect) {
    score += 100;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    elements.feedbackTitle.textContent = 'That’s it. Nice work!';
    elements.feedbackIcon.textContent = '✓';
  } else {
    streak = 0;
    selectedButton.classList.add('incorrect');
    elements.feedbackIcon.textContent = '×';
    elements.feedbackTitle.textContent = `Not quite — it’s ${question.answer}.`;
  }

  elements.feedback.classList.toggle('wrong', !isCorrect);
  elements.feedbackText.textContent = question.explanation;
  elements.feedback.hidden = false;
  elements.score.textContent = String(score).padStart(2, '0');
  elements.streak.textContent = String(bestStreak);
  elements.questionHint.textContent = isCorrect ? 'Correct answer. Here’s why:' : 'The right answer is highlighted. Here’s why:';
  elements.nextButton.textContent = questionIndex === questions.length - 1 ? 'RESULTS →' : 'NEXT →';
  elements.feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showResults() {
  const percentage = Math.round((score / (questions.length * 100)) * 100);
  const message = percentage === 100
    ? 'Flawless run. You know your way around a computer.'
    : percentage >= 70
      ? 'Strong system check. You’ve got a solid grasp of the essentials.'
      : percentage >= 40
        ? 'Good start. Review the explanations and take another lap.'
        : 'Every expert starts somewhere. Run it again and build your hardware instincts.';

  elements.progressFill.style.width = '100%';
  elements.progressBar.setAttribute('aria-valuenow', String(questions.length));
  elements.progressText.innerHTML = `${questions.length} <span class="muted">/ ${questions.length}</span>`;
  elements.questionNumber.innerHTML = `MISSION COMPLETE <span>/ ${questions.length}</span>`;
  elements.questionArea.hidden = true;
  elements.answerList.hidden = true;
  elements.feedback.hidden = true;
  elements.questionArea.insertAdjacentHTML('afterend', `
    <div class="complete-state">
      <div class="complete-icon" aria-hidden="true">✳</div>
      <p class="question-kicker">SYSTEM CHECK COMPLETE</p>
      <h2>${percentage}% — ${score} points</h2>
      <p>${message}</p>
      <button class="next-button" id="play-again-button" type="button">PLAY AGAIN <span aria-hidden="true">↻</span></button>
    </div>
  `);
  document.querySelector('#play-again-button').addEventListener('click', () => {
    document.querySelector('.complete-state').remove();
    startGame();
  });
}

function advanceQuestion() {
  if (!answered) return;
  questionIndex += 1;
  if (questionIndex >= questions.length) {
    showResults();
    return;
  }
  renderQuestion();
}

elements.nextButton.addEventListener('click', advanceQuestion);
elements.resetButton.addEventListener('click', () => {
  document.querySelector('.complete-state')?.remove();
  startGame();
});

startGame();
