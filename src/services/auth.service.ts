import { prismaConnection } from "../database/prisma.connection";
import { HttpError } from "../erros/http.error";
import { Bcrypt } from "../libs/bcrypt.lib";
import { JWT } from "../libs/jwt.lib";
import { LoginUserInputDTO, LoginUserOutputDTO } from "../dtos/auth-login.dto";

export class AuthService {
  public async loginUser(
    input: LoginUserInputDTO
  ): Promise<LoginUserOutputDTO> {
    //1º encontrasr um usuário com e-mail/username informado
    const userFound = await prismaConnection.user.findFirst({
      where: {
        OR: [{ username: input.username }, { email: input.email }],
      },
    });

    // se não localizar email/username informados, estoura o erro:
    if (!userFound) {
      throw new HttpError("Credenciais inválidas", 401);
    }

    const bcrypt = new Bcrypt();
    const isMatch = await bcrypt.verify(userFound.password, input.password);

    if (!isMatch) {
      throw new HttpError("Credenciais inválidas", 401);
    }

    // email/username Ok e password OK

    const jwt = new JWT();
    const token = jwt.generateToken({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      username: userFound.username,
    });

    // nomeu o nome do token como authToken, que está igual no controler.
    // userLogged vai passar quando do login os dados do usuário logado.
    return {
      authToken: token,
      userLogged: userFound,
    };
  }
}
