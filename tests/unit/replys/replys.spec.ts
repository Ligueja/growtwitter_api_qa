import { ReplyService } from "../../../src/services/replys.service";
import { prismaMock } from "../../config/prisma.mock";
import { HttpError } from "../../../src/erros/http.error";
import { TweetType } from "@prisma/client";

describe("ReplyService - createReply", () => {
  const service = new ReplyService();

  test("Deveria criar uma nova reply com sucesso", async () => {
    const newReplyData = {
      id: "reply1",
      userId: "user1",
      content: "Test reply",
      type: TweetType.REPLY,
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
    prismaMock.tweet.create.mockResolvedValue(newReplyData);

    const result = await service.createReply({
      tweetOriginalId: "tweet1",
      content: "Test reply",
      userId: "user1",
    });

    expect(result).toMatchObject(newReplyData);
  });

  test("Deveria lançar exceção se o tweet original não for encontrado", async () => {
    prismaMock.tweet.findUnique.mockResolvedValue(null);

    const result = service.createReply({
      tweetOriginalId: "tweet1",
      content: "Test reply",
      userId: "user1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("O Tweet não foi localizado");
  });
});

describe("ReplyService - deleteReply", () => {
  const service = new ReplyService();

  test("Deveria deletar a reply com sucesso", async () => {
    const mockTweet = {
      id: "reply1",
      userId: "user1",
      content: "Test reply",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.REPLY,
    };

    const mockReply = {
      id: "reply1",
      tweetReplyId: "reply1",
      tweetOriginalId: "tweet1",
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.reply.findFirst.mockResolvedValue(mockReply);

    prismaMock.reply.delete.mockResolvedValue(mockReply);
    prismaMock.tweet.delete.mockResolvedValue(mockTweet);

    const result = await service.deleteReply({
      tweetId: "reply1",
      userId: "user1",
    });

    expect(result).toMatchObject(mockTweet);
  });

  test("Deveria lançar exceção se a reply não for encontrada", async () => {
    const mockTweet = {
      id: "tweet1",
      content: "Test tweet",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TweetType.TWEET,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(mockTweet);
    prismaMock.reply.findFirst.mockResolvedValue(null);

    const result = service.deleteReply({
      tweetId: "reply1",
      userId: "user1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Reply não encontrado");
  });

  test("Deveria lançar exceção se o tweet original não for encontrado", async () => {
    prismaMock.tweet.findUnique.mockResolvedValue(null);

    const result = service.deleteReply({
      tweetId: "reply1",
      userId: "user1",
    });

    await expect(result).rejects.toThrow(HttpError);
    await expect(result).rejects.toThrow("Reply não encontrado");
  });
});
