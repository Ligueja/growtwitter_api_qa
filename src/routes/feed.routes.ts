import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { FeedController } from "../controllers/feed.controller";

export class FeedRoutes {
  public static execute(): Router {
    const router = Router();

    router.get("/", [AuthMiddleware.validate], FeedController.list);

    return router;
  }
}
