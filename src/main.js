import './styles/main.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';

import { analyzeText } from './analyzer/textAnalyzer.js';
import { analyzeUrl } from './analyzer/urlAnalyzer.js';
import { LEARNING_CARDS } from './data/learningCards.js';
import { QUIZ_QUESTIONS } from './data/quizData.js';
import {
  clearAnalysisHistory,
  getAnalysisHistory,
  saveAnalysisToHistory,
} from './storage/historyStorage.js';
import { domElements } from './ui/domElements.js';
import {
  renderHistoryList,
  renderHistorySummary,
} from './ui/renderHistory.js';
import { renderLearningCards } from './ui/renderLearning.js';
import { renderQuiz } from './ui/renderQuiz.js';
import {
  renderMessageResult,
  renderUrlResult,
} from './ui/renderResult.js';
import { initializeThemeToggle } from './ui/themeToggle.js';
import {
  createInitialQuizState,
  goToNextQuizQuestion,
  restartQuiz,
  submitQuizAnswer,
} from './utils/quizLogic.js';
import {
  validateMessageInput,
  validateUrlInput,
} from './utils/validators.js';

const ANALYSIS_DELAY_MS = 450;

let activeHistoryFilter = 'all';
let quizState = createInitialQuizState();

function initializeApp() {
  initializeThemeToggle(domElements.themeToggleButton);

  setupUrlForm();
  setupMessageForm();
  setupHistoryControls();
  setupQuizControls();

  renderLearningCards(domElements.learningCardList, LEARNING_CARDS);
  renderQuiz(domElements.quizContainer, QUIZ_QUESTIONS, quizState);
  renderHistory();

  console.log('Phishing Analyst app initialized.');
}

function setupUrlForm() {
  const { urlForm } = domElements;

  if (!urlForm) {
    return;
  }

  urlForm.addEventListener('submit', handleUrlFormSubmit);
}

function setupMessageForm() {
  const { messageForm } = domElements;

  if (!messageForm) {
    return;
  }

  messageForm.addEventListener('submit', handleMessageFormSubmit);
}

function setupHistoryControls() {
  const { historyFilterButtons, clearHistoryButton } = domElements;

  historyFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeHistoryFilter = button.dataset.riskFilter;
      updateHistoryFilterButtons();
      renderHistory();
    });
  });

  if (clearHistoryButton) {
    clearHistoryButton.addEventListener('click', handleClearHistoryClick);
  }
}

function setupQuizControls() {
  const { quizContainer } = domElements;

  if (!quizContainer) {
    return;
  }

  quizContainer.addEventListener('click', handleQuizClick);
}

async function handleUrlFormSubmit(event) {
  event.preventDefault();

  const { urlInput } = domElements;
  const validation = validateUrlInput(urlInput.value);

  resetUrlFeedback();

  if (!validation.isValid) {
    renderUrlValidationError(validation.message);
    return;
  }

  setButtonLoading(domElements.urlSubmitButton, true, 'Analyzing URL');

  try {
    await wait(ANALYSIS_DELAY_MS);

    const analysisResult = analyzeUrl(urlInput.value);
    const savedHistoryItem = saveAnalysisToHistory(analysisResult);

    renderUrlResult(domElements.urlValidationResult, analysisResult);
    renderHistory();

    console.log('URL analysis result:', analysisResult);
    console.log('Saved history item:', savedHistoryItem);
  } finally {
    setButtonLoading(domElements.urlSubmitButton, false);
  }
}

async function handleMessageFormSubmit(event) {
  event.preventDefault();

  const { messageInput } = domElements;
  const validation = validateMessageInput(messageInput.value);

  resetMessageFeedback();

  if (!validation.isValid) {
    renderMessageValidationError(validation.message);
    return;
  }

  setButtonLoading(domElements.messageSubmitButton, true, 'Analyzing Message');

  try {
    await wait(ANALYSIS_DELAY_MS);

    const analysisResult = analyzeText(messageInput.value);
    const savedHistoryItem = saveAnalysisToHistory(analysisResult);

    renderMessageResult(domElements.messageValidationResult, analysisResult);
    renderHistory();

    console.log('Message analysis result:', analysisResult);
    console.log('Saved history item:', savedHistoryItem);
  } finally {
    setButtonLoading(domElements.messageSubmitButton, false);
  }
}

function handleQuizClick(event) {
  const optionButton = event.target.closest('[data-quiz-option-id]');
  const nextButton = event.target.closest('[data-quiz-next]');
  const restartButton = event.target.closest('[data-quiz-restart]');

  if (optionButton) {
    quizState = submitQuizAnswer(
      QUIZ_QUESTIONS,
      quizState,
      optionButton.dataset.quizOptionId,
    );

    renderQuiz(domElements.quizContainer, QUIZ_QUESTIONS, quizState);
    return;
  }

  if (nextButton) {
    quizState = goToNextQuizQuestion(QUIZ_QUESTIONS, quizState);
    renderQuiz(domElements.quizContainer, QUIZ_QUESTIONS, quizState);
    return;
  }

  if (restartButton) {
    quizState = restartQuiz();
    renderQuiz(domElements.quizContainer, QUIZ_QUESTIONS, quizState);
  }
}

function handleClearHistoryClick() {
  const historyItems = getAnalysisHistory();

  if (historyItems.length === 0) {
    return;
  }

  const shouldClearHistory = window.confirm(
    'Are you sure you want to clear all saved analysis history?',
  );

  if (!shouldClearHistory) {
    return;
  }

  clearAnalysisHistory();
  activeHistoryFilter = 'all';
  updateHistoryFilterButtons();
  renderHistory();
}

function resetUrlFeedback() {
  const { urlError, urlInput, urlValidationResult } = domElements;

  urlError.textContent = '';
  urlInput.removeAttribute('aria-invalid');
  urlValidationResult.hidden = true;
  urlValidationResult.textContent = '';
  urlValidationResult.className = '';
}

function resetMessageFeedback() {
  const { messageError, messageInput, messageValidationResult } = domElements;

  messageError.textContent = '';
  messageInput.removeAttribute('aria-invalid');
  messageValidationResult.hidden = true;
  messageValidationResult.textContent = '';
  messageValidationResult.className = '';
}

function renderUrlValidationError(message) {
  const { urlError, urlInput } = domElements;

  urlError.textContent = message;
  urlInput.setAttribute('aria-invalid', 'true');
}

function renderMessageValidationError(message) {
  const { messageError, messageInput } = domElements;

  messageError.textContent = message;
  messageInput.setAttribute('aria-invalid', 'true');
}

function renderHistory() {
  const historyItems = getAnalysisHistory();

  renderHistorySummary(domElements.historySummary, historyItems);
  renderHistoryList(domElements.historyList, historyItems, activeHistoryFilter);
}

function updateHistoryFilterButtons() {
  domElements.historyFilterButtons.forEach((button) => {
    const isActive = button.dataset.riskFilter === activeHistoryFilter;

    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function setButtonLoading(button, isLoading, loadingText = '') {
  if (!button) {
    return;
  }

  if (isLoading) {
    button.dataset.originalText = button.textContent.trim();
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add('is-loading');
    return;
  }

  button.textContent = button.dataset.originalText;
  button.disabled = false;
  button.classList.remove('is-loading');
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

initializeApp();