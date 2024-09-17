import { Request, Response } from "express";
import { ReplyService } from "../services/replys.service";
import { onError } from "../utils/on-error.util";

export class ReplyController {
  public static async create(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { userId, content } = req.body;

      const service = new ReplyService();

      const createTweetReply = await service.createReply({
        content,
        tweetId,
        userId,
      });

      return res.status(201).json({
        ok: true,
        message: "Reply criado com sucesso",
        createTweetReply,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async get(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { userId } = req.body;

      const service = new ReplyService();
      const replyFound = await service.getReplyById({
        tweetId,
        userId,
      });

      return res.status(200).json({
        ok: true,
        message: "Reply listado abaixo",
        reply: replyFound,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const tweetId = req.params.id;
      const { userId } = req.body;

      const service = new ReplyService();
      const replyDeleted = await service.deleteReply({ tweetId, userId });

      return res.status(200).json({
        ok: true,
        message: "Reply deletado com sucesso",
        replyDeleted,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
