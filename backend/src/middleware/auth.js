import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

// Verifies the Bearer token and attaches { id, email, role } to req.user
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authenticated. Please log in.");
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists.");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Invalid or expired token."));
    }
    next(err);
  }
}

// Restricts a route to specific roles, e.g. authorize("ADMIN", "DOCTOR")
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }
    next();
  };
}
