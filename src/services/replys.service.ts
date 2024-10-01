import { Tweet, TweetType } from "@prisma/client";
import prismaConnection from "../database/prisma.connection";
import { CreateReply, GetReplyById } from "../dtos";
import { HttpError } from "../erros/http.error";

export class ReplyService {
  public async createReply(input: CreateReply): Promise<Tweet> {
    const tweetFound = await prismaConnection.tweet.findUnique({
      where: {
        id: input.tweetOriginalId,
        type: "TWEET",
      },
    });

    if (!tweetFound) {
      throw new HttpError("O Tweet não foi localizado", 404);
    }

    const tweetReplyCreate = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
        type: TweetType.REPLY,
      },
    });

    await prismaConnection.reply.create({
      data: {
        tweetOriginalId: input.tweetOriginalId,
        tweetReplyId: tweetReplyCreate.id,
      },
    });

    return tweetReplyCreate;
  }

  public async deleteReply(input: GetReplyById): Promise<Tweet> {
    const replyFound = await prismaConnection.reply.findFirst({
      where: { tweetReplyId: input.tweetId },
    });

    if (!replyFound) {
      throw new HttpError("Reply não encontrado", 404);
    }

    await prismaConnection.reply.delete({
      where: {
        id: replyFound.id,
      },
    });

    const replyDeleted = await prismaConnection.tweet.delete({
      where: {
        id: input.tweetId,
        AND: { type: "REPLY", userId: input.userId },
      },
    });

    return replyDeleted;
  }
}
