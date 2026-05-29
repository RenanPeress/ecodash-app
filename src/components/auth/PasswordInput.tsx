import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  hasError?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, hasError, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn(
            "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          disabled={disabled}
          onClick={() => setVisible((prev) => !prev)}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition",
            "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
