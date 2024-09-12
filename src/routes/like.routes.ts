import { Router } from "express";
import { LikesController } from "../controllers/likes.controller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';

export class likeRoutes {
  public static execute(): Router {
    const router = Router();

    //definicação de rotas:
    // ambas as rotas são privadas e necessitam autenticação (token)
    //rota para criar um like e rota para deletar um like
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
