import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class LikesController {
  public static async create(request: Request, response: Response) {
    try {
      const { userId } = request.body;
      const { id } = request.params;

      // tweet existe
      // verificar se o tweet referente ao id informado existe:
      const tweetFound = await prismaConnection.tweet.findUnique({
        where: {
          id,
        },
      });

      if (!tweetFound) {
        return response.status(404).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      // o usuario não curtiu esse tweet
      // verificar se o usuário já curtiu o tweet, evitando esse usuário de curtir duas vezes o mesmo tweet:
      const likeFound = await prismaConnection.like.findFirst({
        where: {
          userId,
          tweetId: id,
        },
      });

      if (likeFound) {
        return response.status(400).json({
          ok: false,
          message: "Usuário já curtiu este tweet",
        });
      }

      // criação do like:
      const like = await prismaConnection.like.create({
        data: {
          userId,
          tweetId: id,
        },
      });

      return response.status(201).json({
        ok: true,
        message: "Like criado com sucesso",
        like,
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { userId } = request.body;

      // tweet existe
      // verificar se o tweet referente ao id informado existe:
      const tweetFound = await prismaConnection.tweet.findUnique({
        where: {
          id,
        },
      });

      if (!tweetFound) {
        return response.status(404).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      // Deletar o like
      await prismaConnection.like.deleteMany({
        where: {
          tweetId: tweetFound.id,
          userId,
        },
      });

      return response.status(200).json({
        ok: true,
        message: "Like deletado com sucesso",
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }
}
