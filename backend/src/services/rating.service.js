import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/errors.js";

export async function createRating({ userId, storeId, rating }) {
  const existing = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } }
  });

  if (existing) {
    throw new ApiError(409, "Rating already exists");
  }

  return prisma.rating.create({
    data: { userId, storeId, rating }
  });
}

export async function updateRating({ ratingId, userId, rating, allowAdmin }) {
  const existing = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!existing) {
    throw new ApiError(404, "Rating not found");
  }

  if (!allowAdmin && existing.userId !== userId) {
    throw new ApiError(403, "Not allowed to update this rating");
  }

  return prisma.rating.update({
    where: { id: ratingId },
    data: { rating }
  });
}

export async function getRatingsByStore(storeId) {
  const ratings = await prisma.rating.findMany({
    where: { storeId },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return ratings.map((rating) => ({
    id: rating.id,
    rating: rating.rating,
    createdAt: rating.createdAt,
    user: {
      id: rating.user.id,
      name: rating.user.name,
      email: rating.user.email
    }
  }));
}
