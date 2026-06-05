import {
  getCurrentQuestion,
  getQuizProgress,
  getQuizResultSummary,
} from '../utils/quizLogic.js';

export function renderQuiz(container, questions, quizState) {
  if (!container) {
    return;
  }

  if (questions.length === 0) {
    container.innerHTML = createEmptyQuizHtml();
    return;
  }

  if (quizState.isComplete) {
    container.innerHTML = createQuizResultHtml(questions, quizState);
    return;
  }

  const currentQuestion = getCurrentQuestion(questions, quizState);
  const progress = getQuizProgress(questions, quizState);

  container.innerHTML = createQuestionHtml(currentQuestion, progress, quizState);
}

function createQuestionHtml(question, progress, quizState) {
  const hasFeedback = Boolean(quizState.feedback);

  return `
    <article class="quiz-card">
      <div class="quiz-progress-header">
        <div>
          <span class="quiz-kicker">Question ${quizState.currentQuestionIndex + 1} of ${progress.totalCount}</span>
          <h3>${escapeHtml(question.title)}</h3>
        </div>

        <span class="quiz-type">${escapeHtml(question.type)}</span>
      </div>

      <div class="quiz-progress-track" aria-hidden="true">
        <div class="quiz-progress-fill" style="width: ${progress.percentage}%"></div>
      </div>

      <div class="quiz-scenario">
        <strong>Scenario</strong>
        <p>${escapeHtml(question.scenario)}</p>
      </div>

      <h4>${escapeHtml(question.question)}</h4>

      <div class="quiz-options">
        ${question.options
          .map((option) => createOptionButtonHtml(option, quizState))
          .join('')}
      </div>

      ${hasFeedback ? createFeedbackHtml(question, progress, quizState) : ''}
    </article>
  `;
}

function createOptionButtonHtml(option, quizState) {
  const feedback = quizState.feedback;
  const isSelected = feedback?.selectedOptionId === option.id;
  const shouldShowCorrect = feedback && option.isCorrect;
  const shouldShowWrong = feedback && isSelected && !option.isCorrect;

  const stateClasses = [
    isSelected ? 'is-selected' : '',
    shouldShowCorrect ? 'is-correct' : '',
    shouldShowWrong ? 'is-wrong' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <button
      class="quiz-option ${stateClasses}"
      type="button"
      data-quiz-option-id="${escapeHtml(option.id)}"
      ${feedback ? 'disabled' : ''}
    >
      ${escapeHtml(option.text)}
    </button>
  `;
}

function createFeedbackHtml(question, progress, quizState) {
  const { feedback } = quizState;
  const feedbackTitle = feedback.isCorrect ? 'Correct answer' : 'Not quite';

  return `
    <div class="quiz-feedback ${feedback.isCorrect ? 'is-correct' : 'is-wrong'}">
      <strong>${feedbackTitle}</strong>
      <p>${escapeHtml(feedback.explanation)}</p>

      <button class="primary-button quiz-next-button" type="button" data-quiz-next>
        ${progress.answeredCount === progress.totalCount ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  `;
}

function createQuizResultHtml(questions, quizState) {
  const summary = getQuizResultSummary(questions, quizState);

  return `
    <article class="quiz-card quiz-result-card">
      <span class="quiz-kicker">Quiz completed</span>

      <h3>Your phishing awareness score</h3>

      <div class="quiz-final-score">
        <strong>${summary.correctCount}/${summary.totalCount}</strong>
        <span>${summary.percentage}% correct</span>
      </div>

      <p>
        ${createResultMessage(summary.percentage)}
      </p>

      <div class="quiz-review-list">
        ${questions.map((question) => createReviewItemHtml(question, quizState)).join('')}
      </div>

      <button class="secondary-button quiz-restart-button" type="button" data-quiz-restart>
        Restart Quiz
      </button>
    </article>
  `;
}

function createReviewItemHtml(question, quizState) {
  const answer = quizState.selectedAnswers.find((item) => {
    return item.questionId === question.id;
  });

  return `
    <div class="quiz-review-item">
      <span class="${answer?.isCorrect ? 'review-correct' : 'review-wrong'}">
        ${answer?.isCorrect ? 'Correct' : 'Review needed'}
      </span>

      <strong>${escapeHtml(question.title)}</strong>
      <p>${escapeHtml(question.explanation)}</p>
    </div>
  `;
}

function createResultMessage(percentage) {
  if (percentage >= 80) {
    return 'Great job. You recognized most phishing warning signs in the scenarios.';
  }

  if (percentage >= 50) {
    return 'Good start. Review the explanations and pay attention to urgency, links, and sensitive information requests.';
  }

  return 'Keep practicing. Phishing often relies on pressure, fake rewards, and trusted-looking words.';
}

function createEmptyQuizHtml() {
  return `
    <article class="empty-state-card">
      <h3>No quiz questions found</h3>
      <p>Quiz questions will appear here when quiz data is available.</p>
    </article>
  `;
}



function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}