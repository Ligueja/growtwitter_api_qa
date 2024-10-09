import { randomUUID } from "crypto";
import { createServer } from "../../../src/server/express.server";
import request from "supertest";
import { UserService } from "../../../src/services/users.service";
import { HttpError } from "../../../src/erros/http.error";
import { prismaMock } from "../../config/prisma.mock";
import { ListallUsersOutputDTO } from "../../../src/dtos";

describe("POST /users", () => {
  const server = createServer();

  test("Deve retornar 400 se o corpo da requisição estiver inválido", async () => {
    const invalidBody = {
      name: "",
      email: "invalidemail",
      username: "",
      password: "123",
    };

    const result = await request(server).post("/users").send(invalidBody);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toContain("Nome é obrigatório");
  });

  test("Deve retornar 500 se ocorrer um erro no servidor", async () => {
    const validBody = {
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
    };

    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error("Prisma error"));

    const result = await request(server).post("/users").send(validBody);

    expect(result.statusCode).toBe(500);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toContain("Ocorreu um erro inesperado.");
  });

  test("Deve retornar 201 quando o usuário for criado com sucesso", async () => {
    const validBody = {
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
    };

    const createdUser = {
      id: randomUUID(),
      ...validBody,
      deleted: false,
      createdAt: new Date().toISOString() as unknown as Date,
      updatedAt: new Date().toISOString() as unknown as Date,
      deletedAt: null,
    };

    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(createdUser);

    const result = await request(server).post("/users").send(validBody);

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body).toHaveProperty("data");
    expect(result.body.ok).toBe(true);
    expect(result.body.message).toContain("Usuário cadastrado com sucesso");
    expect(result.body.data).toEqual(createdUser);
  });
});

describe("GET /users", () => {
  const server = createServer();

  test("Deve retornar a lista de usuários com sucesso", async () => {
    const mockUsers: ListallUsersOutputDTO = {
      data: [
        {
          id: "uuid1",
          name: "User 1",
          email: "user1@example.com",
          username: "user1",
          password: "hashed_password",
          avatar: null,
          deleted: false,
          createdAt: new Date().toISOString() as unknown as Date,
          updatedAt: new Date().toISOString() as unknown as Date,
          deletedAt: null,
        },
        {
          id: "uuid2",
          name: "User 2",
          email: "user2@example.com",
          username: "user2",
          password: "hashed_password",
          avatar: null,
          deleted: false,
          createdAt: new Date().toISOString() as unknown as Date,
          updatedAt: new Date().toISOString() as unknown as Date,
          deletedAt: null,
        },
      ],
      pagination: {
        limit: 10,
        page: 1,
        count: 2,
        totalPages: 1,
      },
    };

    jest.spyOn(UserService.prototype, "listUsers").mockResolvedValue(mockUsers);

    const result = await request(server).get("/users");

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body).toHaveProperty("users");
    expect(result.body.ok).toBe(true);
    expect(result.body.message).toBe("Abaixo lista de usuários cadastrados:");
    expect(result.body.users).toEqual(mockUsers);
  });

  test("Deve retornar 500 quando ocorrer erro no servidor", async () => {
    jest
      .spyOn(UserService.prototype, "listUsers")
      .mockRejectedValue(new Error("Prisma error"));

    const result = await request(server).get("/users");

    expect(result.statusCode).toBe(500);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toContain("Ocorreu um erro inesperado.");
  });
});

describe("PUT /users/:id", () => {
  const server = createServer();

  test("Deve retornar 400 se o parâmetro não for um UUID inválido", async () => {
    const invalidUuid = "abc";
    const result = await request(server).put(`/users/${invalidUuid}`).send();

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toBe("UUID inválido");
  });

  test("Deve retornar 400 se o tipo dos dados enviados forem inválidos", async () => {
    const validUuid = randomUUID();
    const invalidBody = {
      name: "",
    };
    const result = await request(server)
      .put(`/users/${validUuid}`)
      .send(invalidBody);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toBe("Nome é obrigatório");
  });

  test("Deve retornar 404 se registro do usuário não existir", async () => {
    const validUuid = randomUUID();
    const validBody = {
      name: "Nome",
    };

    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockRejectedValue(new HttpError("Usuário não encontrado", 404));

    const result = await request(server)
      .put(`/users/${validUuid}`)
      .send(validBody);

    expect(result.statusCode).toBe(404);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toBe("Usuário não encontrado");
  });

  test("Deve retornar 500 quando tiver um erro de servidor", async () => {
    const validUuid = randomUUID();
    const validBody = {
      name: "Nome",
    };

    jest.spyOn(UserService.prototype, "getUserById").mockResolvedValue({
      id: randomUUID(),
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
    prismaMock.user.update.mockRejectedValue(new Error("Prisma error"));

    const result = await request(server)
      .put(`/users/${validUuid}`)
      .send(validBody);

    expect(result.statusCode).toBe(500);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toContain("Ocorreu um erro inesperado.");
  });

  test("Deve retornar 201 quando o usuário for atualizado com sucesso", async () => {
    const validUuid = randomUUID();
    const validBody = {
      name: "Nome",
    };
    const userToUpdate = {
      id: randomUUID(),
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date().toISOString() as unknown as Date,
      updatedAt: new Date().toISOString() as unknown as Date,
      deletedAt: null,
    };

    const userUpdate = {
      ...userToUpdate,
      name: validBody.name,
    };

    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(userToUpdate);
    prismaMock.user.update.mockResolvedValue(userUpdate);

    const result = await request(server)
      .put(`/users/${validUuid}`)
      .send(validBody);

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body).toHaveProperty("userUpdated");
    expect(result.body.ok).toBe(true);
    expect(result.body.message).toContain("Usuário atualizado com sucesso");
    expect(result.body.userUpdated).toEqual(userUpdate);
  });
});

describe("DELETE /users/:id", () => {
  const server = createServer();

  test("Deve retornar 400 se o parâmetro não for um UUID inválido", async () => {
    const invalidUuid = "abc";
    const result = await request(server).put(`/users/${invalidUuid}`).send();

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toBe("UUID inválido");
  });

  test("Deve retornar 404 se registro do usuário não existir", async () => {
    const validUuid = randomUUID();
    const userDeleted = {
      id: randomUUID(),
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date().toISOString() as unknown as Date,
      updatedAt: new Date().toISOString() as unknown as Date,
      deletedAt: null,
    };

    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockRejectedValue(new HttpError("Usuário não encontrado", 404));

    const result = await request(server)
      .put(`/users/${validUuid}`)
      .send(userDeleted);

    expect(result.statusCode).toBe(404);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toBe("Usuário não encontrado");
  });

  test("Deve retornar 500 quando tiver um erro de servidor", async () => {
    const validUuid = randomUUID();
    const userDeleted = {
      id: randomUUID(),
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date().toISOString() as unknown as Date,
      updatedAt: new Date().toISOString() as unknown as Date,
      deletedAt: null,
    };

    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(userDeleted);
    prismaMock.user.update.mockRejectedValue(new Error("Prisma error"));

    const result = await request(server)
      .put(`/users/${validUuid}`)
      .send(userDeleted);

    expect(result.statusCode).toBe(500);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toContain("Ocorreu um erro inesperado.");
  });

  test("Deve retornar 201 quando o usuário for deletado com sucesso", async () => {
    const validUuid = randomUUID();
    const userToDelete = {
      id: randomUUID(),
      name: "User Test",
      email: "test@example.com",
      username: "user_test",
      password: "hashed_password",
      avatar: null,
      deleted: false,
      createdAt: new Date().toISOString() as unknown as Date,
      updatedAt: new Date().toISOString() as unknown as Date,
      deletedAt: null,
    };

    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(userToDelete);
    prismaMock.user.delete.mockResolvedValue(userToDelete);

    const result = await request(server)
      .delete(`/users/${validUuid}`)
      .send(userToDelete);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("ok");
    expect(result.body).toHaveProperty("message");
    expect(result.body.ok).toBe(true);
    expect(result.body.message).toBe("Usuário deletado com sucesso");
  });
});
