import { ApiError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token"));
  }
}
