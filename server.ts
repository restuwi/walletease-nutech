import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./src/routes";
import db from "./src/db";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.listen(port, async () => {
  try {
    await db.$connect();
    console.log(`[server]: Server is running at http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  }
});
