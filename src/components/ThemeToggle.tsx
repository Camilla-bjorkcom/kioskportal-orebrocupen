import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded dark:bg-slate-900 text-gray-800 dark:text-gray-200"
          >
            {isDarkMode ? <Moon /> : <Sun />}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="rounded p-2 bg-gray-700 text-white text-sm"
        >
          {isDarkMode ? "Växla till ljust läge" : "Växla till mörkt läge"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
