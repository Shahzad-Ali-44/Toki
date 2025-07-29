import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
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
          py-4
          flex
          items-center
          justify-between
          shadow-xl
          rounded-b-3xl
          border-b
          z-20
          backdrop-blur-xl
          relative
          overflow-hidden
          ${dark
            ? "bg-gradient-to-r from-gray-900/90 via-indigo-900/90 to-purple-900/90 border-indigo-500/20"
            : "bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 border-indigo-200/50"
          }
        `}
        style={{ position: "sticky", top: 0 }}
      >
        <div className={`absolute inset-0 opacity-10 ${dark ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20' : 'bg-gradient-to-r from-indigo-200/30 via-purple-200/30 to-pink-200/30'}`}></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg ${
            dark 
              ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50' 
              : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <img 
              src="/favicon.ico" 
              alt="Toki Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`
                  font-black
                  text-3xl
                  tracking-tight
                  drop-shadow-lg
                  ${dark
                    ? "bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  }
                `}
              >
                Toki
              </span>
              <Sparkles className={`h-5 w-5 ${dark ? 'text-pink-400' : 'text-purple-500'} animate-pulse`} />
            </div>
            <span className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-600'} tracking-wide`}>
              Real-time Chat Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Online</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleDark}
            className={`w-10 h-10 rounded-xl transition-all duration-300 hover:scale-105 ${
              dark 
                ? 'hover:bg-gray-800/60 text-indigo-200 hover:text-white' 
                : 'hover:bg-indigo-100/60 text-gray-600 hover:text-indigo-700'
            }`}
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:inline" />
          </Button>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50`}></div>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {children}
      </main>
    </div>
  );
} 