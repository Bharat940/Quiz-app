import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://quiz-app-six-rust-67.vercel.app/",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./src/routes/auth.routes.js";
import quizRouter from "./src/routes/quiz.routes.js";
import resultRouter from "./src/routes/results.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/result", resultRouter);

export { app };
