const RISK_LABELS = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

const TYPE_LABELS = {
  url: 'URL',
  message: 'Message',
};

export function renderHistorySummary(container, historyItems) {
  if (!container) {
    return;
  }

  if (historyItems.length === 0) {
    container.textContent = 'No saved analysis yet.';
    return;
  }

  const lowCount = countByRiskLevel(historyItems, 'low');
  const mediumCount = countByRiskLevel(historyItems, 'medium');
  const highCount = countByRiskLevel(historyItems, 'high');

  container.textContent = `${historyItems.length} saved analyses · Low: ${lowCount} · Medium: ${mediumCount} · High: ${highCount}`;
}

export function renderHistoryList(container, historyItems, activeFilter = 'all') {
  if (!container) {
    return;
  }

  if (historyItems.length === 0) {
    container.innerHTML = createEmptyHistoryHtml();
    return;
  }

  const visibleItems = filterHistoryItems(historyItems, activeFilter);

  if (visibleItems.length === 0) {
    container.innerHTML = createEmptyFilterHtml(activeFilter);
    return;
  }

  container.innerHTML = visibleItems.map(createHistoryItemHtml).join('');
}

function filterHistoryItems(historyItems, activeFilter) {
  if (activeFilter === 'all') {
    return historyItems;
  }

  return historyItems.filter((item) => item.riskLevel === activeFilter);
}

function createHistoryItemHtml(item) {
  return `
    <article class="history-card">
      <div class="history-card-header">
        <div>
          <span class="history-type">${TYPE_LABELS[item.type] ?? 'Analysis'}</span>
          <h3>${escapeHtml(item.inputPreview)}</h3>
        </div>

        <span class="risk-badge risk-badge-${item.riskLevel}">
          ${RISK_LABELS[item.riskLevel]}
        </span>
      </div>

      <div class="history-meta-grid">
        <div>
          <span>Score</span>
          <strong>${item.score}/100</strong>
        </div>

        <div>
          <span>Findings</span>
          <strong>${item.findingsCount}</strong>
        </div>

        <div>
          <span>Analyzed</span>
          <strong>${formatDate(item.analyzedAt)}</strong>
        </div>

        ${createMetadataHtml(item)}
      </div>
    </article>
  `;
}

function createMetadataHtml(item) {
  if (item.type === 'url') {
    return `
      <div>
        <span>Domain</span>
        <strong>${escapeHtml(item.metadata.hostname)}</strong>
      </div>
    `;
  }

  if (item.type === 'message') {
    return `
      <div>
        <span>Message info</span>
        <strong>${item.metadata.characterCount} chars · ${item.metadata.detectedUrlCount} links</strong>
      </div>
    `;
  }

  return '';
}

function createEmptyHistoryHtml() {
  return `
    <article class="empty-state-card">
      <h3>No analysis history yet</h3>
      <p>
        Analyze a URL or message first. Your recent analysis summaries will
        appear here.
      </p>
    </article>
  `;
}

function createEmptyFilterHtml(activeFilter) {
  return `
    <article class="empty-state-card">
      <h3>No ${RISK_LABELS[activeFilter]} item found</h3>
      <p>
        There are saved analyses, but none of them match this risk filter.
      </p>
    </article>
  `;
}

function countByRiskLevel(historyItems, riskLevel) {
  return historyItems.filter((item) => item.riskLevel === riskLevel).length;
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}