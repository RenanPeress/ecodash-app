import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Usuário ou e-mail é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Nome completo é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
