/**
 * Async handler to wrap async/await controllers
 * Automatically catches errors and passes them to the Express error handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
