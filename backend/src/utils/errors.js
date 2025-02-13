// utils/errors.js

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
      super(message, 401);
    }
  }
  
  class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
      super(message, 403);
    }
  }
  
  class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
      super(message, 400);
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  module.exports = {
    AppError,
    UnauthorizedError,
    ForbiddenError,
    BadRequestError,
    NotFoundError,
  };