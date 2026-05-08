import { createRating, getRatingsByStore, updateRating } from "../services/rating.service.js";
import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/errors.js";

export async function createRatingHandler(req, res, next) {
  try {
    const rating = await createRating({
      userId: req.user.id,
      storeId: req.body.storeId,
      rating: req.body.rating
    });
    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
}

export async function updateRatingHandler(req, res, next) {
  try {
    const rating = await updateRating({
      ratingId: req.params.id,
      userId: req.user.id,
      rating: req.body.rating,
      allowAdmin: req.user.role === "ADMIN"
    });
    res.json(rating);
  } catch (error) {
    next(error);
  }
}

export async function getRatingsByStoreHandler(req, res, next) {
  try {
    if (req.user.role === "OWNER") {
      const store = await prisma.store.findUnique({ where: { id: req.params.storeId } });
      if (!store || store.ownerId !== req.user.id) {
        throw new ApiError(403, "Forbidden");
      }
    }
    const ratings = await getRatingsByStore(req.params.storeId);
    res.json(ratings);
  } catch (error) {
    next(error);
  }
}
