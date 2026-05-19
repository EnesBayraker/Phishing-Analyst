import './styles/main.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';

import { analyzeUrl } from './analyzer/urlAnalyzer.js';
import { domElements } from './ui/domElements.js';
import { renderUrlResult } from './ui/renderResult.js';
import {
  validateMessageInput,
  validateUrlInput,
} from './utils/validators.js';

function initializeApp() {
  setupUrlForm();
  setupMessageForm();

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

  renderUrlResult(domElements.urlValidationResult, analysisResult);
  console.log('URL analysis result:', analysisResult);
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

  renderMessageValidationSuccess(validation.message);
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

function renderMessageValidationSuccess(message) {
  const { messageValidationResult } = domElements;

  messageValidationResult.hidden = false;
  messageValidationResult.textContent = message;
  messageValidationResult.classList.add('validation-result-success');
}

initializeApp();