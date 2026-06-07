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

const MANY_EXCLAMATIONS_LIMIT = 3;
const UPPERCASE_RATIO_LIMIT = 0.35;
const MIN_LETTER_COUNT_FOR_UPPERCASE_CHECK = 20;

const URL_PATTERN =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.[a-z]{2,}(\/[^\s]*)?)/gi;

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

