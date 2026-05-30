const THEME_STORAGE_KEY = 'phishingAnalyst.theme';

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export function initializeThemeToggle(button) {
  if (!button) {
    return;
  }

  const initialTheme = getSavedTheme() ?? getPreferredTheme();

  applyTheme(initialTheme, button);

  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme =
      currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

    saveTheme(nextTheme);
    applyTheme(nextTheme, button);
  });
}

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn('Could not read theme preference:', error);
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Could not save theme preference:', error);
  }
}

function getPreferredTheme() {
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;

  return prefersLight ? THEMES.LIGHT : THEMES.DARK;
}

function applyTheme(theme, button) {
  document.documentElement.dataset.theme = theme;

  const icon = button.querySelector('.theme-toggle-icon');
  const text = button.querySelector('.theme-toggle-text');

  if (theme === THEMES.LIGHT) {
    icon.textContent = '☀️';
    text.textContent = 'Light';
    button.setAttribute('aria-label', 'Switch to dark theme');
    return;
  }

  icon.textContent = '🌙';
  text.textContent = 'Dark';
  button.setAttribute('aria-label', 'Switch to light theme');
}