// o seervice contém regras de negócio e chamadas no BD.
import { User } from "@prisma/client";
import { prismaConnection } from "../database/prisma.connection";
import { Bcrypt } from "../libs/bcrypt.lib";
import {
  CreateUserDTO,
  ListAllUsersInputDTO,
  ListallUsersOutputDTO,
  updateUserInputDTO,
} from "../dtos";
import { HttpError } from "../erros/http.error";

export class UserService {
  // no input é a entrada de dados na promise é a saida de dados
  public async createUser(input: CreateUserDTO): Promise<User> {
    const existingEmail = await this.existingEmail(input.email);

    if (existingEmail) {
      throw new HttpError("E-mail já cadastrado", 409);
    }

    const existingUsername = await this.existingUsername(input.username);

    if (existingUsername) {
      throw new HttpError("Username já cadastrado", 409);
    }

    const bcrypt = new Bcrypt();
    const hash = await bcrypt.encoded(input.password);

    const newUser = await prismaConnection.user.create({
      data: {
        name: input.name,
        email: input.email,
        username: input.username,
        password: hash,
        avatar: input.avatar,
      },
    });

    return newUser;
  }

  public async existingEmail(email: any): Promise<boolean> {
    //Verificação se já existe e-mail
    const existingEmail = await prismaConnection.user.findUnique({
      where: {
        email: email,
      },
    });

    // Boolean(existingEmail) transforma o objeto "existingEmail em boolean"
    return Boolean(existingEmail);
  }

  public async existingUsername(username: any): Promise<boolean> {
    //Verificação se já existe e-mail
    const existingUsername = await prismaConnection.user.findUnique({
      where: {
        username: username,
      },
    });

    // Boolean(existingUsername) transforma o objeto "existingEmail em boolean"
    return Boolean(existingUsername);
  }

  public async listUsers(
    input: ListAllUsersInputDTO
  ): Promise<ListallUsersOutputDTO> {
    let limitDefault = 5;
    let pageDefault = 1;

    if (input.limit) {
      limitDefault = Number(input.limit);
    }

    if (input.page) {
      pageDefault = Number(input.page);
    }

    const totalUsers = await this.totalUsers();

    if (totalUsers === 0) {
      throw new HttpError("Nenhum usuário cadastrado", 404);
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

    return {
      data: users,
      pagination: {
        limit: limitDefault,
        page: pageDefault,
        count: totalUsers,
        totalPages: Math.ceil(totalUsers / limitDefault),
      },
    };
  }

  public async totalUsers(): Promise<number> {
    const totalUsers = await prismaConnection.user.count({
      where: {
        deleted: false,
      },
    });

    return totalUsers;
  }

  public async updateUser(input: updateUserInputDTO): Promise<User> {
    const userFound = await this.getUserById(input.id);

    const userUpdate = await prismaConnection.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        name: input.name,
        updatedAt: new Date(),
      },
    });

    return userUpdate;
  }

  public async getUserById(id: string): Promise<User> {
    const userFound = await prismaConnection.user.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    if (!userFound) {
      throw new HttpError("Usuário não encontrado", 404);
    }

    return userFound;
  }

  public async deleteUser(id: string): Promise<User> {
    const userFound = await this.getUserById(id);

    const userDeleted = await prismaConnection.user.update({
      where: {
        id: userFound.id,
        deleted: false,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return userDeleted;
  }
}
