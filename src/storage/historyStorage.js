const HISTORY_STORAGE_KEY = 'phishingAnalyst.analysisHistory';
const MAX_HISTORY_ITEMS = 20;
const PREVIEW_LENGTH = 90;

/**
 * Reads analysis history from localStorage.
 * If localStorage is unavailable or corrupted, it safely returns an empty array.
 */
export function getAnalysisHistory() {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory);

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch (error) {
    console.warn('Could not read analysis history:', error);
    return [];
  }
}

/**
 * Saves a compact, privacy-friendly version of the analysis result.
 * Full message text is not stored.
 */
export function saveAnalysisToHistory(analysisResult) {
  const currentHistory = getAnalysisHistory();
  const historyItem = createHistoryItem(analysisResult);

  const updatedHistory = [historyItem, ...currentHistory].slice(
    0,
    MAX_HISTORY_ITEMS,
  );

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    return historyItem;
  } catch (error) {
    console.warn('Could not save analysis history:', error);
    return null;
  }
}

/**
 * Clears all saved analysis history.
 * This will be connected to the History UI in the next development day.
 */
export function clearAnalysisHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear analysis history:', error);
  }
}

function createHistoryItem(analysisResult) {
  return {
    id: createHistoryId(),
    type: analysisResult.type,
    inputPreview: createInputPreview(analysisResult.input),
    score: analysisResult.score,
    riskLevel: analysisResult.riskLevel,
    findingsCount: analysisResult.findings.length,
    analyzedAt: analysisResult.analyzedAt,
    metadata: createHistoryMetadata(analysisResult),
  };
}

function createHistoryMetadata(analysisResult) {
  if (analysisResult.type === 'url') {
    return {
      hostname: analysisResult.hostname,
    };
  }

  if (analysisResult.type === 'message') {
    return {
      characterCount: analysisResult.characterCount,
      detectedUrlCount: analysisResult.detectedUrlCount,
    };
  }

  return {};
}

function createInputPreview(input) {
  const singleLineInput = input.replace(/\s+/g, ' ').trim();

  if (singleLineInput.length <= PREVIEW_LENGTH) {
    return singleLineInput;
  }

  return `${singleLineInput.slice(0, PREVIEW_LENGTH)}...`;
}

function createHistoryId() {
  return `analysis-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}