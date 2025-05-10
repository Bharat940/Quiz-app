import { Router } from "express";
import {
  createQuiz,
  getQuizByAccessCode,
  getTeacherQuizzes,
  deleteQuiz,
} from "../controllers/quiz.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = Router();

router.route("/").post(verifyJwt, authorizeRoles("teacher"), createQuiz);
router
  .route("/teacher")
  .get(verifyJwt, authorizeRoles("teacher"), getTeacherQuizzes);
router.route("/:id").delete(verifyJwt, authorizeRoles("teacher"), deleteQuiz);
router.route("/code/:code").get(verifyJwt, getQuizByAccessCode);

export default router;
