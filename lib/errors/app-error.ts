export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: any
  ) {
    super(code);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
