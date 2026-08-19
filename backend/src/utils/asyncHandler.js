// Wraps an async route handler so thrown errors are forwarded to Express's
// error middleware instead of crashing the process.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Small helper for throwing errors with an HTTP status attached.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
