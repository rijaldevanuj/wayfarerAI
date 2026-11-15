/**
 * Typed error classes for the Wayfarer application.
 * Each maps to a specific HTTP status code for the BFF layer.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTH_REQUIRED');
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class AIStructureError extends AppError {
  constructor(message: string) {
    super(message, 422, 'AI_STRUCTURE_ERROR');
    this.name = 'AIStructureError';
  }
}

export class AITimeoutError extends AppError {
  constructor(message = 'AI request timed out after 15s') {
    super(message, 504, 'AI_TIMEOUT');
    this.name = 'AITimeoutError';
  }
}

export class AIRateLimitError extends AppError {
  constructor(message = 'AI provider rate-limited the request') {
    super(message, 429, 'AI_RATE_LIMIT');
    this.name = 'AIRateLimitError';
  }
}

/**
 * Maps an AppError (or unknown) to a JSON-safe response body.
 */
export function errorToResponse(err: unknown): {
  status: number;
  body: { error: string; code: string };
} {
  if (err instanceof AppError) {
    return {
      status: err.statusCode,
      body: { error: err.message, code: err.code },
    };
  }
  return {
    status: 500,
    body: { error: 'Internal server error', code: 'INTERNAL' },
  };
}
