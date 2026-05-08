import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createRatingHandler, getRatingsByStoreHandler, updateRatingHandler } from "../controllers/rating.controller.js";

const router = Router();

const createSchema = {
  body: z.object({
    storeId: z.string().uuid("Invalid store id"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5")
  })
};

const updateSchema = {
  params: z.object({
    id: z.string().uuid("Invalid rating id")
  }),
  body: z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5")
  })
};

const storeSchema = {
  params: z.object({
    storeId: z.string().uuid("Invalid store id")
  })
};

router.post("/", auth, validate(createSchema), createRatingHandler);
router.put("/:id", auth, validate(updateSchema), updateRatingHandler);
router.get("/store/:storeId", auth, validate(storeSchema), getRatingsByStoreHandler);

export default router;
