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
import { registerSchema, type RegisterFormValues } from "@/lib/auth-schemas";
import { cn } from "@/lib/utils";
import { PasswordInput } from "./PasswordInput";

interface RegisterFormProps {
  isLoading: boolean;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

export function RegisterForm({ isLoading, onSubmit }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading}
                  hasError={Boolean(fieldState.error)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Repita sua senha"
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
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </form>
    </Form>
  );
}
