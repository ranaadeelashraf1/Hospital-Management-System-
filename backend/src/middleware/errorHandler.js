export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong on the server.";

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    statusCode = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : err.meta?.target || "value";
    message = `A record with this ${target} already exists.`;
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "The requested record was not found.";
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
}
