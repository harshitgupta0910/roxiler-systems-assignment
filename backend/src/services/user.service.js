import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/errors.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

export async function getUsers({ query }) {
  const filters = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } }
        ]
      }
    : {};

  const users = await prisma.user.findMany({
    where: filters,
    orderBy: { createdAt: "desc" }
  });

  return users.map(sanitizeUser);
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return sanitizeUser(user);
}

export async function createUser(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      address: data.address,
      role: data.role
    }
  });

  return sanitizeUser(user);
}

export async function updatePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed }
  });

  return { success: true };
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}
