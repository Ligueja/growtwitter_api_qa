import { AuthService } from "../../src/services/auth.service";
import { prismaMock } from "../config/prisma.mock";
import { HttpError } from "../../src/erros/http.error";
import { Bcrypt } from "../../src/libs/bcrypt.lib";
import { JWT } from "../../src/libs/jwt.lib";

describe("AuthService - loginUser", () => {
  const service = new AuthService();

  /**
   * Testando se o login falha com credenciais inválidas (usuário não encontrado)
   */
  test("Deveria lançar exceção se o usuário não for encontrado", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const result = service.loginUser({
      username: "wrong_user",
      email: "wrong_email@example.com",
      password: "wrong_password",
    });

    /**
     * Verifica se lança uma exceção de credenciais inválidas
     */
    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Credenciais inválidas");
  });

  /**
   * Testando login com senha incorreta
   */
  test("Deveria lançar exceção se a senha não coincidir", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    /**
     * Mockando o bcrypt para retornar false, simulando que a senha está incorreta
     */
    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(false);

    const result = service.loginUser({
      username: "user1",
      email: "user1@example.com",
      password: "wrong_password",
    });

    /**
     * Verifica se lança exceção de credenciais inválidas
     */
    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Credenciais inválidas");
  });
  /**
   * Testando login com sucesso
   */
  test("Deveria lançar exceção se a senha não coincidir", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
      password: "hashed_password", // Senha já criptografada
      avatar: null, // Propriedade adicional
      deleted: false, // Propriedade adicional
      createdAt: new Date(), // Propriedade adicional
      updatedAt: new Date(), // Propriedade adicional
      deletedAt: null, // Propriedade adicional
    });

    /**
     * Mockando o bcrypt para retornar true, simulando que a senha está correta
     */
    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(true);

    /**
     * Mockando o JWT para gerar um token de forma previsível
     */
    const mockToken = "mocked_jwt_token";
    jest.spyOn(JWT.prototype, "generateToken").mockReturnValue(mockToken);

    const result = await service.loginUser({
      username: "user1",
      email: "user1@example.com",
      password: "correct_password",
    });

    /**
     * Verifica se o retorno contém o authToken e os dados do usuário
     */
    expect(result).toHaveProperty("authToken", mockToken);
    expect(result).toHaveProperty("userLogged");
    expect(result.userLogged).toMatchObject({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
    });

    /**
     * Verifica se o JWT foi gerado com os dados corretos
     */

    expect(JWT.prototype.generateToken).toHaveBeenCalledWith({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
    });

    /**
     * Assert 5: Verifica se o bcrypt foi chamado para verificar a senha
     */
    expect(Bcrypt.prototype.verify).toHaveBeenCalledWith(
      "hashed_password",
      "correct_password"
    );
  });
});
