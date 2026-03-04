import { ZodError } from "zod";

import { AppError } from "@/errors/app-error";

export function getErrorMessage(error: unknown) {
  let safeMessage: string | null = null;
  let unsafeMessage: string | null = null;
  let statusCode = 500;
  let stack: string | null = null;

  if (typeof error === "object" && error) {
    if ("customError" in error && typeof error.customError === "string") {
      safeMessage = error.customError;
    }
  }

  if (error instanceof Error) {
    unsafeMessage = error.message;
    stack = error.stack ?? null;
  }

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    stack = error.stack ?? null;
    safeMessage = error.message;

    if (error.statusCode >= 500) {
      unsafeMessage = error.internalDetails?.message ?? error.message;
    }
  }

  if (error instanceof ZodError) {
    console.error(error.message, error);
    safeMessage = error.message;
    statusCode = 400;
  }

  if (typeof error === "string") {
    safeMessage = error;
  }

  return {
    safeMessage,
    unsafeMessage: unsafeMessage || safeMessage,
    statusCode,
    stack,
  };
}
