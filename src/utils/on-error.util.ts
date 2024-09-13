import { Response } from "express";
import { HttpError } from "../erros/http.error";

export function onError(err: unknown, response: Response): Response {
  if (err instanceof HttpError) {
    return response.status(err.statusCode).json({
      ok: false,
      message: err.message,
    });
  }

  return response.status(500).json({
    ok: false,
    message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
      (err as Error).message
    }`,
  });
}
