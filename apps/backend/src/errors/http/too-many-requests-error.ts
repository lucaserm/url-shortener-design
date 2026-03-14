import { AppError } from "../app-error";

export class TooManyRequestsError extends AppError {
  constructor(
    message = "Limite de requisições excedido. Tente novamente mais tarde.",
  ) {
    super(message, 429);
  }
}
