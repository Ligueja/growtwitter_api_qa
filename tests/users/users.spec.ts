import { UserService } from "../../src/services/users.service";
import { prismaMock } from "../config/prisma.mock";
import { HttpError } from "../../src/erros/http.error";
import { Bcrypt } from "../../src/libs/bcrypt.lib";

describe("UserService - createUser", () => {
  const service = new UserService();

  test("Deveria lançar exceção se o e-mail já estiver cadastrado", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "user1",
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = service.createUser({
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "password",
      avatar: null,
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("E-mail já cadastrado");
  });

  test("Deveria lançar exceção se o username já estiver cadastrado", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "user1",
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = service.createUser({
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "password",
      avatar: null,
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Username já cadastrado");
  });

  test("Deveria criar um novo usuário com sucesso", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const hashedPassword = "hashed_password";
    jest.spyOn(Bcrypt.prototype, "encoded").mockResolvedValue(hashedPassword);

    prismaMock.user.create.mockResolvedValue({
      id: "user1",
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: hashedPassword,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      deletedAt: null,
    });

    const result = await service.createUser({
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "password",
      avatar: null,
    });

    expect(result).toMatchObject({
      id: "user1",
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: hashedPassword,
    });

    expect(Bcrypt.prototype.encoded).toHaveBeenCalledWith("password");
  });
});

describe("UserService - listUsers", () => {
  const service = new UserService();

  test("Deveria lançar exceção se não houver usuários cadastrados", async () => {
    prismaMock.user.count.mockResolvedValueOnce(0);

    const result = service.listUsers({});

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Nenhum usuário cadastrado");
  });

  test("Deveria retornar a lista de usuários com sucesso", async () => {
    prismaMock.user.count.mockResolvedValueOnce(2);
    prismaMock.user.findMany.mockResolvedValueOnce([
      {
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
      },
      {
        id: "user2",
        name: "User Two",
        email: "user2@example.com",
        username: "user2",
        password: "hashed_password",
        avatar: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    const result = await service.listUsers({ limit: 5, page: 1 });

    expect(result).toHaveProperty("data");
    expect(result.data).toHaveLength(2);
    expect(result.pagination).toHaveProperty("count", 2);
    expect(result.pagination).toHaveProperty("totalPages", 1);
  });
});

describe("UserService - updateUser", () => {
  const service = new UserService();

  test("Deveria lançar exceção se o usuário não for encontrado", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result = service.updateUser({ id: "user1", name: "New Name" });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Usuário não encontrado");
  });

  test("Deveria atualizar o usuário com sucesso", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
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

    prismaMock.user.update.mockResolvedValueOnce({
      id: "user1",
      name: "New Name",
      email: "user1@example.com",
      username: "user1",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await service.updateUser({ id: "user1", name: "New Name" });

    expect(result).toMatchObject({
      id: "user1",
      name: "New Name",
    });
  });
});

describe("UserService - deleteUser", () => {
  const service = new UserService();

  test("Deveria lançar exceção se o usuário não for encontrado", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result = service.deleteUser("user1");

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Usuário não encontrado");
  });

  test("Deveria deletar o usuário com sucesso", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
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

    prismaMock.user.update.mockResolvedValueOnce({
      id: "user1",
      name: "User One",
      email: "user1@example.com",
      username: "user1",
      password: "hashed_password",
      avatar: null,
      deleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    });

    const result = await service.deleteUser("user1");

    expect(result).toMatchObject({
      id: "user1",
      deleted: true,
    });
  });
});
