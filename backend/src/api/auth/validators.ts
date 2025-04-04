import { z } from "zod";

export const loginValidator = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres")
});

export const registerValidator = z.object({
    email: z.string().email("Email inválido"),
    username: z.string().min(3, "Mínimo 3 caracteres").max(20, "Máximo 20 caracteres"),
    password: z.string().min(6, "Mínimo 6 caracteres")
});
