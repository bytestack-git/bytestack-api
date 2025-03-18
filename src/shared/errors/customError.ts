// src/shared/errors/customError.ts
export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400); // HTTP 400 Bad Request
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404); // HTTP 404 Not Found
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401); // HTTP 401 Unauthorized
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409); // HTTP 409 Conflict
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
