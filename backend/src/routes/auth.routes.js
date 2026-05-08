import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const registerSchema = {
  body: z.object({
    name: z.string().min(20, "Name must be at least 20 characters").max(60, "Name must be at most 60 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    address: z.string().max(400, "Address must be at most 400 characters").optional()
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
  })
};

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
