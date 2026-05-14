import './styles/main.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';

import { domElements } from './ui/domElements.js';
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

  renderUrlValidationFeedback(validation);
}

function renderUrlValidationFeedback(validation) {
  const { urlError, urlValidationResult } = domElements;

  urlError.textContent = '';
  urlValidationResult.hidden = true;
  urlValidationResult.textContent = '';
  urlValidationResult.className = 'validation-result';

  if (!validation.isValid) {
    urlError.textContent = validation.message;
    return;
  }

  urlValidationResult.hidden = false;
  urlValidationResult.textContent = validation.message;
  urlValidationResult.classList.add('validation-result-success');
}

initializeApp();