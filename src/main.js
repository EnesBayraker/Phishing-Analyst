import './styles/main.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';
import { analyzeText } from './analyzer/textAnalyzer.js';
import {
  clearAnalysisHistory,
  getAnalysisHistory,
  saveAnalysisToHistory,
} from './storage/historyStorage.js';

import { LEARNING_CARDS } from './data/learningCards.js';

import { analyzeUrl } from './analyzer/urlAnalyzer.js';
import { domElements } from './ui/domElements.js';
import {
  renderMessageResult,
  renderUrlResult,
} from './ui/renderResult.js';

import {
  renderHistoryList,
  renderHistorySummary,
} from './ui/renderHistory.js';

import { renderLearningCards } from './ui/renderLearning.js';
import {
  validateMessageInput,
  validateUrlInput,
} from './utils/validators.js';

let activeHistoryFilter = 'all';

function initializeApp() {
  setupUrlForm();
  setupMessageForm();
  setupHistoryControls();

  renderLearningCards(domElements.learningCardList, LEARNING_CARDS);
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

function handleUrlFormSubmit(event) {
  event.preventDefault();

  const { urlInput } = domElements;
  const validation = validateUrlInput(urlInput.value);

  resetUrlFeedback();

  if (!validation.isValid) {
    renderUrlValidationError(validation.message);
    return;
  }

const analysisResult = analyzeUrl(urlInput.value);
const savedHistoryItem = saveAnalysisToHistory(analysisResult);

renderUrlResult(domElements.urlValidationResult, analysisResult);
renderHistory();

console.log('URL analysis result:', analysisResult);
console.log('Saved history item:', savedHistoryItem);
}

function handleMessageFormSubmit(event) {
  event.preventDefault();

  const { messageInput } = domElements;
  const validation = validateMessageInput(messageInput.value);

  resetMessageFeedback();

  if (!validation.isValid) {
    renderMessageValidationError(validation.message);
    return;
  }

const analysisResult = analyzeText(messageInput.value);
const savedHistoryItem = saveAnalysisToHistory(analysisResult);

renderMessageResult(domElements.messageValidationResult, analysisResult);
renderHistory();

console.log('Message analysis result:', analysisResult);
console.log('Saved history item:', savedHistoryItem);
}

function resetUrlFeedback() {
  const { urlError, urlValidationResult } = domElements;

  urlError.textContent = '';
  urlValidationResult.hidden = true;
  urlValidationResult.textContent = '';
  urlValidationResult.className = '';
}

function resetMessageFeedback() {
  const { messageError, messageValidationResult } = domElements;

  messageError.textContent = '';
  messageValidationResult.hidden = true;
  messageValidationResult.textContent = '';
  messageValidationResult.className = 'validation-result';
}

function renderUrlValidationError(message) {
  const { urlError } = domElements;

  urlError.textContent = message;
}

function renderMessageValidationError(message) {
  const { messageError } = domElements;

  messageError.textContent = message;
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

initializeApp();