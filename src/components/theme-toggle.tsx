import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/storage";

export function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  // Dark is default. Light is opt-in via .light class.
  if (theme === "light") root.classList.add("light");
  else root.classList.remove("light");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const s = loadSettings();
    setTheme(s.theme);
    applyTheme(s.theme);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    saveSettings({ ...loadSettings(), theme: next });
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
