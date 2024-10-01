import cors from "cors";
import "dotenv/config";
import express from "express";
import { AuthRoutes } from "./routes/auth.routes";
import { FeedRoutes } from "./routes/feed.routes";
import { LikeRoutes } from "./routes/like.routes";
import { ReplyRoutes } from "./routes/replys.routes";
import { TweetsRoutes } from "./routes/tweets.routes";
import { UsersRoutes } from "./routes/users.routes";
import { FollowersRoutes } from "./routes/followers.routes";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/docs", swaggerUI.serve);
app.get("/docs", swaggerUI.setup(swaggerDoc));

app.use("/users", UsersRoutes.execute());
app.use("/auth", AuthRoutes.execute());
app.use("/tweets", TweetsRoutes.execute());
app.use("/likes", LikeRoutes.execute());
app.use("/replys", ReplyRoutes.execute());
app.use("/feed", FeedRoutes.execute());
app.use("/followers", FollowersRoutes.execute());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
