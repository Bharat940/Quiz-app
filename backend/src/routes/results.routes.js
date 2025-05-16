import { Router } from "express";
import {
  submitQuiz,
  getLeaderboard,
  getStudentResults,
} from "../controllers/result.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = Router();

router.route("/submit").post(verifyJwt, authorizeRoles("student"), submitQuiz);
router
  .route("/leaderboard/:quizId")
  .get(verifyJwt, authorizeRoles("teacher"), getLeaderboard);
router
  .route("/student")
  .get(verifyJwt, authorizeRoles("student"), getStudentResults); // New route
export default router;
