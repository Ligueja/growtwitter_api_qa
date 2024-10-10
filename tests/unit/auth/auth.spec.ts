import { AuthService } from "../../../src/services/auth.service";
import { prismaMock } from "../../config/prisma.mock";
import { HttpError } from "../../../src/erros/http.error";
import { Bcrypt } from "../../../src/libs/bcrypt.lib";
import { JWT } from "../../../src/libs/jwt.lib";

describe("AuthService - loginUser", () => {
  const service = new AuthService();

  test("Deveria lançar exceção se o usuário não for encontrado", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const result = service.loginUser({
      username: "wrong_user",
      email: "wrong_email@example.com",
      password: "wrong_password",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Credenciais inválidas");
  });

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

    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(false);

    const result = service.loginUser({
      username: "user1",
      email: "user1@example.com",
      password: "wrong_password",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Credenciais inválidas");
  });

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

    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(true);

    const mockToken = "mocked_jwt_token";
    jest.spyOn(JWT.prototype, "generateToken").mockReturnValue(mockToken);

    const result = await service.loginUser({
      username: "user1",
      email: "user1@example.com",
      password: "correct_password",
    });

    expect(result).toHaveProperty("authToken", mockToken);
    expect(result).toHaveProperty("userLogged");
    expect(result.userLogged).toMatchObject({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
    });

    expect(JWT.prototype.generateToken).toHaveBeenCalledWith({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
    });

    expect(Bcrypt.prototype.verify).toHaveBeenCalledWith(
      "hashed_password",
      "correct_password"
    );
  });
});
