import { Router } from "express";
import { TweetsController } from "../controllers/tweets.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from "../middlewares/common/valid-uuid-params.middleware";
import { CreateTweetMiddleware } from "../middlewares/tweets/create.tweets.middleware";
import { UpdateTweetsMiddleware } from "../middlewares/tweets/update.tweets.middlewares";

export class TweetsRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/",
      [AuthMiddleware.validate, CreateTweetMiddleware.validate],
      TweetsController.create
    );

    router.get("/", [AuthMiddleware.validate], TweetsController.list);

    router.put(
      "/:id",
      [
        AuthMiddleware.validate,
        ValidUuidParamsMiddleware.validate,
        UpdateTweetsMiddleware.validate,
      ],
      TweetsController.update
    );

    router.delete(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      TweetsController.delete
    );

    return router;
  }
}
