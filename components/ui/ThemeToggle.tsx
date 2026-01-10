'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { updateAdminThemeAction } from '@/lib/actions/settings.actions';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-md hover:bg-slate-800 transition-colors">
                <div className="h-5 w-5" />
            </button>
        );
    }

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await updateAdminThemeAction(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center text-white"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}
