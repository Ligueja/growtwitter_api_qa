import cors from "cors";
import express from "express";
import { makeRoutes } from "../routes";

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // definição das rotas
  makeRoutes(app);

  return app;
}
