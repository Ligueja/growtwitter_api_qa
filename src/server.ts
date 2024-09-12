import cors from "cors";
import "dotenv/config";
import express from "express";
import { authRoutes } from "./routes/auth.routes";
import { feedRoutes } from "./routes/feed.routes";
import { likeRoutes } from "./routes/like.routes";
import { replyRoutes } from "./routes/replys.routes";
import { tweetsRoutes } from "./routes/tweets.routes";
import { UsersRoutes } from "./routes/users.routes";

const app = express();
app.use(express.json());
app.use(cors());

// definição das rotas:
app.use("/users", UsersRoutes.execute());
app.use("/auth", authRoutes.execute());
app.use("/tweets", tweetsRoutes.execute());
app.use("/likes", likeRoutes.execute());
app.use("/replys", replyRoutes.execute());
app.use("/feed", feedRoutes.execute());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
