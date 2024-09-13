import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { UserService } from "../services/user.service";
import { HttpError } from "../erros/http.error";
import { onError } from "../utils/on-error.util";

export class UsersController {
  public static async create(request: Request, response: Response) {
    try {
      // captura dos dados do body "inputs do usuário":
      const { name, email, username, password, avatar } = request.body;

      //após criar o service, fazer conforme abaixo:
      const service = new UserService();

      const data = await service.createUser({
        name,
        email,
        username,
        password,
        avatar,
      });

      return response.status(201).json({
        ok: true,
        message: "Usuário cadastrado com sucesso",
        data,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
  public static async list(request: Request, response: Response) {
    try {
      let { limit, page } = request.query;

      let limitDefault = 5;
      let pageDefault = 1;

      if (limit) {
        limitDefault = Number(limit);
      }

      if (page) {
        pageDefault = Number(page);
      }

      const users = await prismaConnection.user.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: {
          name: "asc",
        },
        where: {
          deleted: false,
        },
      });
      // Verifica se não há usuários retornados
      if (users.length === 0) {
        return response.status(200).json({
          ok: true,
          message: "Não há usuários cadastrados.",
        });
      }

      const totalUsers = await prismaConnection.user.count({
        where: {
          deleted: false,
        },
      });

      return response.status(200).json({
        ok: true,
        message: "Abaixo lista de usuários cadastrados:",
        users: users,
        pagination: {
          limit: limitDefault,
          page: pageDefault,
          count: totalUsers,
          totalPages: Math.ceil(totalUsers / limitDefault),
        },
      });
    } catch (err) {
      return onError(err, response);
    }
  }
  public static async get(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const userFound = await prismaConnection.user.findUnique({
        where: {
          id,
          deleted: false,
        },
      });

      if (!userFound) {
        return response.status(404).json({
          ok: false,
          message: "Usuário não localizado em nosso Banco de Dados",
        });
      }

      return response.status(201).json({
        ok: true,
        message: `Usuário localizado com sucesso`,
        user: userFound,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
  public static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name } = request.body;

      const userFound = await prismaConnection.user.findUnique({
        where: {
          id,
          deleted: false,
        },
      });

      if (!userFound) {
        return response.status(404).json({
          ok: false,
          message: "Usuário não localizado em nosso Banco de Dados",
        });
      }

      const userUpdate = await prismaConnection.user.update({
        where: {
          id,
        },
        data: {
          name,
          updatedAt: new Date(),
        },
      });

      return response.status(201).json({
        ok: true,
        message: `Usuário atualizado com sucesso`,
        user: userUpdate,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
  public static async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const userFound = await prismaConnection.user.findUnique({
        where: {
          id,
          deleted: false,
        },
      });

      if (!userFound) {
        return response.status(404).json({
          ok: false,
          message: "Usuário não localizado em nosso Banco de Dados",
        });
      }

      const userDeleted = await prismaConnection.user.update({
        where: {
          id,
          deleted: false,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });

      return response.status(200).json({
        ok: true,
        message: "Usuário deletado com sucesso",
        userDeleted,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
}
