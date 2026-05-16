export function renderBasicUrlResult(container, analysisResult) {
  const findingsHtml = createFindingsHtml(analysisResult.findings);

  container.hidden = false;
  container.className = `validation-result validation-result-${analysisResult.riskLevel}`;

  container.innerHTML = `
    <strong>Basic URL analysis completed.</strong>
    <p>
      Risk score:
      <strong>${analysisResult.score}/100</strong>
      (${formatRiskLevel(analysisResult.riskLevel)})
    </p>

    <p>
  Checked domain:
  <strong>${analysisResult.hostname}</strong>
</p>

${createProtocolNoteHtml(analysisResult)}

${findingsHtml}

    <p class="safe-note">
      This is an awareness-based result, not a final security decision.
      Always verify suspicious links through official sources.
    </p>
  `;
}

function createProtocolNoteHtml(analysisResult) {
  if (analysisResult.hasExplicitProtocol) {
    return '';
  }

  return `
    <p class="info-note">
      Protocol was not provided, so the URL was temporarily interpreted as
      <strong>${analysisResult.normalizedUrl}</strong> for analysis.
    </p>
  `;
}

function createFindingsHtml(findings) {
  if (findings.length === 0) {
    return `
      <p>
        No basic risk factor was detected in this first rule set.
        This does not guarantee that the URL is safe.
      </p>
    `;
  }

  const findingItems = findings
    .map((finding) => {
      return `
        <li>
          <strong>${finding.title}</strong>
          <span>${finding.description}</span>
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

function formatRiskLevel(riskLevel) {
  return riskLevel
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}