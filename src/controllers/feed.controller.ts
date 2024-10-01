import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";
import { onError } from "../utils/on-error.util";

export class FeedController {
  public static async list(request: Request, response: Response) {
    try {
      const userId = request.body.userId;
      const username = request.body.username;

      const feed = await FeedService.getFeed(userId);

      return response.status(200).json({
        ok: true,
        message: `Abaixo o feed de @${username}:`,
        data: feed,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
}
