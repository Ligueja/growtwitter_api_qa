import prismaConnection from "../database/prisma.connection";

export class FeedService {
  public static async getFeed(userId: string) {
    const following = await prismaConnection.follower.findMany({
      where: {
        followerId: userId,
      },
    });

    const usersIds = following.map((f) => f.userId);
    usersIds.push(userId);

    const feed = await prismaConnection.tweet.findMany({
      where: {
        userId: {
          in: usersIds,
        },
        type: "TWEET",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
        Like: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        reply: {
          select: {
            reply: {
              select: {
                id: true,
                content: true,
                type: true,
                user: {
                  select: {
                    username: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return feed;
  }
}
