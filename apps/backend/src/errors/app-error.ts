export interface AppErrorInternalDetails {
  message: string;
  metadata?: Record<string, unknown>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
    public internalDetails?: AppErrorInternalDetails,
  ) {
    super(message);
  }
}
