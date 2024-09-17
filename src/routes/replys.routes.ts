import { Router } from "express";
import { ReplyController } from "../controllers/replys.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from "../middlewares/common/valid-uuid-params.middleware";

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      ReplyController.create
    );
    router.get(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      ReplyController.get
    );
    router.delete(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      ReplyController.delete
    );

    return router;
  }
}

// import { Router } from "express";
// import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
// import { ReplysController } from "../controllers/replys.controller";

// export class replyRoutes {
//   public static execute(): Router {
//     const router = Router();

//     router.post(
//       "/:tweetId",
//       [AuthMiddleware.validate],
//       ReplysController.create
//     );
//     router.get("/", [AuthMiddleware.validate], ReplysController.list);

//     router.delete(
//       "/:replyId",
//       [AuthMiddleware.validate],
//       ReplysController.delete
//     );

//     return router;
//   }
// }
