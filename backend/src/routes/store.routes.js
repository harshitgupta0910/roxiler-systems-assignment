import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createStoreHandler, getStore, listStores } from "../controllers/store.controller.js";

const router = Router();

const storeSchema = {
  body: z.object({
    name: z.string().min(2, "Store name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().max(400, "Address must be at most 400 characters"),
    ownerId: z.string().uuid("Invalid owner id")
  })
};

const idSchema = {
  params: z.object({
    id: z.string().uuid("Invalid store id")
  })
};

const querySchema = {
  query: z.object({
    q: z.string().optional(),
    address: z.string().optional()
  })
};

router.get("/", auth, validate(querySchema), listStores);
router.get("/:id", auth, validate(idSchema), getStore);
router.post("/", auth, allowRoles("ADMIN"), validate(storeSchema), createStoreHandler);

export default router;
