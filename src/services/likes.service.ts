import { Like, Tweet } from "@prisma/client";
import prismaConnection from "../database/prisma.connection";
import { HttpError } from "../erros/http.error";
import { CreateLikeDTO } from "../dtos";

export class LikeService {
  public async createLike(input: CreateLikeDTO): Promise<Like> {
    const tweetFound = await this.getTweetById(input.tweetId);

    await this.getLikeByUserAndTweet(input.userId, tweetFound.id);

    const newLike = await prismaConnection.like.create({
      data: {
        userId: input.userId,
        tweetId: tweetFound.id,
      },
    });

    return newLike;
  }

  public async deleteLike(input: {
    userId: string;
    tweetId: string;
  }): Promise<void> {
    const tweetFound = await this.getTweetById(input.tweetId);

    await this.checkIfLikeExists(input.userId, tweetFound.id);

    await prismaConnection.like.deleteMany({
      where: {
        tweetId: tweetFound.id,
        userId: input.userId,
      },
    });
  }

  public async getTweetById(tweetId: string): Promise<Tweet> {
    const tweetFound = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetId,
      },
    });

    if (!tweetFound) {
      throw new HttpError("Tweet não encontrado", 404);
    }

    return tweetFound;
  }

  public async getLikeByUserAndTweet(
    userId: string,
    tweetId: string
  ): Promise<void> {
    const likeFound = await prismaConnection.like.findFirst({
      where: {
        userId,
        tweetId,
      },
    });

    if (likeFound) {
      throw new HttpError("Você já curtiu este tweet", 400);
    }
  }

  public async checkIfLikeExists(
    userId: string,
    tweetId: string
  ): Promise<void> {
    const likeFound = await prismaConnection.like.findFirst({
      where: {
        userId,
        tweetId,
      },
    });

    if (!likeFound) {
      throw new HttpError("Like não encontrado", 404);
    }
  }
}
