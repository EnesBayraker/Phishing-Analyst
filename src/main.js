import './styles/main.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';

import { analyzeUrl } from './analyzer/urlAnalyzer.js';
import { domElements } from './ui/domElements.js';
import { renderUrlResult } from './ui/renderResult.js';
import { validateUrlInput } from './utils/validators.js';

function initializeApp() {
  setupUrlForm();
  console.log('Phishing Analyst app initialized.');
}

function setupUrlForm() {
  const { urlForm } = domElements;

  if (!urlForm) {
    return;
  }

  urlForm.addEventListener('submit', handleUrlFormSubmit);
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

function resetUrlFeedback() {
  const { urlError, urlValidationResult } = domElements;

  urlError.textContent = '';
  urlValidationResult.hidden = true;
  urlValidationResult.textContent = '';
  urlValidationResult.className = '';
}

function renderUrlValidationError(message) {
  const { urlError } = domElements;

  urlError.textContent = message;
}

initializeApp();