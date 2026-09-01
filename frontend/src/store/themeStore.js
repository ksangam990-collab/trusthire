import { create } from 'zustand';

const applyThemeToDOM = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
    body.style.backgroundColor = '#0B0F17';
    body.style.color = '#F8FAFC';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
    body.style.backgroundColor = '#F8FAFC';
    body.style.color = '#0F172A';
  }
};

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('trusthire-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  initTheme: () => {
    const current = get().theme;
    applyThemeToDOM(current);

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e) => {
        const saved = localStorage.getItem('trusthire-theme');
        if (!saved) {
          const sysTheme = e.matches ? 'dark' : 'light';
          set({ theme: sysTheme });
          applyThemeToDOM(sysTheme);
        }
      };
      mediaQuery.addEventListener('change', handleSystemChange);
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const newTheme = current === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('trusthire-theme', newTheme);
    }
    applyThemeToDOM(newTheme);
    set({ theme: newTheme });
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trusthire-theme', theme);
    }
    applyThemeToDOM(theme);
    set({ theme });
  }
}));
