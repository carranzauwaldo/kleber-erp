// Theme configuration
export const themes = {
  light: {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-50',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  },
  dark: {
    primary: 'bg-blue-700',
    secondary: 'bg-gray-900',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-800',
    success: 'bg-green-900 text-green-200',
    error: 'bg-red-900 text-red-200',
    warning: 'bg-yellow-900 text-yellow-200',
  },
};

export function useTheme() {
  const isDark = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = isDark ? themes.dark : themes.light;

  return { theme, isDark };
}

export function saveThemePreference(theme: 'light' | 'dark' | 'system') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme-preference', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export function getThemePreference(): 'light' | 'dark' | 'system' {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('theme-preference') as any) || 'system';
  }
  return 'system';
}
