// src/domain/errors/validation.error.ts
import { BaseError } from "./base.error";

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 400, true);
  }
}
