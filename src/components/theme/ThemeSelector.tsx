import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import type { ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: { mode: ThemeMode; icon: LucideIcon; label: string }[] = [
  { mode: "light", icon: Sun, label: "Claro" },
  { mode: "dark", icon: Moon, label: "Escuro" },
  { mode: "system", icon: Monitor, label: "Sistema" },
];

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {OPTIONS.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setTheme(mode)}
          aria-pressed={theme === mode}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition",
            theme === mode
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
