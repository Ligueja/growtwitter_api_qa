import "dotenv/config";
import { createServer } from "./server/express.server";

const app = createServer();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
