import express from "express";
import cors from "cors";
import { env } from "./libs/env.js";
import taskRouter from "./routes/tasks";
import { authenticate } from "./libs/auth";

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  const token = req.headers["x-nooro-token"];

  if (token && typeof token === "string" && authenticate(token)) {
    return next();
  }

  return res.status(401);
});

app.use("/task", taskRouter);

app.listen(PORT, () => {
  console.log(`API OK on http://localhost:${PORT}`);
});
