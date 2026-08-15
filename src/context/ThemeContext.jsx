/**
 * ==========================================
 * COMPONENT: ThemeContext
 * ==========================================
 * Provides the dark/light theme state globally to all components.
 */
import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children })=>{
    const [theme, setThemeState] = useState(()=>{
        const saved = localStorage.getItem('ctrl_center_theme_v2');
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        // Always default to light theme as requested
        return 'light';
    });
    const isDark = theme === 'dark';
    useEffect(()=>{
        localStorage.setItem('ctrl_center_theme_v2', theme);
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme;
        if (isDark) {
            root.classList.add('dark');
            root.classList.remove('light');
            document.body.style.backgroundColor = '#0A0A0C';
            document.body.style.color = '#FFFFFF';
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            document.body.style.backgroundColor = '#E5E5E2';
            document.body.style.color = '#171717';
        }
    }, [
        theme,
        isDark
    ]);
    const toggleTheme = ()=>{
        setThemeState((prev)=>prev === 'light' ? 'dark' : 'light');
    };
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
    };
    return <ThemeContext.Provider value={{
        theme,
        isDark,
        toggleTheme,
        setTheme
    }}>
      {children}
    </ThemeContext.Provider>;
};
export const useTheme = ()=>{
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
