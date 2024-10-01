import { Request, Response } from "express";
import { UserService } from "../services/users.service";
import { onError } from "../utils/on-error.util";

export class UsersController {
  public static async create(request: Request, response: Response) {
    try {
      const { name, email, username, password, avatar } = request.body;

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

      const service = new UserService();
      const users = await service.listUsers({
        limit: limit ? Number(limit) : undefined,
        page: page ? Number(page) : undefined,
      });

      return response.status(200).json({
        ok: true,
        message: "Abaixo lista de usuários cadastrados:",
        users: users,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
  public static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name } = request.body;

      const service = new UserService();

      const userUpdated = await service.updateUser({
        id,
        name,
      });

      return response.status(201).json({
        ok: true,
        message: `Usuário atualizado com sucesso`,
        userUpdated,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
  public static async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const service = new UserService();

      const userDeleted = await service.deleteUser(id);

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
