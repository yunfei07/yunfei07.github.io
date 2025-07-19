/**
 * ThemeScript component to prevent theme flicker
 * This script runs before React hydration to set the correct theme class
 * on the document element, preventing the flash of incorrect theme.
 */
export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Get saved theme from localStorage
        let savedTheme;
        try {
          savedTheme = localStorage.getItem('theme');
        } catch (storageError) {
          console.warn('Failed to access localStorage:', storageError);
          savedTheme = null;
        }
        
        const root = document.documentElement;
        
        // Function to check if system preference detection is supported
        function isSystemPreferenceSupported() {
          try {
            return typeof window !== 'undefined' && 
                   window.matchMedia && 
                   typeof window.matchMedia === 'function';
          } catch (error) {
            return false;
          }
        }
        
        // Function to get system theme preference with error handling
        function getSystemThemePreference() {
          if (!isSystemPreferenceSupported()) {
            console.warn('System preference detection not supported, defaulting to dark');
            return 'dark';
          }
          
          try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            return mediaQuery.matches ? 'dark' : 'light';
          } catch (error) {
            console.warn('Failed to detect system theme preference:', error);
            return 'dark';
          }
        }
        
        // Function to determine actual theme
        function getActualTheme(theme) {
          if (theme === 'system' || !theme) {
            return getSystemThemePreference();
          }
          return theme === 'light' ? 'light' : 'dark';
        }
        
        // Determine the theme to apply
        const themeToUse = savedTheme || 'system';
        const actualTheme = getActualTheme(themeToUse);
        
        // Remove any existing theme classes
        root.classList.remove('light', 'dark');
        
        // Add the correct theme class
        root.classList.add(actualTheme);
        
        // Set data attributes to indicate script has run and current state
        root.setAttribute('data-theme-script-loaded', 'true');
        root.setAttribute('data-theme-preference', themeToUse);
        root.setAttribute('data-actual-theme', actualTheme);
        root.setAttribute('data-system-preference-supported', isSystemPreferenceSupported().toString());
        
      } catch (error) {
        console.error('ThemeScript error:', error);
        // Fallback to dark theme if anything goes wrong
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add('dark');
        root.setAttribute('data-theme-script-error', 'true');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />
  );
}