import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";
import { LikeService } from "../services/likes.service";
import { onError } from "../utils/on-error.util";

export class LikesController {
  public static async create(request: Request, response: Response) {
    try {
      const { userId } = request.body;
      const { id: tweetId } = request.params;

      const service = new LikeService();

      const newLike = await service.createLike({
        userId,
        tweetId,
      });

      return response.status(201).json({
        ok: true,
        message: "Like criado com sucesso",
        newLike,
      });
    } catch (err) {
      return onError(err, response);
    }
  }

  public static async delete(request: Request, response: Response) {
    try {
      const { userId } = request.body;
      const { id: tweetId } = request.params;

      const service = new LikeService();

      const deletedLike = await service.deleteLike({ userId, tweetId });

      return response.status(200).json({
        ok: true,
        message: "Like deletado com sucesso",
        deletedLike,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
}
