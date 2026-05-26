export function renderLearningCards(container, learningCards) {
  if (!container) {
    return;
  }

  container.innerHTML = learningCards.map(createLearningCardHtml).join('');
}

function createLearningCardHtml(card) {
  return `
    <article class="learning-card">
      <div class="learning-card-topline">
        <span class="learning-icon" aria-hidden="true">${card.icon}</span>
        <span class="learning-category">${escapeHtml(card.category)}</span>
      </div>

      <h3>${escapeHtml(card.title)}</h3>

      <p>${escapeHtml(card.description)}</p>

      <div class="learning-tip">
        <strong>Safety tip:</strong>
        <span>${escapeHtml(card.tip)}</span>
      </div>
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