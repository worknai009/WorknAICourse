import { createContext, useContext } from 'react';
import type { Course } from '../services/api';

// Theme Context Type
export interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

// Data Context Type
export interface DataContextType {
    courses: Course[];
    isLoading: boolean;
    error: string | null;
}

// Create contexts with proper default values
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const DataContext = createContext<DataContextType>({
    courses: [],
    isLoading: true,
    error: null
});

// Custom hooks for context consumption
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}

export function useData() {
    const context = useContext(DataContext);
    return context;
}