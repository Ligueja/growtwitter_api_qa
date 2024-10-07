import prismaConnection from "../database/prisma.connection";
import { HttpError } from "../erros/http.error";

export class FollowersService {
  public async toggleFollow(
    userId: string,
    user: string
  ): Promise<{ ok: boolean; status: number; message: string }> {
    if (userId === user) {
      throw new HttpError("Você não pode seguir a si mesmo", 400);
    }

    const targetUser = await prismaConnection.user.findUnique({
      where: {
        id: user,
        deleted: false,
      },
    });

    if (!targetUser) {
      throw new HttpError("Usuário não localizado", 404);
    }

    const followerUser = await prismaConnection.user.findUnique({
      where: {
        id: userId,
        deleted: false,
      },
    });

    if (!followerUser) {
      throw new HttpError("Usuário não localizado", 404);
    }

    const followFound = await prismaConnection.follower.findFirst({
      where: {
        followerId: userId,
        userId: user,
      },
    });

    let actionMessage;
    if (followFound) {
      await prismaConnection.follower.delete({
        where: { id: followFound.id },
      });
      actionMessage = `@${followerUser.username} deixou de seguir @${targetUser.username}`;
    } else {
      await prismaConnection.follower.create({
        data: {
          followerId: userId,
          userId: user,
        },
      });
      actionMessage = `@${followerUser.username} começou a seguir @${targetUser.username}`;
    }

    return {
      ok: true,
      status: 201,
      message: actionMessage,
    };
  }
}
