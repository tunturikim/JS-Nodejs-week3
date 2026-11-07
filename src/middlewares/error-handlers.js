import {validationResult} from 'express-validator';

// 404 handler: runs when no route matched
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Central error handler (must be registered last, needs 4 arguments)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  // Multer errors (e.g. file too large) are client errors
  if (err.name === 'MulterError') {
    status = 400;
  }
  if (status === 500) {
    console.error(err);
    message = 'Internal Server Error';
  }
  res.status(status).json({error: {message, status}});
};

// Collects express-validator results and forwards them as a 400 error
const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => `${e.path}: ${e.msg}`)
      .join(', ');
    const error = new Error(message);
    error.status = 400;
    return next(error);
  }
  next();
};

export {notFoundHandler, errorHandler, validationErrors};
