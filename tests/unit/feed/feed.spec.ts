import { FeedService } from "../../../src/services/feed.service";
import { prismaMock } from "../../config/prisma.mock";

describe("FeedService - getFeed", () => {
  const service = new FeedService();

  test("Deveria retornar o feed com tweets dos usuários seguidos", async () => {
    prismaMock.follower.findMany.mockResolvedValueOnce([
      { id: "follower1", followerId: "user1", userId: "user2" },
      { id: "follower2", followerId: "user1", userId: "user3" },
    ]);

    prismaMock.tweet.findMany.mockResolvedValueOnce([
      {
        id: "tweet1",
        content: "Tweet de user2",
        userId: "user2",
        createdAt: new Date(),
        type: "TWEET",
        user: {
          username: "user2",
          name: "User Two",
        },
        Like: [],
        reply: [],
      } as any,
      {
        id: "tweet2",
        content: "Tweet de user3",
        userId: "user3",
        createdAt: new Date(),
        type: "TWEET",
        user: {
          username: "user3",
          name: "User Three",
        },
        Like: [],
        reply: [],
      } as any,
    ]);

    const result = await FeedService.getFeed("user1");

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "tweet1",
      content: "Tweet de user2",
      user: { username: "user2", name: "User Two" },
    });
    expect(result[1]).toMatchObject({
      id: "tweet2",
      content: "Tweet de user3",
      user: { username: "user3", name: "User Three" },
    });
  });

  test("Deveria retornar o feed com os tweets do próprio usuário", async () => {
    prismaMock.follower.findMany.mockResolvedValueOnce([]);

    prismaMock.tweet.findMany.mockResolvedValueOnce([
      {
        id: "tweet1",
        content: "Meu próprio tweet",
        userId: "user1",
        createdAt: new Date(),
        type: "TWEET",
        user: {
          username: "user1",
          name: "User One",
        },
        Like: [],
        reply: [],
      } as any,
    ]);

    const result = await FeedService.getFeed("user1");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "tweet1",
      content: "Meu próprio tweet",
      user: { username: "user1", name: "User One" },
    });
  });
});
