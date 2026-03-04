import type { ErrorHandler } from "elysia";

import { AppError } from "@/errors/app-error";
import { requestCounter } from "@/lib/prom-client";
import { makeAlertService } from "@/services/_factories/make-alert-service";
import type { Property } from "@/services/alert-service";
import { getErrorMessage } from "@/utils/get-error-message";
import { metadataToProperties } from "@/utils/metadata-to-properties";

export function errorHandlerPlugin(): ErrorHandler {
  return async (props) => {
    const { path, request, code, error, set, status } = props;
    const res = getErrorMessage(props.error);
    let { safeMessage, statusCode } = res;
    const { unsafeMessage, stack } = res;

    if (typeof code === "number") {
      statusCode = code;
    } else {
      switch (code) {
        case "INTERNAL_SERVER_ERROR":
          statusCode = 500;
          break;
        case "NOT_FOUND":
          statusCode = 404;
          safeMessage = "Não encontrado.";
          break;
        case "INVALID_COOKIE_SIGNATURE":
          statusCode = 401;
          break;
        case "INVALID_FILE_TYPE":
          statusCode = 422;
          safeMessage = "Tipo de arquivo não suportado.";
          break;
        case "PARSE":
          statusCode = 400;
          break;
        case "VALIDATION":
          statusCode = 400;
          break;
        case "UNKNOWN":
          statusCode ??= 500;
          break;
      }
    }

    requestCounter.inc({
      method: request.method,
      route: path,
      status: String(statusCode),
    });

    safeMessage ??= "Ocorreu um erro desconhecido. Tente novamente mais tarde.";

    if (statusCode >= 500) {
      const alertService = makeAlertService();

      const properties: Property[] = [
        {
          name: "Endpoint",
          value: `${request.method} ${path}`,
          inline: false,
        },
        { name: "Mensagem retornada ao cliente", value: safeMessage ?? "N/A" },
      ];

      if (stack) {
        properties.unshift({ name: "Stack", value: stack, inline: false });
      }

      if (error instanceof AppError && error.internalDetails) {
        const newProps: Property[] = [];

        newProps.push({
          name: "Mensagem de erro (interna)",
          value: error.internalDetails?.message,
          inline: false,
        });

        if (error.internalDetails.metadata) {
          const newProps = metadataToProperties(error.internalDetails.metadata);
          properties.unshift(...newProps);
        }
      }

      if (error instanceof AppError) {
        properties.unshift({
          name: "Mensagem de erro",
          value: error.message,
          inline: false,
        });
      }

      console.log("Reporting internal server error", {
        request: props,
        unsafeMessage,
        statusCode,
        properties,
      });

      await alertService.warn({
        needsAttention: true,
        title: `Erro interno: ${statusCode}`,
        description: unsafeMessage ?? safeMessage ?? undefined,
        properties,
      });
    }

    set.status = statusCode;

    if (error instanceof AppError && error.data !== undefined) {
      console.error("Has error data", error.data);

      const response = {
        message: safeMessage,
        statusCode,
        ...error.data,
      };

      console.log("Returning error with data", {
        request: props,
        response,
      });

      return status(statusCode, response);
    }

    return status(statusCode, { message: safeMessage, statusCode });
  };
}
