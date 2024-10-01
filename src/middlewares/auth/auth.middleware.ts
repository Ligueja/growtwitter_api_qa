import { NextFunction, Request, Response } from "express";
import { JWT } from "../../libs/jwt.lib";

export class AuthMiddleware {
  public static async validate(
    requeste: Request,
    response: Response,
    next: NextFunction
  ) {
    const bearerToken = requeste.headers.authorization;

    if (!bearerToken) {
      return response.status(401).json({
        ok: false,
        message: "Token é obrigatório",
      });
    }

    const jwtToken = bearerToken.replace(/Bearer/i, "").trim();

    const jwt = new JWT();
    const userLogged = jwt.decodedToken(jwtToken);

    if (!userLogged) {
      return response.status(401).json({
        ok: false,
        message: "Token inválido",
      });
    }

    requeste.body.userId = userLogged.id;
    requeste.body.username = userLogged.username;
    requeste.body.name = userLogged.name;
    requeste.body.email = userLogged.email;

    return next();
  }
}
