import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";

export class ToggleFollowUpMiddleware {
  public static validate(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userId = request.body.userId;

    if (!userId || !validate(userId)) {
      return response.status(400).json({
        ok: false,
        message: "ID do usuário fornecido é inválido.",
      });
    }
    return next();
  }
}
