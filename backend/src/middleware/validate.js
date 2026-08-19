import { ApiError } from "../utils/asyncHandler.js";

// Usage: router.post("/", validate(schema), handler)
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return next(new ApiError(400, message));
    }
    req.body = result.data;
    next();
  };
}
