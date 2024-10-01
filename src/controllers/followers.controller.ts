import { Request, Response } from "express";
import { onError } from "../utils/on-error.util";
import { FollowersService } from "../services/followers.service";

export class FollowersController {
  public static async toggle(request: Request, response: Response) {
    try {
      const { userId, username, user } = request.body;

      const service = new FollowersService();
      const result = await service.toggleFollow(userId, user);

      return response.status(result.status).json({
        ok: result.ok,
        message: result.message,
      });
    } catch (err) {
      return onError(err, response);
    }
  }
}
