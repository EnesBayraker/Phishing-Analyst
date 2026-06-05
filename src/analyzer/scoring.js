import { RISK_LEVELS } from '../utils/constants.js';

const MIN_SCORE = 0;
const MAX_SCORE = 100;
const MEDIUM_RISK_MIN_SCORE = 31;
const HIGH_RISK_MIN_SCORE = 66;

// Severity categories for weighting
const SEVERITY_MULTIPLIERS = {
  CRITICAL: 1.5,  // Credential/payment related
  HIGH: 1.3,      // Account threat/authority
  MEDIUM: 1.1,    // Generic pressure/urgency
  LOW: 1.0,       // Informational findings
};

const CRITICAL_FINDING_IDS = [
  'credential-prefixing',
  'sensitive-data-request',
  'at-symbol',
  'ip-domain',
  'payment-or-transaction-issue',
];

const HIGH_FINDING_IDS = [
  'account-threat',
  'authority-impersonation',
  'fake-customer-service',
  'url-shortener',
  'suspicious-tld',
  'typosquatting',
];

const COMBINATION_BOOSTS = [
  {
    ids: ['url-in-message', 'urgency-pressure'],
    boost: 8,
    name: 'Urgent link combination',
  },
  {
    ids: ['url-in-message', 'account-threat'],
    boost: 10,
    name: 'Threatening link combination',
  },
  {
    ids: ['sensitive-data-request', 'urgency-pressure'],
    boost: 12,
    name: 'Urgent credential request combination',
  },
  {
    ids: ['account-threat', 'urgency-pressure'],
    boost: 7,
    name: 'Account threat urgency combination',
  },
  {
    ids: ['suspicious-keywords', 'many-subdomains'],
    boost: 6,
    name: 'Complex suspicious domain combination',
  },
];

/**
 * Calculates the final risk score from detected findings.
 * The result is always limited between 0 and 100.
 * Includes weighted scoring and combination penalties.
 */
export function calculateRiskScore(findings) {
  let totalPoints = 0;

  // Apply severity multipliers to each finding
  findings.forEach((finding) => {
    let multiplier = SEVERITY_MULTIPLIERS.LOW;

    if (CRITICAL_FINDING_IDS.includes(finding.id)) {
      multiplier = SEVERITY_MULTIPLIERS.CRITICAL;
    } else if (HIGH_FINDING_IDS.includes(finding.id)) {
      multiplier = SEVERITY_MULTIPLIERS.HIGH;
    }

    totalPoints += finding.points * multiplier;
  });

  // Apply combination boosts for dangerous finding combinations
  const findingIds = findings.map((f) => f.id);
  let combinationBoost = 0;

  COMBINATION_BOOSTS.forEach((combo) => {
    const hasAllIds = combo.ids.every((id) => findingIds.includes(id));
    if (hasAllIds) {
      combinationBoost += combo.boost;
    }
  });

  const finalScore = clampScore(totalPoints + combinationBoost);

  return finalScore;
}

/**
 * Converts a numeric risk score into a readable risk level.
 */
export function getRiskLevel(score) {
  if (score >= HIGH_RISK_MIN_SCORE) {
    return RISK_LEVELS.HIGH;
  }

  if (score >= MEDIUM_RISK_MIN_SCORE) {
    return RISK_LEVELS.MEDIUM;
  }

  return RISK_LEVELS.LOW;
}

function clampScore(score) {
  if (score < MIN_SCORE) {
    return MIN_SCORE;
  }

  if (score > MAX_SCORE) {
    return MAX_SCORE;
  }

  return score;
}