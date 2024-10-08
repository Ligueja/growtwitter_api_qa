import { LikeService } from "../../../src/services/likes.service";
import { prismaMock } from "../../config/prisma.mock";
import { HttpError } from "../../../src/erros/http.error";
import { TweetType } from "@prisma/client";

describe("LikeService - createLike", () => {
  const service = new LikeService();

  test("Deveria criar um novo like com sucesso", async () => {
    const newLikeData = {
      id: "like1",
      userId: "user1",
      tweetId: "tweet1",
      createdAt: new Date(),
    };

    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.like.findFirst.mockResolvedValue(null);
    prismaMock.like.create.mockResolvedValue(newLikeData);

    const result = await service.createLike({
      userId: "user1",
      tweetId: "tweet1",
    });

    expect(result).toMatchObject(newLikeData);
  });

  test("Deveria lançar exceção se o usuário já curtiu o tweet", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.like.findFirst.mockResolvedValue({
      id: "like1",
      userId: "user1",
      tweetId: "tweet1",
    });

    const result = service.createLike({
      userId: "user1",
      tweetId: "tweet1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Você já curtiu este tweet");
  });

  test("Deveria lançar exceção se o tweet não for encontrado", async () => {
    prismaMock.tweet.findUnique.mockResolvedValue(null);
    const result = service.createLike({
      userId: "user1",
      tweetId: "tweet1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Tweet não encontrado");
  });
});

describe("LikeService - deleteLike", () => {
  const service = new LikeService();

  test("Deveria deletar o like com sucesso", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    const mockLike = {
      id: "like1",
      userId: "user1",
      tweetId: "tweet1",
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.like.findFirst.mockResolvedValue(mockLike);

    prismaMock.like.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.deleteLike({
      userId: "user1",
      tweetId: "tweet1",
    });

    expect(result).toBeUndefined();
  });

  test("Deveria lançar exceção se o like não for encontrado", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.like.findFirst.mockResolvedValue(null);

    const result = service.deleteLike({
      userId: "user1",
      tweetId: "tweet1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Like não encontrado");
  });

  test("Deveria lançar exceção se o tweet não for encontrado", async () => {
    prismaMock.tweet.findUnique.mockResolvedValue(null);

    const result = service.deleteLike({
      userId: "user1",
      tweetId: "tweet1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Tweet não encontrado");
  });
});
