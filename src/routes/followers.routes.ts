import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ToggleFollowUpMiddleware } from "../middlewares/followers/follow-Up.Middleware";
import { FollowersController } from "../controllers/followers.controller";

export class FollowersRoutes {
  public static execute() {
    const router = Router();

    router.post(
      "/",
      [AuthMiddleware.validate, ToggleFollowUpMiddleware.validate],
      FollowersController.toggle
    );

    return router;
  }
}
