import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class TweetsController {
  public static async create(request: Request, response: Response) {
    try {
      const { content, userId } = request.body;

      // criação do tweet
      const newTweet = await prismaConnection.tweet.create({
        data: {
          content,
          userId,
        },
      });

      return response.status(201).json({
        ok: true,
        message: "Tweet cadastrado com sucesso",
        newTweet,
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

  public static async list(request: Request, response: Response) {
    try {
      const { userId } = request.body;

      const tweets = await prismaConnection.tweet.findMany({
        where: {
          type: "TWEET",
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              username: true,
              name: true,
            },
          },
          Like: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      return response.status(200).json({
        ok: true,
        message: "Abaixo lista de tweets postados:",
        tweets: tweets,
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

  public static async get(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { userId } = request.body;

      // o tweet deve existir pelo id informado e ser do usuário logado
      const tweetFound = await prismaConnection.tweet.findUnique({
        where: {
          id,
          userId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          Like: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!tweetFound) {
        return response.status(404).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      return response.status(200).json({
        ok: true,
        message: "Tweet encontrado",
        tweet: tweetFound,
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

  public static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { content, userId } = request.body;

      // verificar se o tweet existe e se o mesmo pertence ao usuário autenticado(logado)
      const tweetFound = await prismaConnection.tweet.findUnique({
        where: {
          id,
          userId,
        },
      });

      if (!tweetFound) {
        return response.status(404).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      // logica para atualizar o tweet:
      const tweetUpdated = await prismaConnection.tweet.update({
        where: {
          id: tweetFound.id,
        },
        data: {
          content: content,
        },
      });

      return response.status(200).json({
        ok: true,
        message: "Tweet atualizado com sucesso",
        tweetUpdated,
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

      // Verificar se o tweet existe e se pertence ao usuário autenticado/logado:
      const tweetFound = await prismaConnection.tweet.findUnique({
        where: { id, userId },
      });

      if (!tweetFound) {
        return response.status(404).json({
          ok: false,
          message: "Tweet não encontrado",
        });
      }

      // lógica para deletar o tweet:
      await prismaConnection.tweet.delete({
        where: { id: tweetFound.id },
      });

      return response.status(200).json({
        ok: true,
        message: "Tweet deletado com sucesso",
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }
}
