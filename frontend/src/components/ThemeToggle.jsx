import { useState, useEffect, memo } from 'react';

const ThemeToggle = memo(() => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className="p-2 text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-warm-200 hover:bg-warm-100 dark:hover:bg-warm-800 rounded-lg transition-colors duration-150"
      aria-label={isDark ? 'روشن کردن' : 'تاریک کردن'}
    >
      <div className="relative w-[18px] h-[18px]">
        {/* Sun */}
        <svg
          className={`absolute inset-0 w-[18px] h-[18px] text-amber-500 transition-all duration-300 ${
            isDark ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        {/* Moon */}
        <svg
          className={`absolute inset-0 w-[18px] h-[18px] text-brand-400 transition-all duration-300 ${
            isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
