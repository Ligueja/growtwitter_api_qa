import { NextFunction, Request, Response } from "express";

export class LoginMiddleware {
  public static validate(
    requeste: Request,
    response: Response,
    next: NextFunction
  ) {
    const { username, email, password } = requeste.body;

    if (!username && !email) {
      return response.status(400).json({
        ok: false,
        message: "Username ou email devem ser informados",
      });
    }

    if (email && (typeof email !== "string" || !email.includes("@"))) {
      return response.status(400).json({
        ok: false,
        message: "Informe um e-mail válido",
      });
    }

    if (username && typeof username !== "string") {
      return response.status(400).json({
        ok: false,
        message: "Informe um username válido",
      });
    }

    if (!password || typeof password !== "string") {
      return response.status(400).json({
        ok: false,
        message: "Informe uma senha no formato conjunto de caracteres",
      });
    }

    return next();
  }
}
