import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";

export class CreateReplyMiddleware {
  public static validate(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { tweetOriginalId } = request.body;

    if (!tweetOriginalId || !validate(tweetOriginalId)) {
      return response.status(400).json({
        ok: false,
        message: "Id do tweet original inválido",
      });
    }
    return next();
  }
}
