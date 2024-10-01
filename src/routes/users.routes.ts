import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { ValidUuidParamsMiddleware } from "../middlewares/common/valid-uuid-params.middleware";
import { CreateUsersMiddleware } from "../middlewares/users/create.users.middleware";
import { UpdateUsersMiddleware } from "../middlewares/users/update.users.middleware";

export class UsersRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/", [CreateUsersMiddleware.validate], UsersController.create);

    router.get("/", UsersController.list);

    router.put(
      "/:id",
      [ValidUuidParamsMiddleware.validate, UpdateUsersMiddleware.validate],
      UsersController.update
    );

    router.delete(
      "/:id",
      [ValidUuidParamsMiddleware.validate],
      UsersController.delete
    );

    return router;
  }
}
