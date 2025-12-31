import { useEffect, useState } from 'react';
import { ThemeContext } from './context';

// Theme Provider Component with localStorage persistence
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme from localStorage or default to false (light mode)
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme !== null) {
                return savedTheme === 'dark';
            }
            // Check system preference as fallback
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // Update localStorage and document class whenever theme changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

            // Update HTML class for Tailwind dark mode
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}