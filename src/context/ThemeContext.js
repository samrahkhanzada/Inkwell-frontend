import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Color palette based on theme
  const colors = isDark ? {
    // Dark theme colors
    bg:          '#111111',
    bgSecondary: '#1c1c1c',
    bgTertiary:  '#222222',
    border:      '#2a2a2a',
    text:        '#f0f0f0',
    textSecondary: '#aaaaaa',
    textMuted:   '#777777',
    cardBg:      '#1c1c1c',
    inputBg:     '#1c1c1c',
    navBg:       'rgba(17,17,17,0.95)',
    heroBg:      '#111111',
    sectionBg:   '#161616',
    skeletonBg:  '#2a2a2a',
    hoverBg:     '#2a2a2a',
    dropdownBg:  '#1c1c1c',
  } : {
    // Light theme colors
    bg:          '#f7f7f7',
    bgSecondary: '#ffffff',
    bgTertiary:  '#f7f7f7',
    border:      '#efefef',
    text:        '#0d0d0d',
    textSecondary: '#737373',
    textMuted:   '#909090',
    cardBg:      '#ffffff',
    inputBg:     '#ffffff',
    navBg:       'rgba(255,255,255,0.9)',
    heroBg:      '#ffffff',
    sectionBg:   '#f7f7f7',
    skeletonBg:  '#efefef',
    hoverBg:     '#f7f7f7',
    dropdownBg:  '#ffffff',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);