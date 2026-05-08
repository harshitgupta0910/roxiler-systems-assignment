import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/errors.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { createToken } from "../utils/jwt.js";

export async function registerUser({ name, email, password, address }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      address,
      role: "USER"
    }
  });

  const token = createToken({ id: user.id, role: user.role, email: user.email });
  return { token, user: sanitizeUser(user) };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = createToken({ id: user.id, role: user.role, email: user.email });
  return { token, user: sanitizeUser(user) };
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}
