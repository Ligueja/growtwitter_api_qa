import { Router } from "express";
import { TweetsController } from "../controllers/tweets.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';
import { CreateTweetMiddleware } from "../middlewares/tweets/create.tweets.middleware";
import { UpdateTweetsMiddleware } from "../middlewares/tweets/update.tweets.middlewares";

export class tweetsRoutes {
  public static execute(): Router {
    const router = Router();

    //rota para cadastro de um tweet, somente se estiver logado:
    router.post(
      "/",
      [AuthMiddleware.validate, CreateTweetMiddleware.validade],
      TweetsController.create
    );
    //rota para listar tweets:
    router.get("/", [AuthMiddleware.validate], TweetsController.list);
    //rota para exibir tweet específico através do ID:
    router.get("/:id", [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate], TweetsController.get);
    //rota para atualizar tweet específico através do ID, somwente se estiver logado:
    router.put(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate, UpdateTweetsMiddleware.validate],
      TweetsController.update
    );
    //rota para deletar tweet específico através do ID, somente se estiver logado:
    router.delete(
      "/:id",
      [AuthMiddleware.validate, ValidUuidParamsMiddleware.validate],
      TweetsController.delete
    );

    return router;
  }
}
