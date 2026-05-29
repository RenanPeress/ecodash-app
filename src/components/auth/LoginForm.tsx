import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/auth-schemas";
import { cn } from "@/lib/utils";
import { PasswordInput } from "./PasswordInput";

interface LoginFormProps {
  isLoading: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onForgotPassword?: () => void;
}

export function LoginForm({ isLoading, onSubmit, onForgotPassword }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  className={cn(
                    fieldState.error && "border-destructive focus-visible:ring-destructive",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-medium text-muted-foreground transition hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  hasError={Boolean(fieldState.error)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </Form>
  );
}
