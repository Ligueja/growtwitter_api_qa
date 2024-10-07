import { FollowersService } from "../../src/services/followers.service";
import { prismaMock } from "../config/prisma.mock";
import { HttpError } from "../../src/erros/http.error";

describe("FollowersService", () => {
  const service = new FollowersService();

  describe("toggleFollow", () => {
    test("Deveria seguir um usuário com sucesso", async () => {
      const userId = "user1";
      const targetUserId = "user2";

      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: targetUserId,
        name: "Lisa",
        email: "lisa@example.com",
        username: "lisa",
        password: "hashed_password",
        avatar: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: userId,
        name: "Homer",
        email: "homer@example.com",
        username: "homer",
        password: "hashed_password",
        avatar: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      prismaMock.follower.create.mockResolvedValue({
        id: "followId",
        followerId: userId,
        userId: targetUserId,
      });

      const result = await service.toggleFollow(userId, targetUserId);

      expect(result).toMatchObject({
        ok: true,
        status: 201,
        message: expect.stringContaining("começou a seguir"),
      });
    });

    test("Deveria deixar de seguir um usuário com sucesso", async () => {
      const userId = "user1";
      const targetUserId = "user2";

      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: targetUserId,
        name: "Lisa",
        email: "lisa@example.com",
        username: "lisa",
        password: "hashed_password",
        avatar: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: userId,
        name: "Homer",
        email: "homer@example.com",
        username: "homer",
        password: "hashed_password",
        avatar: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      prismaMock.follower.findFirst.mockResolvedValue({
        id: "followId",
        followerId: userId,
        userId: targetUserId,
      });
      prismaMock.follower.delete.mockResolvedValue({
        id: "followId",
        followerId: userId,
        userId: targetUserId,
      });

      const result = await service.toggleFollow(userId, targetUserId);

      expect(result).toMatchObject({
        ok: true,
        status: 201,
        message: expect.stringContaining("deixou de seguir"),
      });
    });

    test("Deveria lançar erro ao tentar seguir a si mesmo", async () => {
      const userId = "user1";
      const targetUserId = "user1";

      await expect(service.toggleFollow(userId, targetUserId)).rejects.toThrow(
        HttpError
      );
      await expect(service.toggleFollow(userId, targetUserId)).rejects.toThrow(
        "Você não pode seguir a si mesmo"
      );
    });

    test("Deveria lançar erro se o usuário alvo não for encontrado", async () => {
      const userId = "user1";
      const targetUserId = "user2";

      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.toggleFollow(userId, targetUserId)).rejects.toThrow(
        HttpError
      );
      await expect(service.toggleFollow(userId, targetUserId)).rejects.toThrow(
        "Usuário não localizado"
      );
    });

    test("Deveria lançar erro se o seguidor não for encontrado", async () => {
      const userId = "user1";
      const targetUserId = "user2";

      prismaMock.user.findUnique
        .mockResolvedValueOnce({
          id: targetUserId,
          name: "Lisa",
          email: "lisa@example.com",
          username: "lisa",
          password: "hashed_password",
          avatar: null,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        })
        .mockResolvedValueOnce(null);

      await expect(service.toggleFollow(userId, targetUserId)).rejects.toThrow(
        HttpError
      );
      await expect(service.toggleFollow(userId, targetUserId)).rejects.toThrow(
        "Usuário não localizado"
      );
    });
  });
});
