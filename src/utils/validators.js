const DANGEROUS_SCHEMES = ['javascript:', 'data:', 'vbscript:'];

/**
 * Checks whether the user's URL input is usable for client-side analysis.
 * This function only validates the text. It does not visit the URL.
 */
export function validateUrlInput(rawUrl) {
  const trimmedUrl = rawUrl.trim();

  if (!trimmedUrl) {
    return {
      isValid: false,
      message: 'Please enter a URL before starting the analysis.',
    };
  }

  if (trimmedUrl.length < 4) {
    return {
      isValid: false,
      message: 'The URL is too short to analyze.',
    };
  }

  if (/\s/.test(trimmedUrl)) {
    return {
      isValid: false,
      message: 'URLs should not contain spaces. Please check the input.',
    };
  }

  if (hasDangerousScheme(trimmedUrl)) {
    return {
      isValid: false,
      message: 'This input starts with a script-like scheme and cannot be analyzed as a normal URL.',
    };
  }

  if (!canBeParsedAsUrl(trimmedUrl)) {
    return {
      isValid: false,
      message: 'Please enter a valid URL or domain-like address.',
    };
  }

  return {
    isValid: true,
    message: 'URL accepted. Risk analysis rules will be added in the next step.',
  };
}

function hasDangerousScheme(url) {
  const lowerCaseUrl = url.toLowerCase();

  return DANGEROUS_SCHEMES.some((scheme) => lowerCaseUrl.startsWith(scheme));
}

function canBeParsedAsUrl(url) {
  try {
    const urlForParsing = addTemporaryProtocol(url);
    const parsedUrl = new URL(urlForParsing);

    return parsedUrl.hostname.includes('.');
  } catch {
    return false;
  }
}

function addTemporaryProtocol(url) {
  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(url);

  return hasProtocol ? url : `https://${url}`;
}