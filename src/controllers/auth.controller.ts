import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class AuthController {
  public static async Login(request: Request, response: Response) {
    try {
      const { username, email, password } = request.body;

      //buscar usuário com o e-mail e senha informados no corpo da requisição:
      const userFound = await prismaConnection.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
          password: password,
        },
      });

      // se não localizar o e-mail e/ou senha:
      if (!userFound) {
        return response.status(401).json({
          ok: false,
          message: "Credenciais inválidas",
        });
      }

      //verificar se o usuário já está logado (se já possui atuthToken)
      if (userFound.authToken) {
        return response.status(401).json({
          ok: false,
          message: "O usuário já está logado",
        });
      }

      // geração do authToken
      const authToken = randomUUID();

      await prismaConnection.user.update({
        where: { id: userFound.id },
        data: { authToken },
      });

      return response.status(201).json({
        ok: true,
        message: "Usuário autenticado",
        authToken,
        user: {
          username: userFound.username,
          name: userFound.name,
          avatar: userFound.avatar,
        },
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async logout(request: Request, response: Response) {
    try {
      const headers = request.headers;

      if (!headers.authorization) {
        return response.status(401).json({
          ok: false,
          message: "Token é obrigatório",
        });
      }

      //fazer atualização e retirar authToken do usuário:
      const result = await prismaConnection.user.updateMany({
        where: {
          authToken: headers.authorization,
        },
        data: { authToken: null },
      });

      if (result.count === 0) {
        return response.status(401).json({
          ok: false,
          message: "Token inválido",
        });
      }

      return response.status(200).json({
        ok: true,
        message: "Logout realizado com sucesso",
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }
}
