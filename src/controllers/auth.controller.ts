import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { AuthService } from "../services/auth.service";
import { onError } from "../utils/on-error.util";

export class AuthController {
  public static async Login(request: Request, response: Response) {
    try {
      const { username, email, password } = request.body;

      const service = new AuthService();
      const { authToken, userLogged } = await service.loginUser({
        username,
        email,
        password,
      });

      return response.status(201).json({
        ok: true,
        message: "Usuário autenticado",
        authToken,
        userLogged,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
}
