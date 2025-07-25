import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";


export default function AppShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", dark ? "true" : "false");
  }, [dark]);

  const toggleDark = () => {
    setDark((d) => !d);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <header
        className={`
          w-full
          px-6
          py-3
          flex
          items-center
          justify-between
          shadow-lg
          rounded-b-2xl
          border-b
          z-20
          backdrop-blur-md
          ${dark
            ? "bg-gradient-to-r from-gray-900/80 via-indigo-900/80 to-purple-900/80 border-blue-900/40"
            : "bg-white/80 border-blue-200/40"
          }
        `}
        style={{ position: "sticky", top: 0 }}
      >
        <div className="flex items-center gap-3">
          <span
            className={`
              font-extrabold
              text-2xl
              tracking-tight
              drop-shadow
              ${dark
                ? "bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-400 bg-clip-text text-transparent"
                : "text-indigo-700"
              }
            `}
          >
            Toki
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle dark mode"
          onClick={toggleDark}
          className="hover:bg-indigo-100/40 dark:hover:bg-gray-800/40 transition"
        >
          <Sun className="h-6 w-6 dark:hidden text-yellow-400" />
          <Moon className="h-6 w-6 hidden dark:inline text-indigo-200" />
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {children}
      </main>
    </div>
  );
} 