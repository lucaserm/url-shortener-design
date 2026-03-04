import { AppError } from "../app-error";

export class NotFoundError extends AppError {
  constructor(message = "Não encontrado.") {
    super(message, 404);
  }
}
