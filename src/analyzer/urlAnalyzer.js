import {
  BRAND_LIKE_TERMS,
  PROMOTIONAL_URL_KEYWORDS,
  SUSPICIOUS_URL_KEYWORDS,
} from '../data/suspiciousKeywords.js';
import { URL_SHORTENER_DOMAINS } from '../data/shorteners.js';

const HTTPS_RISK_POINTS = 15;
const LONG_URL_RISK_POINTS = 10;
const AT_SYMBOL_RISK_POINTS = 25;
const IP_DOMAIN_RISK_POINTS = 30;
const SHORTENER_RISK_POINTS = 30;
const MANY_SUBDOMAINS_RISK_POINTS = 25;
const MANY_HYPHENS_RISK_POINTS = 15;
const MANY_NUMBERS_RISK_POINTS = 12;
const PUNYCODE_RISK_POINTS = 30;

const LONG_URL_LIMIT = 75;
const MANY_SUBDOMAINS_LIMIT = 2;
const MANY_HYPHENS_LIMIT = 2;
const MANY_NUMBERS_LIMIT = 4;
const MAX_KEYWORD_POINTS = 65;
const PROMOTIONAL_SUBDOMAIN_RISK_POINTS = 15;
const PROMOTIONAL_ROOT_DOMAIN_RISK_POINTS = 20;
const BRAND_SUBDOMAIN_RISK_POINTS = 25;

/**
 * Analyzes a URL as plain text.
 * This function does not visit the URL and does not send it anywhere.
 */
export function analyzeUrl(rawUrl) {
  const trimmedUrl = rawUrl.trim();
  const hasExplicitProtocol = hasUrlProtocol(trimmedUrl);
  const normalizedInput = normalizeUrlForParsing(trimmedUrl);
  const parsedUrl = new URL(normalizedInput);

  const findings = [];

  checkHttps(parsedUrl, findings);
  checkUrlLength(trimmedUrl, findings);
  checkAtSymbol(trimmedUrl, findings);
  checkIpAddressDomain(parsedUrl, findings);
  checkSuspiciousKeywords(parsedUrl, findings);
  checkUrlShortener(parsedUrl, findings);
  checkSubdomainCount(parsedUrl, findings);
  checkPromotionalRootDomainPattern(parsedUrl, findings);
  checkBrandLikeSubdomainPattern(parsedUrl, findings);
  checkPromotionalSubdomainPattern(parsedUrl, findings);
  checkHyphenCount(parsedUrl, findings);
  checkNumberCount(parsedUrl, findings);
  checkPunycode(parsedUrl, findings);

  const score = calculateScore(findings);

  return {
    type: 'url',
    input: trimmedUrl,
    normalizedUrl: parsedUrl.href,
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

function checkPromotionalSubdomainPattern(parsedUrl, findings) {
  const tokens = getUrlTokens(parsedUrl);
  const hasPromotionalWord = PROMOTIONAL_URL_KEYWORDS.some((word) => {
  return keywordAppearsInTokens(word, tokens);
});

  if (!hasPromotionalWord || !hasManySubdomains(parsedUrl.hostname)) {
    return;
  }

  findings.push({
    id: 'promotional-subdomain-pattern',
    title: 'Promotional wording appears in subdomains',
    description:
      'Promotional words such as free, gift, or bonus inside subdomains can be used to make a link look attractive while hiding its real structure.',
    points: PROMOTIONAL_SUBDOMAIN_RISK_POINTS,
  });
}

function hasManySubdomains(hostname) {
  if (isIpAddress(hostname)) {
    return false;
  }

  const parts = hostname.split('.');
  const subdomainCount = Math.max(parts.length - 2, 0);

  return subdomainCount >= MANY_SUBDOMAINS_LIMIT;
}

function checkUrlLength(rawUrl, findings) {
  if (rawUrl.length > LONG_URL_LIMIT) {
    findings.push({
      id: 'long-url',
      title: 'URL is unusually long',
      description:
        'Very long URLs can hide suspicious parameters or make the real destination harder to notice.',
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

function checkSuspiciousKeywords(parsedUrl, findings) {
  const tokens = getUrlTokens(parsedUrl);
  const matchedKeywords = SUSPICIOUS_URL_KEYWORDS.filter((keywordItem) => {
    return keywordAppearsInTokens(keywordItem.keyword, tokens);
  });

  if (matchedKeywords.length === 0) {
    return;
  }

  const keywordList = matchedKeywords.map((item) => item.keyword).join(', ');
  const totalKeywordPoints = matchedKeywords.reduce((total, keywordItem) => {
    return total + keywordItem.points;
  }, 0);

  const points = Math.min(totalKeywordPoints, MAX_KEYWORD_POINTS);

  findings.push({
    id: 'suspicious-keywords',
    title: 'Suspicious keywords detected',
    description: `The URL contains attention-grabbing or account-related words: ${keywordList}. These words do not prove phishing, but they are common in suspicious links.`,
    points,
  });
}

function checkUrlShortener(parsedUrl, findings) {
  const hostname = removeWwwPrefix(parsedUrl.hostname);

  if (!URL_SHORTENER_DOMAINS.includes(hostname)) {
    return;
  }

  findings.push({
    id: 'url-shortener',
    title: 'URL shortener detected',
    description:
      'Shortened links can hide the final destination. Users should be careful before opening them.',
    points: SHORTENER_RISK_POINTS,
  });
}

function checkSubdomainCount(parsedUrl, findings) {
  if (!hasManySubdomains(parsedUrl.hostname)) {
    return;
  }

  findings.push({
    id: 'many-subdomains',
    title: 'Multiple subdomains detected',
    description:
      'A high number of subdomains can make a link harder to understand and may be used to imitate trusted brands.',
    points: MANY_SUBDOMAINS_RISK_POINTS,
  });
}

function checkHyphenCount(parsedUrl, findings) {
  const hyphenCount = countMatches(parsedUrl.hostname, '-');

  if (hyphenCount <= MANY_HYPHENS_LIMIT) {
    return;
  }

  findings.push({
    id: 'many-hyphens',
    title: 'Many hyphens detected in domain',
    description:
      'Domains with many hyphens can be harder to read and are sometimes used to create fake brand-like links.',
    points: MANY_HYPHENS_RISK_POINTS,
  });
}

function checkNumberCount(parsedUrl, findings) {
  const numberCount = parsedUrl.hostname.match(/\d/g)?.length ?? 0;

  if (numberCount <= MANY_NUMBERS_LIMIT) {
    return;
  }

  findings.push({
    id: 'many-numbers',
    title: 'Many numbers detected in domain',
    description:
      'A domain with many numbers can be suspicious, especially when it tries to look like a real service.',
    points: MANY_NUMBERS_RISK_POINTS,
  });
}

function checkPunycode(parsedUrl, findings) {
  if (!parsedUrl.hostname.includes('xn--')) {
    return;
  }

  findings.push({
    id: 'punycode',
    title: 'Punycode detected',
    description:
      'Punycode can represent international characters. Attackers may abuse it to create lookalike domains.',
    points: PUNYCODE_RISK_POINTS,
  });
}

function getUrlTokens(parsedUrl) {
  const searchableText = [
    parsedUrl.hostname,
    parsedUrl.pathname,
    parsedUrl.search,
  ]
    .join(' ')
    .toLowerCase();

  return searchableText.split(/[^a-z0-9]+/).filter(Boolean);
}

function removeWwwPrefix(hostname) {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function countMatches(text, character) {
  return text.split(character).length - 1;
}

function isIpAddress(hostname) {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipv4Pattern.test(hostname);
}

function checkPromotionalRootDomainPattern(parsedUrl, findings) {
  const rootDomain = getRootDomainApproximation(parsedUrl.hostname);
  const rootDomainTokens = getTextTokens(rootDomain);

  const matchedPromotionalWords = PROMOTIONAL_URL_KEYWORDS.filter((word) => {
    return keywordAppearsInTokens(word, rootDomainTokens);
  });

  if (matchedPromotionalWords.length < 2) {
    return;
  }

  findings.push({
    id: 'promotional-root-domain',
    title: 'Promotional wording appears in main domain',
    description: `The main domain contains multiple promotional words: ${matchedPromotionalWords.join(', ')}. Domains built around reward-like wording can be risky and should be verified manually.`,
    points: PROMOTIONAL_ROOT_DOMAIN_RISK_POINTS,
  });
}

function checkBrandLikeSubdomainPattern(parsedUrl, findings) {
  const hostname = parsedUrl.hostname.toLowerCase();

  if (isIpAddress(hostname)) {
    return;
  }

  const hostnameParts = hostname.split('.');

  if (hostnameParts.length < 3) {
    return;
  }

  const subdomainParts = hostnameParts.slice(0, -2);
  const rootDomain = getRootDomainApproximation(hostname);
  const rootDomainTokens = getTextTokens(rootDomain);

  const matchedBrands = BRAND_LIKE_TERMS.filter((brand) => {
    const appearsInSubdomain = subdomainParts.some((part) => {
      return keywordAppearsInTokens(brand, getTextTokens(part));
    });

    const appearsInRootDomain = keywordAppearsInTokens(brand, rootDomainTokens);

    return appearsInSubdomain && !appearsInRootDomain;
  });

  if (matchedBrands.length === 0) {
    return;
  }

  findings.push({
    id: 'brand-like-subdomain',
    title: 'Brand-like word appears in subdomain',
    description: `The subdomain contains brand-like wording: ${matchedBrands.join(', ')}. Attackers may place trusted names in subdomains while the real main domain is different.`,
    points: BRAND_SUBDOMAIN_RISK_POINTS,
  });
}

function calculateScore(findings) {
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

function keywordAppearsInTokens(keyword, tokens) {
  return tokens.some((token) => {
    return token === keyword || token.includes(keyword);
  });
}

function getRootDomainApproximation(hostname) {
  const parts = hostname.toLowerCase().split('.');

  if (parts.length < 2) {
    return hostname;
  }

  return parts.slice(-2).join('.');
}

function getTextTokens(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}