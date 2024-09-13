// o seervice contém regras de negócio e chamadas no BD.

import { User } from "@prisma/client";
import { prismaConnection } from "../database/prisma.connection";
import { Bcrypt } from "../libs/bcrypt.lib";
import { CreateUserDTO } from "../dtos";
import { HttpError } from "../erros/http.error";

export class UserService {
  // no imput é a entrada de dados na promise é a saida de dados
  public async createUser(imput: CreateUserDTO): Promise<User> {
    const existingEmail = await this.existingEmail(imput.email);

    if (existingEmail) {
      throw new HttpError("E-mail já cadastrado", 409);
    }

    const existingUsername = await this.existingUsername(imput.username);

    if (existingUsername) {
      throw new HttpError("Username já cadastrado", 409);
    }

    const bcrypt = new Bcrypt();
    const hash = await bcrypt.encoded(imput.password);

    const newUser = await prismaConnection.user.create({
      data: {
        name: imput.name,
        email: imput.email,
        username: imput.username,
        password: hash,
        avatar: imput.avatar,
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
}
