import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/errors.js";

export async function getStores({ query, address, userId }) {
  const where = {
    AND: [
      query ? { name: { contains: query, mode: "insensitive" } } : {},
      address ? { address: { contains: address, mode: "insensitive" } } : {}
    ]
  };

  const stores = await prisma.store.findMany({
    where,
    include: {
      owner: true,
      ratings: true
    },
    orderBy: { createdAt: "desc" }
  });

  return stores.map((store) => {
    const totalRatings = store.ratings.length;
    const avgRating =
      totalRatings === 0
        ? 0
        : store.ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;
    const userRating = store.ratings.find((rating) => rating.userId === userId);

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      owner: {
        id: store.owner.id,
        name: store.owner.name,
        email: store.owner.email
      },
      createdAt: store.createdAt,
      totalRatings,
      avgRating: Number(avgRating.toFixed(2)),
      userRating: userRating ? userRating.rating : null,
      userRatingId: userRating ? userRating.id : null
    };
  });
}

export async function getStoreById(id, userId) {
  const store = await prisma.store.findUnique({
    where: { id },
    include: { owner: true, ratings: true }
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const totalRatings = store.ratings.length;
  const avgRating =
    totalRatings === 0
      ? 0
      : store.ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;
  const userRating = store.ratings.find((rating) => rating.userId === userId);

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    owner: {
      id: store.owner.id,
      name: store.owner.name,
      email: store.owner.email
    },
    createdAt: store.createdAt,
    totalRatings,
    avgRating: Number(avgRating.toFixed(2)),
    userRating: userRating ? userRating.rating : null,
    userRatingId: userRating ? userRating.id : null
  };
}

export async function createStore({ name, email, address, ownerId }) {
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner || owner.role !== "OWNER") {
    throw new ApiError(400, "Owner must be a valid store owner");
  }

  const existing = await prisma.store.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "Store email already in use");
  }

  const store = await prisma.store.create({
    data: { name, email, address, ownerId }
  });

  return store;
}
