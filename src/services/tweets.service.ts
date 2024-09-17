import { Tweet } from "@prisma/client";
import {
  CreateTweetDTO,
  DeleteTweetInputDTO,
  ListTweetsInputDTO,
  UpdateTweetInputDTO,
} from "../dtos";
import { prismaConnection } from "../database/prisma.connection";
import { HttpError } from "../erros/http.error";

export class TweetService {
  public async createTweet(input: CreateTweetDTO): Promise<Tweet> {
    // Criação direta do tweet usando o userId e o content
    const newTweet = await prismaConnection.tweet.create({
      data: {
        content: input.content,
        userId: input.userId, // Usando o userId diretamente
      },
    });

    return newTweet;
  }

  public async listTweets(input: ListTweetsInputDTO): Promise<any> {
    const tweets = await prismaConnection.tweet.findMany({
      where: {
        userId: input.userId,
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
      },
    });
    return tweets;
  }

  public async updateTweet(input: UpdateTweetInputDTO): Promise<Tweet> {
    const tweetFound = await this.getTweetById(input.id);

    if (tweetFound.userId !== input.userId) {
      throw new HttpError(
        "Você não tem permissão para atualizar este tweet",
        403
      ); // Erro 403: Proibido
    }

    const tweetUpdated = await prismaConnection.tweet.update({
      where: {
        id: tweetFound.id,
      },
      data: {
        content: input.content,
      },
    });

    return tweetUpdated;
  }

  public async deleteTweet(input: DeleteTweetInputDTO): Promise<void> {
    const tweetFound = await this.getTweetById(input.id);

    if (tweetFound.userId !== input.userId) {
      throw new HttpError(
        "Você não tem permissão para deletar este tweet",
        403
      );
    }

    await prismaConnection.tweet.delete({ where: { id: tweetFound.id } });
  }

  public async getTweetById(id: string): Promise<Tweet> {
    const tweetFound = await prismaConnection.tweet.findUnique({
      where: {
        id: id,
      },
    });

    if (!tweetFound) {
      throw new HttpError("Tweet não encontrado", 404);
    }

    return tweetFound;
  }
}
