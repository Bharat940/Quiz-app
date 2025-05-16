import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Result } from "../models/results.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId, answers, timeTaken } = req.body;

  if (!quizId || !answers || !Array.isArray(answers)) {
    throw new ApiError(400, "Quiz ID, answers, and Time taken is required");
  }

  const quiz = await Quiz.findById(quizId).populate("questionIds");
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const now = new Date();
  if (!quiz.isAlwaysAvailable) {
    if (!quiz.availableFrom || !quiz.availableTo) {
      throw new ApiError(500, "Quiz  scheduling date is incomplete");
    }

    if (now < quiz.availableFrom || now > quiz.availableTo) {
      throw new ApiError(403, "Quiz is not available at this time");
    }
  }

  if (timeTaken > quiz.duration) {
    throw new ApiError(
      400,
      `Quiz duration exceeded. Allowed: ${quiz.duration} min`
    );
  }

  // const questionMap = {};
  // quiz.questionIds.forEach((q) => {
  //   questionMap[q._id.toString()] = q.correctAnswerIndex;
  // });

  // let correctCount = 0;
  // answers.forEach(({ questionId, givenAnswer }) => {
  //   const correctAnswer = questionMap[questionId];
  //   if (correctAnswer !== undefined && givenAnswer === correctAnswer) {
  //     correctCount++;
  //   }
  // });

  let correctCount = 0;
  for (let i = 0; i < answers.length; i++) {
    const userAnswer = answers[i];
    const question = quiz.questionIds.find(
      (q) => q._id.toString() === userAnswer.questionId
    );
    if (question) {
      const correctAnswerIndex = question.correctAnswerIndex;
      const givenAnswerIndex = parseInt(userAnswer.givenAnswer);

      if (
        correctAnswerIndex !== undefined &&
        givenAnswerIndex === correctAnswerIndex
      ) {
        correctCount++;
      }
    }
  }
  const totalQuestions = quiz.questionIds.length;

  const result = await Result.create({
    quizId,
    studentId: req.user._id,
    email: req.user.email,
    fullName: req.user.fullName,
    answers,
    score: correctCount,
    totalQuestions,
    timeTaken,
    status: "completed",
    completedAt: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Quiz submitted successfully"));
});

const getStudentResults = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const results = await Result.find({ studentId })
    .populate("quizId", "title")
    .sort({ completedAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        results,
        "Student's quiz results fetched successfully"
      )
    );
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    throw new ApiError(404, "Quiz Id is required");
  }

  const leaderboard = await Result.find({
    quizId,
    status: "completed",
  })
    .populate("studentId", "name email")
    .sort({ score: -1, timeTaken: 1 })
    .select("fullName email score timeTaken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, leaderboard, "Leaderboard fetched successfully")
    );
});

export { submitQuiz, getLeaderboard, getStudentResults };
