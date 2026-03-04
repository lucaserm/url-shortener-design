import { AppError } from "../app-error";

export class GoneError extends AppError {
  constructor(message = "Recurso removido permanentemente.") {
    super(message, 410);
  }
}
