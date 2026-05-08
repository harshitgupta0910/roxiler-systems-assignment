import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createUserHandler, getUser, listUsers, updatePasswordHandler } from "../controllers/user.controller.js";

const router = Router();

const userSchema = {
  body: z.object({
    name: z.string().min(20, "Name must be at least 20 characters").max(60, "Name must be at most 60 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    address: z.string().max(400, "Address must be at most 400 characters").optional(),
    role: z.enum(["ADMIN", "USER", "OWNER"])
  })
};

const passwordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character")
  })
};

const idSchema = {
  params: z.object({
    id: z.string().uuid("Invalid user id")
  })
};

router.get("/", auth, allowRoles("ADMIN"), listUsers);
router.get("/:id", auth, allowRoles("ADMIN"), validate(idSchema), getUser);
router.post("/", auth, allowRoles("ADMIN"), validate(userSchema), createUserHandler);
router.put("/password", auth, validate(passwordSchema), updatePasswordHandler);

export default router;
