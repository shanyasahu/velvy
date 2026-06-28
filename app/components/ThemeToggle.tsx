"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-(--bg-card) backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(161,58,255,0.3)] lg:h-[38px] lg:w-[38px]"
        >
            {theme === "dark" ? (
                <Sun size={16} />
            ) : (
                <Moon size={16} />
            )}
        </button>
    );
}