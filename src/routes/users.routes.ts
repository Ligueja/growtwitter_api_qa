import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { ValidUuidParamsMiddleware } from '../middlewares/common/valid-uuid-params.middleware';
import { CreateUsersMiddleware } from "../middlewares/users/create.users.middleware";
import { UpdateUsersMiddleware } from "../middlewares/users/update.users.middleware";

export class UsersRoutes {
  public static execute(): Router {
    const router = Router();

    // definições de rotas para users:

    //rota para cadastro de usuário:
    router.post("/", [CreateUsersMiddleware.validate], UsersController.create);
    //rota para listar usuários cadastrados:
    router.get("/", UsersController.list);
    //rota para exibir usuário específico através do ID:
    router.get("/:id", [ValidUuidParamsMiddleware.validate], UsersController.get);
    //rota para atualizar usuário específico através do ID:
    router.put(
      "/:id",
      [ValidUuidParamsMiddleware.validate, UpdateUsersMiddleware.validate],
      UsersController.update
    );
    //rota para deletar usuário específico através do ID:
    router.delete("/:id", [ValidUuidParamsMiddleware.validate], UsersController.delete);

    return router;
  }
}
