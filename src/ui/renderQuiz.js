export function renderQuizPreparation(container, questions) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <article class="empty-state-card">
      <h3>Quiz scenarios are ready</h3>
      <p>
        ${questions.length} phishing awareness scenarios have been prepared.
        Interactive question flow will be connected in the next step.
      </p>
    </article>
  `;
}