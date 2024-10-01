import { Router } from "express";
import { ReplyController } from "../controllers/replys.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { CreateReplyMiddleware } from "../middlewares/reply/create-reply.middleware";
import { ValidUuidParamsMiddleware } from "../middlewares/common/valid-uuid-params.middleware";

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/",
      [AuthMiddleware.validate, CreateReplyMiddleware.validate],
      ReplyController.create
    );

    router.delete(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      ReplyController.delete
    );

    return router;
  }
}
