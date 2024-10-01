import { Router } from "express";
import { LikesController } from "../controllers/likes.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from "../middlewares/common/valid-uuid-params.middleware";

export class LikeRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      LikesController.create
    );
    router.delete(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      LikesController.delete
    );

    return router;
  }
}
