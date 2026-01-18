export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public error?: any
  ) {
    super(message);
    this.name = 'AppError';
    // Capture stack trace excluding constructor
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
    console.log('[AppError] Created:', { message: this.message, stack: this.stack });
  }

  toJson(): object {
    return {
      message: this.message,
      error: this.error,
      stack: this.stack
    };
  }
}

import { z } from "zod";

export const catchError = (error: any): { status: number, body: object } => {
  if (error instanceof z.ZodError) {
    const result = {
      status: 400,
      body: {
        error: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.issues
      }
    };
    console.log('[catchError] ZodError:', result);
    return result;
  }

  if (error instanceof AppError) {
    const details = error.error instanceof Error ? {
      ...error.error,
      name: error.error.name,
      message: error.error.message,
      stack: error.error.stack
    } : error.error;

    const result = {
      status: error.statusCode,
      body: {
        error: error.message,
        message: error.message,
        details,
        stack: error.stack // Include AppError stack as well
      }
    };
    console.log('[catchError] AppError:', result);
    return result;
  }

  console.error('Unhandled error in catchError:', error);
  const result = {
    status: 500,
    body: {
      error: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }
  };
  console.log('[catchError] UNHANDLED:', result);
  return result;
};
