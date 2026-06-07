import { RISK_LEVELS } from '../utils/constants.js';

const MIN_SCORE = 0;
const MAX_SCORE = 100;
const MEDIUM_RISK_MIN_SCORE = 31;
const HIGH_RISK_MIN_SCORE = 66;

/**
 * Calculates the final risk score from detected findings.
 * The result is always limited between 0 and 100.
 */
export function calculateRiskScore(findings) {
  const totalPoints = findings.reduce((total, finding) => {
    return total + finding.points;
  }, 0);

  return clampScore(totalPoints);
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