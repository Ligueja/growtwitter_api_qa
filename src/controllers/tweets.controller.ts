import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { TweetService } from "../services/tweets.service";
import { onError } from "../utils/on-error.util";

export class TweetsController {
  public static async create(request: Request, response: Response) {
    try {
      const { content } = request.body;

      const userId = request.body.userId;

      // const id = userId.id;

      const service = new TweetService();

      const newTweet = await service.createTweet({
        content,
        userId,
      });

      return response.status(201).json({
        ok: true,
        message: "Tweet cadastrado com sucesso",
        newTweet,
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async list(request: Request, response: Response) {
    try {
      const userId = request.body.userId;

      const service = new TweetService();

      const tweets = await service.listTweets({ userId });

      return response.status(200).json({
        ok: true,
        message: "Abaixo os tweets postados:",
        tweets: tweets,
      });
    } catch (err) {
      return onError(err, response);
    }
  }

  public static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { content } = request.body;
      const userId = request.body.userId;

      const service = new TweetService();

      const tweetUpdated = await service.updateTweet({
        id,
        content,
        userId,
      });

      return response.status(200).json({
        ok: true,
        message: "Tweet atualizado com sucesso",
        tweetUpdated,
      });
    } catch (err) {
      onError(err, response);
    }
  }

  public static async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.body.userId;

      const service = new TweetService();

      const tweetDeleted = await service.deleteTweet({
        id,
        userId,
      });

      return response.status(200).json({
        ok: true,
        message: "Tweet deletado com sucesso",
        tweetDeleted,
      });
    } catch (err) {
      onError(err, response);
    }
  }
}
