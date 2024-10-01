import prismaConnection from "../database/prisma.connection";
import { HttpError } from "../erros/http.error";

export class FollowersService {
  public async toggleFollow(
    userId: string, // ID de quem está logado (Homer)
    user: string // ID de quem será seguido/deixado de seguir (Lisa)
  ): Promise<{ ok: boolean; status: number; message: string }> {
    if (userId === user) {
      throw new HttpError("Você não pode seguir a si mesmo", 400);
    }

    // Buscar o usuário alvo (Lisa)
    const targetUser = await prismaConnection.user.findUnique({
      where: {
        id: user,
        deleted: false,
      },
    });

    if (!targetUser) {
      throw new HttpError("Usuário não localizado", 404);
    }

    // Buscar o seguidor (Homer)
    const followerUser = await prismaConnection.user.findUnique({
      where: {
        id: userId,
        deleted: false,
      },
    });

    if (!followerUser) {
      throw new HttpError("Usuário seguidor não localizado", 404);
    }

    // Verificar se Homer já segue Lisa
    const followFound = await prismaConnection.follower.findFirst({
      where: {
        followerId: userId,
        userId: user,
      },
    });

    let actionMessage;
    if (followFound) {
      // Deixar de seguir
      await prismaConnection.follower.delete({
        where: { id: followFound.id },
      });
      actionMessage = `@${followerUser.username} deixou de seguir @${targetUser.username}`;
    } else {
      // Começar a seguir
      await prismaConnection.follower.create({
        data: {
          followerId: userId, // Homer
          userId: user, // Lisa
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

// import prismaConnection from "../database/prisma.connection";
// import { HttpError } from "../erros/http.error";

// export class FollowersService {
//   public async toggleFollow(
//     userId: string,
//     user: string
//   ): Promise<"follow" | "unfollow"> {
//     if (userId === user) {
//       throw new HttpError("Você não pode seguir a si mesmo", 400);
//     }

//     const userFound = await prismaConnection.user.findUnique({
//       where: {
//         id: user,
//         deleted: false,
//       },
//     });

//     if (!userFound) {
//       throw new HttpError("Usuário não localizado", 404);
//     }

//     const followFound = await prismaConnection.follower.findFirst({
//       where: {
//         followerId: userId,
//         userId: user,
//       },
//     });

//     if (followFound) {
//       await prismaConnection.follower.delete({
//         where: { id: followFound.id },
//       });
//       return "unfollow";
//     } else {
//       await prismaConnection.follower.create({
//         data: {
//           followerId: userId,
//           userId: user,
//         },
//       });
//       return "follow";
//     }
//   }
// }
