import { ApiError } from "../utils/errors.js";

export function validate(schema) {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      return next();
    } catch (error) {
      return next(new ApiError(400, error.errors?.[0]?.message || "Invalid request"));
    }
  };
}
