import { TweetService } from "../../../src/services/tweets.service";
import { prismaMock } from "../../config/prisma.mock";
import { HttpError } from "../../../src/erros/http.error";
import { TweetType } from "@prisma/client";

describe("TweetService - createTweet", () => {
  const service = new TweetService();

  test("Deveria criar um novo tweet com sucesso", async () => {
    const newTweetData = {
      id: "tweet1",
      content: "This is a test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.create.mockResolvedValue(newTweetData);

    const result = await service.createTweet({
      content: "This is a test tweet",
      userId: "user1",
    });

    expect(result).toMatchObject(newTweetData);
  });
});

describe("TweetService - listTweets", () => {
  const service = new TweetService();

  test("Deveria retornar a lista de tweets com sucesso", async () => {
    const mockTweets = [
      {
        id: "tweet1",
        content: "First tweet",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        type: TweetType.TWEET,
        user: {
          username: "user1",
          name: "User One",
        },
        Like: [],
        reply: [],
      },
      {
        id: "tweet2",
        content: "Second tweet",
        userId: "user2",
        createdAt: new Date(),
        updatedAt: new Date(),
        type: TweetType.TWEET,
        user: {
          username: "user2",
          name: "User Two",
        },
        Like: [],
        reply: [],
      },
    ];

    prismaMock.tweet.findMany.mockResolvedValue(mockTweets);

    const result = await service.listTweets({ userId: "user1" });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("content", "First tweet");
  });
});

describe("TweetService - updateTweet", () => {
  const service = new TweetService();

  test("Deveria lançar exceção se o tweet não pertencer ao usuário", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user2",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);

    const result = service.updateTweet({
      id: "tweet1",
      content: "Updated tweet content",
      userId: "user1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow(
      "Você não tem permissão para atualizar este tweet"
    );
  });

  test("Deveria atualizar o tweet com sucesso", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);

    prismaMock.tweet.update.mockResolvedValue({
      ...mockTweet,
      content: "Updated tweet content",
    });

    const result = await service.updateTweet({
      id: "tweet1",
      content: "Updated tweet content",
      userId: "user1",
    });

    expect(result).toHaveProperty("content", "Updated tweet content");
  });
});

describe("TweetService - deleteTweet", () => {
  const service = new TweetService();

  test("Deveria lançar exceção se o tweet não for encontrado", async () => {
    prismaMock.tweet.findUnique.mockResolvedValue(null);

    const result = service.deleteTweet({ id: "tweet1", userId: "user1" });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Tweet não encontrado");
  });

  test("Deveria deletar o tweet com sucesso", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.tweet.delete.mockResolvedValue(mockTweet);

    const result = await service.deleteTweet({ id: "tweet1", userId: "user1" });

    expect(result).toBeUndefined();
  });
});
