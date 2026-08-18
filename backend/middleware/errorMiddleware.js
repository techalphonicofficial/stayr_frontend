export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Prisma specific error handling
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  }
  
  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (statusCode === 500) {
    console.error(`[CRITICAL ERROR] ${err.message}`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || (err.message ? [err.message] : []),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
