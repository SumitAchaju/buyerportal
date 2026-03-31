import { z } from "zod";
export const loginSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
  })
  .transform((data) => ({
    email: data.email.trim().toLowerCase(),
    password: data.password.trim(),
    rememberMe: data.rememberMe ?? false,
  }));

export type LoginData = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginData = {
  email: "",
  password: "",
  rememberMe: false,
};
