/**
 * Message analyzer module.
 * Detects social engineering signals in suspicious message or email text.
 */

import { TEXT_RISK_PATTERNS } from '../data/suspiciousKeywords.js';
import { calculateRiskScore, getRiskLevel } from './scoring.js';
import { ANALYSIS_TYPES } from '../utils/constants.js';

const URL_IN_TEXT_RISK_POINTS = 18;
const MANY_EXCLAMATIONS_RISK_POINTS = 10;
const MANY_UPPERCASE_RISK_POINTS = 12;
const SPELLING_ERRORS_RISK_POINTS = 8;
const IMPERSONATION_RISK_POINTS = 24;
const SUSPICIOUS_FORMATTING_RISK_POINTS = 10;
const MULTIPLE_DATA_REQUEST_RISK_POINTS = 16;
const CALL_TO_ACTION_URGENCY_RISK_POINTS = 14;
const AUTHORITY_IMPERSONATION_RISK_POINTS = 26;
const FAKE_URGENCY_MARKERS_RISK_POINTS = 12;

const MANY_EXCLAMATIONS_LIMIT = 3;
const UPPERCASE_RATIO_LIMIT = 0.35;
const MIN_LETTER_COUNT_FOR_UPPERCASE_CHECK = 20;

const URL_PATTERN =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.[a-z]{2,}(\/[^\s]*)?)/gi;

const IMPERSONATION_PATTERNS = [
  { text: 'dear customer', risk: 8 },
  { text: 'dear user', risk: 8 },
  { text: 'valued customer', risk: 6 },
  { text: 'dear friend', risk: 10 },
  { text: 'dear member', risk: 12 },
  { text: 'dear account holder', risk: 15 },
];

const CALL_TO_ACTION_PATTERNS = [
  'click here',
  'verify now',
  'confirm identity',
  'update information',
  'validate account',
  're-enter password',
  'complete verification',
  'complete process',
];

const AUTHORITY_IMPERSONATION_PATTERNS = [
  'your bank',
  'our company',
  'your provider',
  'our team',
  'support team',
  'security team',
  'fraud department',
  'on behalf of',
  'from your',
];

const SUSPICIOUS_FORMATTING = [
  { pattern: /[\s]{3,}/g, name: 'excessive spaces' },
  { pattern: /[^A-Za-z0-9\s.,!?\'"-]/g, name: 'unusual characters' },
  { pattern: /\${2,}/g, name: 'repeated symbols' },
];

/**
 * Analyzes suspicious message or email text.
 * This function only checks visible text patterns in the browser.
 */
export function analyzeText(rawMessage) {
  const trimmedMessage = rawMessage.trim();
  const normalizedMessage = normalizeText(trimmedMessage);

  const findings = [];

  checkTextPatterns(normalizedMessage, findings);
  checkUrlPresence(trimmedMessage, findings);
  checkExclamationCount(trimmedMessage, findings);
  checkUppercaseRatio(trimmedMessage, findings);
  checkSpellingErrors(normalizedMessage, findings);
  checkImpersonationPatterns(normalizedMessage, findings);
  checkSuspiciousFormatting(trimmedMessage, findings);
  checkMultipleDataRequests(normalizedMessage, findings);
  checkCallToActionUrgency(normalizedMessage, findings);
  checkAuthorityImpersonation(normalizedMessage, findings);
  checkFakeUrgencyMarkers(normalizedMessage, findings);

  const score = calculateRiskScore(findings);

  return {
    type: ANALYSIS_TYPES.MESSAGE,
    input: trimmedMessage,
    characterCount: trimmedMessage.length,
    detectedUrlCount: countDetectedUrls(trimmedMessage),
    score,
    riskLevel: getRiskLevel(score),
    findings,
    analyzedAt: new Date().toISOString(),
  };
}

function checkTextPatterns(normalizedMessage, findings) {
  TEXT_RISK_PATTERNS.forEach((pattern) => {
    const matchedKeywords = pattern.keywords.filter((keyword) => {
      return normalizedMessage.includes(keyword.toLowerCase());
    });

    if (matchedKeywords.length === 0) {
      return;
    }

    findings.push({
      id: pattern.id,
      title: pattern.title,
      description: `${pattern.description} Matched words or phrases: ${matchedKeywords.join(', ')}.`,
      points: pattern.points,
    });
  });
}

function checkUrlPresence(message, findings) {
  const detectedUrlCount = countDetectedUrls(message);

  if (detectedUrlCount === 0) {
    return;
  }

  findings.push({
    id: 'url-in-message',
    title: 'URL detected inside the message',
    description:
      'The message contains a link. Suspicious messages often use links to redirect users to fake pages.',
    points: URL_IN_TEXT_RISK_POINTS,
  });
}

function checkExclamationCount(message, findings) {
  const exclamationCount = countCharacter(message, '!');

  if (exclamationCount <= MANY_EXCLAMATIONS_LIMIT) {
    return;
  }

  findings.push({
    id: 'many-exclamations',
    title: 'Many exclamation marks detected',
    description:
      'Too many exclamation marks can be used to create pressure or emotional urgency.',
    points: MANY_EXCLAMATIONS_RISK_POINTS,
  });
}

function checkUppercaseRatio(message, findings) {
  const letters = message.match(/[a-zA-ZğüşöçıİĞÜŞÖÇ]/g) ?? [];

  if (letters.length < MIN_LETTER_COUNT_FOR_UPPERCASE_CHECK) {
    return;
  }

  const uppercaseLetters = letters.filter((letter) => {
    return letter === letter.toUpperCase() && letter !== letter.toLowerCase();
  });

  const uppercaseRatio = uppercaseLetters.length / letters.length;

  if (uppercaseRatio <= UPPERCASE_RATIO_LIMIT) {
    return;
  }

  findings.push({
    id: 'many-uppercase-letters',
    title: 'High uppercase letter usage detected',
    description:
      'Messages written with too many uppercase letters can be trying to create panic or urgency.',
    points: MANY_UPPERCASE_RISK_POINTS,
  });
}

function checkSpellingErrors(message, findings) {
  // Common phishing-related misspellings
  const suspiciousMisspellings = [
    'pasword',
    'passowrd',
    'verifyy',
    'confirmm',
    'urgant',
    'securirty',
    'actioN',
    'immediatly',
  ];

  const foundMisspellings = suspiciousMisspellings.filter((misspelling) => {
    return message.includes(misspelling);
  });

  if (foundMisspellings.length === 0) {
    return;
  }

  findings.push({
    id: 'spelling-errors',
    title: 'Suspicious spelling patterns detected',
    description: `Found misspellings that are commonly used in phishing messages: ${foundMisspellings.join(', ')}.`,
    points: SPELLING_ERRORS_RISK_POINTS,
  });
}

function checkImpersonationPatterns(message, findings) {
  const matches = IMPERSONATION_PATTERNS.filter((pattern) => {
    return message.includes(pattern.text.toLowerCase());
  });

  if (matches.length === 0) {
    return;
  }

  const totalRisk = matches.reduce((sum, m) => sum + m.risk, 0);
  const matchedPatterns = matches.map((m) => m.text).join(', ');

  findings.push({
    id: 'impersonation-pattern',
    title: 'Generic greeting patterns detected',
    description: `The message uses generic greetings that don't personalize to you: ${matchedPatterns}. Phishing messages often use vague addresses.`,
    points: Math.min(totalRisk, IMPERSONATION_RISK_POINTS),
  });
}

function checkSuspiciousFormatting(message, findings) {
  const issuesFound = [];

  SUSPICIOUS_FORMATTING.forEach((check) => {
    if (check.pattern.test(message)) {
      issuesFound.push(check.name);
    }
  });

  if (issuesFound.length === 0) {
    return;
  }

  findings.push({
    id: 'suspicious-formatting',
    title: 'Unusual message formatting detected',
    description: `The message contains suspicious formatting: ${issuesFound.join(', ')}. This can be used to confuse or manipulate readers.`,
    points: SUSPICIOUS_FORMATTING_RISK_POINTS,
  });
}

function checkMultipleDataRequests(message, findings) {
  const dataTypes = [
    'password',
    'credit card',
    'card number',
    'cvv',
    'pin',
    'security code',
    'verification code',
    'otp',
    'social security',
    'identity number',
    'date of birth',
    'address',
    'phone number',
  ];

  const requestedTypes = dataTypes.filter((type) => {
    return message.includes(type.toLowerCase());
  });

  if (requestedTypes.length <= 1) {
    return;
  }

  findings.push({
    id: 'multiple-data-requests',
    title: 'Multiple types of data requested',
    description: `The message requests multiple sensitive pieces of information: ${requestedTypes.join(', ')}. Legitimate companies rarely ask for this much information at once.`,
    points: MULTIPLE_DATA_REQUEST_RISK_POINTS,
  });
}

function checkCallToActionUrgency(message, findings) {
  const ctas = CALL_TO_ACTION_PATTERNS.filter((cta) => {
    return message.includes(cta.toLowerCase());
  });

  if (ctas.length === 0) {
    return;
  }

  findings.push({
    id: 'call-to-action-urgency',
    title: 'Urgent call-to-action detected',
    description: `The message contains action keywords: ${ctas.join(', ')}. Combined with urgency, this is a common phishing tactic.`,
    points: CALL_TO_ACTION_URGENCY_RISK_POINTS,
  });
}

function checkAuthorityImpersonation(message, findings) {
  const matches = AUTHORITY_IMPERSONATION_PATTERNS.filter((pattern) => {
    return message.includes(pattern.toLowerCase());
  });

  if (matches.length === 0) {
    return;
  }

  findings.push({
    id: 'authority-impersonation',
    title: 'Authority impersonation patterns detected',
    description: `The message tries to appear official using phrases like: ${matches.join(', ')}. Verify any official communication through official channels.`,
    points: AUTHORITY_IMPERSONATION_RISK_POINTS,
  });
}

function checkFakeUrgencyMarkers(message, findings) {
  const urgencyMarkers = [
    'act now or lose',
    'limited availability',
    'offer expires',
    'only today',
    'do not wait',
    'must act immediately',
    'no time to waste',
  ];

  const found = urgencyMarkers.filter((marker) => {
    return message.includes(marker.toLowerCase());
  });

  if (found.length === 0) {
    return;
  }

  findings.push({
    id: 'fake-urgency-markers',
    title: 'Artificial urgency language detected',
    description: `The message uses high-pressure language designed to bypass careful thinking: ${found.join(', ')}.`,
    points: FAKE_URGENCY_MARKERS_RISK_POINTS,
  });
}

function countDetectedUrls(message) {
  const matches = message.match(URL_PATTERN);

  return matches ? matches.length : 0;
}

function countCharacter(text, character) {
  return text.split(character).length - 1;
}

function normalizeText(text) {
  return text.toLowerCase();
}

