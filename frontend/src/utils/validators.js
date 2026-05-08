import { z } from "zod";

export const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

export const addressSchema = z.string().max(400, "Address must be at most 400 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");
