/**
 * Result rendering module.
 * Creates user-friendly analysis result panels for URL and message checks.
 */

const RISK_LEVEL_CONTENT = {
  low: {
    label: 'Low Risk',
    summary:
      'No strong warning sign was detected by the current rule set. This does not guarantee the URL is safe.',
  },
  medium: {
    label: 'Medium Risk',
    summary:
      'Some suspicious patterns were detected. You should review the URL carefully before taking action.',
  },
  high: {
    label: 'High Risk',
    summary:
      'Multiple or serious warning signs were detected. Do not click this link unless you can verify it from an official source.',
  },
};

export function renderUrlResult(container, analysisResult) {
  const riskContent = RISK_LEVEL_CONTENT[analysisResult.riskLevel];

  container.hidden = false;
  container.className = `analysis-result analysis-result-${analysisResult.riskLevel}`;

  container.innerHTML = `
    <div class="result-header">
      <div>
        <p class="result-kicker">URL analysis result</p>
        <h3>${riskContent.label}</h3>
      </div>

      <span class="risk-badge risk-badge-${analysisResult.riskLevel}">
        ${riskContent.label}
      </span>
    </div>

    <div class="score-panel">
      <div class="score-topline">
        <span>Risk score</span>
        <strong>${analysisResult.score}/100</strong>
      </div>

      <div class="score-track" aria-hidden="true">
        <div
          class="score-fill score-fill-${analysisResult.riskLevel}"
          style="width: ${analysisResult.score}%"
        ></div>
      </div>

      <p>${riskContent.summary}</p>
    </div>

    <div class="result-meta">
      <div>
        <span>Checked domain</span>
        <strong>${analysisResult.hostname}</strong>
      </div>

      <div>
        <span>Analysis type</span>
        <strong>Client-side URL review</strong>
      </div>
    </div>

    ${createProtocolNoteHtml(analysisResult)}

    <section class="result-section" aria-label="Detected warning signs">
      <h4>Detected warning signs</h4>
      ${createFindingsHtml(analysisResult.findings)}
    </section>

    <section class="result-section" aria-label="Recommended next steps">
      <h4>What should I do now?</h4>
      ${createRecommendationHtml(analysisResult.riskLevel)}
    </section>

    <p class="safe-note">
      This is an awareness-based result, not a final security decision.
      The app does not visit URLs, does not use external APIs, and does not
      verify real domain ownership.
    </p>
  `;
}

/**
 * Temporary backward-compatible export.
 * If main.js still imports renderBasicUrlResult, the app will not break.
 */
export function renderBasicUrlResult(container, analysisResult) {
  renderUrlResult(container, analysisResult);
}

function createProtocolNoteHtml(analysisResult) {
  if (analysisResult.hasExplicitProtocol) {
    return '';
  }

  return `
    <div class="info-note">
      <strong>Protocol note:</strong>
      Protocol was not provided, so the URL was temporarily interpreted as
      <strong>${analysisResult.normalizedUrl}</strong> for analysis.
    </div>
  `;
}

function createFindingsHtml(findings) {
  if (findings.length === 0) {
    return `
      <div class="empty-result-note">
        <strong>No warning sign found in the current rule set.</strong>
        <p>
          This only means the visible patterns checked by this app did not raise
          a warning. A real phishing link may still look normal.
        </p>
      </div>
    `;
  }

  const findingItems = findings
    .map((finding) => {
      return `
        <li class="finding-item">
          <div>
            <strong>${finding.title}</strong>
            <span>${finding.description}</span>
          </div>

          <span class="finding-points">+${finding.points}</span>
        </li>
      `;
    })
    .join('');

  return `
    <ul class="finding-list">
      ${findingItems}
    </ul>
  `;
}

function createRecommendationHtml(riskLevel) {
  const recommendations = {
    low: [
      'Still check the domain manually before entering sensitive information.',
      'Prefer typing the official website address yourself instead of clicking links.',
      'Do not assume a link is safe only because the score is low.',
    ],
    medium: [
      'Do not enter passwords, card details, or verification codes on this page.',
      'Compare the domain with the official website carefully.',
      'Open the official website manually from your browser instead of using this link.',
    ],
    high: [
      'Do not click or continue with this link.',
      'Do not enter any personal information, password, card detail, or verification code.',
      'Report or delete the suspicious message if it came from email, SMS, or social media.',
    ],
  };

  const items = recommendations[riskLevel]
    .map((recommendation) => {
      return `<li>${recommendation}</li>`;
    })
    .join('');

  return `
    <ul class="recommendation-list">
      ${items}
    </ul>
  `;
}

const MESSAGE_RISK_LEVEL_CONTENT = {
  low: {
    label: 'Low Risk',
    summary:
      'No strong social engineering signal was detected by the current message rule set. This does not guarantee the message is safe.',
  },
  medium: {
    label: 'Medium Risk',
    summary:
      'Some suspicious wording or pressure patterns were detected. Review the message carefully before taking action.',
  },
  high: {
    label: 'High Risk',
    summary:
      'Multiple or serious social engineering signals were detected. Do not click links or share sensitive information.',
  },
};

export function renderMessageResult(container, analysisResult) {
  const riskContent = MESSAGE_RISK_LEVEL_CONTENT[analysisResult.riskLevel];

  container.hidden = false;
  container.className = `analysis-result analysis-result-${analysisResult.riskLevel}`;

  container.innerHTML = `
    <div class="result-header">
      <div>
        <p class="result-kicker">Message analysis result</p>
        <h3>${riskContent.label}</h3>
      </div>

      <span class="risk-badge risk-badge-${analysisResult.riskLevel}">
        ${riskContent.label}
      </span>
    </div>

    <div class="score-panel">
      <div class="score-topline">
        <span>Risk score</span>
        <strong>${analysisResult.score}/100</strong>
      </div>

      <div class="score-track" aria-hidden="true">
        <div
          class="score-fill score-fill-${analysisResult.riskLevel}"
          style="width: ${analysisResult.score}%"
        ></div>
      </div>

      <p>${riskContent.summary}</p>
    </div>

    <div class="result-meta">
      <div>
        <span>Character count</span>
        <strong>${analysisResult.characterCount}</strong>
      </div>

      <div>
        <span>Detected links</span>
        <strong>${analysisResult.detectedUrlCount}</strong>
      </div>
    </div>

    <section class="result-section" aria-label="Detected message warning signs">
      <h4>Detected warning signs</h4>
      ${createFindingsHtml(analysisResult.findings)}
    </section>

    <section class="result-section" aria-label="Recommended next steps">
      <h4>What should I do now?</h4>
      ${createMessageRecommendationHtml(analysisResult.riskLevel)}
    </section>

    <p class="safe-note">
      This is an awareness-based text review, not a final security decision.
      The app does not open links, does not inspect attachments, and does not
      send your message to a server.
    </p>
  `;
}

function createMessageRecommendationHtml(riskLevel) {
  const recommendations = {
    low: [
      'Still check the sender address and the context of the message.',
      'Do not share sensitive information unless you are sure the request is legitimate.',
      'Use official websites or apps instead of links inside messages.',
    ],
    medium: [
      'Do not click links before verifying the sender and the domain.',
      'Do not reply with personal information, passwords, or verification codes.',
      'Contact the organization through official channels if the message claims to be important.',
    ],
    high: [
      'Do not click any link or open attachments in this message.',
      'Do not enter passwords, card details, or verification codes.',
      'Report, block, or delete the message if it came from an unknown or suspicious sender.',
    ],
  };

  const items = recommendations[riskLevel]
    .map((recommendation) => {
      return `<li>${recommendation}</li>`;
    })
    .join('');

  return `
    <ul class="recommendation-list">
      ${items}
    </ul>
  `;
}