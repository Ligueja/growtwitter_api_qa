import prismaConnection from "../database/prisma.connection";
import { HttpError } from "../erros/http.error";
import { Bcrypt } from "../libs/bcrypt.lib";
import { JWT } from "../libs/jwt.lib";
import { LoginUserInputDTO, LoginUserOutputDTO } from "../dtos";

export class AuthService {
  public async loginUser(
    input: LoginUserInputDTO
  ): Promise<LoginUserOutputDTO> {
    const userFound = await prismaConnection.user.findFirst({
      where: {
        OR: [{ username: input.username }, { email: input.email }],
      },
    });

    if (!userFound) {
      throw new HttpError("Credenciais inválidas", 401);
    }

    const bcrypt = new Bcrypt();
    const isMatch = await bcrypt.verify(userFound.password, input.password);

    if (!isMatch) {
      throw new HttpError("Credenciais inválidas", 401);
    }

    const jwt = new JWT();
    const token = jwt.generateToken({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      username: userFound.username,
    });

    return {
      authToken: token,
      userLogged: userFound,
    };
  }
}
