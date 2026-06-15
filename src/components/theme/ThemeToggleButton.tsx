import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleButtonProps {
  className?: string;
}

/** Alternância rápida claro ↔ escuro (telas sem Topbar) */
export function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={resolvedTheme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition",
        "hover:bg-accent/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
        className,
      )}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
