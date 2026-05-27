export const domElements = {
  urlForm: document.querySelector('#url-analysis-form'),
  urlInput: document.querySelector('#url-input'),
  urlError: document.querySelector('#url-error'),
  urlValidationResult: document.querySelector('#url-validation-result'),

  messageForm: document.querySelector('#message-analysis-form'),
  messageInput: document.querySelector('#message-input'),
  messageError: document.querySelector('#message-error'),
  messageValidationResult: document.querySelector('#message-validation-result'),

  historySummary: document.querySelector('#history-summary'),
  historyList: document.querySelector('#history-list'),
  historyFilterButtons: document.querySelectorAll('[data-risk-filter]'),
  clearHistoryButton: document.querySelector('#clear-history-button'),

  learningCardList: document.querySelector('#learning-card-list'),

  quizContainer: document.querySelector('#quiz-container'),
};