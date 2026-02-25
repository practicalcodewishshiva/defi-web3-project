class AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(400, message);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Authorization failed') {
    super(403, message);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(404, `${resource} not found`);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(409, message);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}

const throwError = (statusCode, message) => {
  throw new AppError(statusCode, message);
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  throwError
};
