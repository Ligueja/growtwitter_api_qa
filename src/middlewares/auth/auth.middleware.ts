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

    // abaixo vamos "limpar" o token, o deixando somente com a string correta.
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

    return next();
  }
}
