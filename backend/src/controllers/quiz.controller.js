import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import { Result } from "../models/results.model.js";

const generateAccessCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

const generateUniqueAccessCode = async () => {
  let code, exists;

  do {
    code = generateAccessCode();
    exists = await Quiz.exists({ accessCode: code });
  } while (exists);
  return code;
};

const createQuiz = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    questions,
    duration,
    isAlwaysAvailable,
    availableFrom,
    availableTo,
  } = req.body;

  if (
    !title ||
    !Array.isArray(questions) ||
    questions.length === 0 ||
    !duration
  ) {
    throw new ApiError(
      400,
      "Title and at least one question and duration are required"
    );
  }

  if (!isAlwaysAvailable) {
    if (!availableFrom || !availableTo) {
      throw new ApiError(
        400,
        "availableFrom and availableTo are required if quiz is not always available"
      );
    }

    if (new Date(availableFrom) >= new Date(availableTo)) {
      throw new ApiError(400, "availableFrom must be before availableTo");
    }
  }

  const createdQuestions = await Question.insertMany(
    questions.map((q) => ({
      ...q,
      createdBy: req.user._id,
    }))
  );

  const questionIds = createdQuestions.map((q) => q._id);

  const accessCode = await generateUniqueAccessCode();

  const quiz = await Quiz.create({
    title,
    description,
    duration,
    questionIds: questionIds,
    createdBy: req.user._id,
    accessCode,
    isAlwaysAvailable: isAlwaysAvailable || false,
    availableFrom: isAlwaysAvailable ? null : new Date(availableFrom),
    availableTo: isAlwaysAvailable ? null : new Date(availableTo),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, quiz, "Quiz created successfully"));
});

const getQuizByAccessCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const quiz = await Quiz.findOne({ accessCode: code })
    .populate("questionIds")
    .select("-createdBy");

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});

const getTeacherQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ createdBy: req.user._id }).populate(
    "questionIds"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not aauthorized to delete this quiz");
  }

  await Question.deleteMany({ _id: quiz.questionIds });
  await quiz.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Quiz deleted Successfully"));
});

export { createQuiz, getQuizByAccessCode, getTeacherQuizzes, deleteQuiz };
