/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const getInitialTheme = () => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
    }, [theme]);

    useEffect(() => {
        // Respect system preference unless user has explicitly set a theme
        const saved = localStorage.getItem('theme');
        if (saved) return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            setTheme(e.matches ? 'dark' : 'light');
        };
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', handler);
            else mq.removeListener(handler);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
