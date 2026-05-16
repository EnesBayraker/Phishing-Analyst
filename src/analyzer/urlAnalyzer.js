const HTTPS_RISK_POINTS = 15;
const LONG_URL_RISK_POINTS = 10;
const AT_SYMBOL_RISK_POINTS = 25;
const IP_DOMAIN_RISK_POINTS = 30;

const LONG_URL_LIMIT = 75;

/**
 * Analyzes a URL as plain text.
 * This function does not visit the URL and does not send it anywhere.
 */
    export function analyzeUrl(rawUrl) {
  const trimmedUrl = rawUrl.trim();
  const hasExplicitProtocol = hasUrlProtocol(trimmedUrl);
  const normalizedUrl = normalizeUrlForParsing(trimmedUrl);
  const parsedUrl = new URL(normalizedUrl);
  const findings = [];

  checkHttps(parsedUrl, findings);
  checkUrlLength(rawUrl, findings);
  checkAtSymbol(rawUrl, findings);
  checkIpAddressDomain(parsedUrl, findings);

  const score = calculateBasicScore(findings);

  return {
  type: 'url',
  input: trimmedUrl,
  normalizedUrl,
  hostname: parsedUrl.hostname,
  hasExplicitProtocol,
  score,
  riskLevel: getRiskLevel(score),
  findings,
  analyzedAt: new Date().toISOString(),
};
}

function normalizeUrlForParsing(url) {
  return hasUrlProtocol(url) ? url : `https://${url}`;
}

function hasUrlProtocol(url) {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(url);
}

function checkHttps(parsedUrl, findings) {
  if (parsedUrl.protocol !== 'https:') {
    findings.push({
      id: 'missing-https',
      title: 'HTTPS is not used',
      description:
        'The URL does not use HTTPS. This does not always mean phishing, but sensitive pages should use HTTPS.',
      points: HTTPS_RISK_POINTS,
    });
  }
}

function checkUrlLength(rawUrl, findings) {
  if (rawUrl.length > LONG_URL_LIMIT) {
    findings.push({
      id: 'long-url',
      title: 'URL is unusually long',
      description:
        'Very long URLs can be used to hide suspicious parameters or make the real destination harder to notice.',
      points: LONG_URL_RISK_POINTS,
    });
  }
}

function checkAtSymbol(rawUrl, findings) {
  if (rawUrl.includes('@')) {
    findings.push({
      id: 'at-symbol',
      title: 'URL contains @ symbol',
      description:
        'The @ symbol can make a URL misleading because browsers may interpret text before it differently.',
      points: AT_SYMBOL_RISK_POINTS,
    });
  }
}

function checkIpAddressDomain(parsedUrl, findings) {
  if (isIpAddress(parsedUrl.hostname)) {
    findings.push({
      id: 'ip-domain',
      title: 'Domain looks like an IP address',
      description:
        'Legitimate services usually use recognizable domain names. IP-based links can be harder for users to verify.',
      points: IP_DOMAIN_RISK_POINTS,
    });
  }
}

function isIpAddress(hostname) {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipv4Pattern.test(hostname);
}

function calculateBasicScore(findings) {
  const totalPoints = findings.reduce((total, finding) => {
    return total + finding.points;
  }, 0);

  return Math.min(totalPoints, 100);
}

function getRiskLevel(score) {
  if (score >= 66) {
    return 'high';
  }

  if (score >= 31) {
    return 'medium';
  }

  return 'low';
}