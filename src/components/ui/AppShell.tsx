import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";


export default function AppShell({ children }: { children: ReactNode }) {
  // Read dark mode from localStorage or system preference
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Update <html> class and localStorage when dark changes
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", dark ? "true" : "false");
  }, [dark]);

  // Toggle dark mode
  const toggleDark = () => {
    setDark((d) => !d);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <header className="w-full px-4 py-3 border-b bg-white/80 dark:bg-gray-900/80 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-blue-600 tracking-tight">Chat Vibe</span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggleDark}>
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:inline" />
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {children}
      </main>
  
    </div>
  );
} 