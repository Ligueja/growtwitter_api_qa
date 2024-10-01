import { Request, Response } from "express";
import { onError } from "../utils/on-error.util";
import { ReplyService } from "../services/replys.service";

export class ReplyController {
  public static async create(request: Request, response: Response) {
    try {
      const { content, tweetOriginalId } = request.body;

      const userId = request.body.userId;

      const service = new ReplyService();

      const tweetReplyCreate = await service.createReply({
        tweetOriginalId,
        content,
        userId,
      });

      return response.status(201).json({
        ok: true,
        message: "Reply cadastrado com sucesso",
        tweetReplyCreate,
      });
    } catch (err) {
      return onError(err, response);
    }
  }

  public static async delete(request: Request, response: Response) {
    try {
      const tweetId = request.params.id;
      const userId = request.body.userId;

      const service = new ReplyService();
      const replyDeleted = await service.deleteReply({ tweetId, userId });

      return response.status(200).json({
        ok: true,
        message: "Reply deletado com sucesso",
        replyDeleted,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
}
