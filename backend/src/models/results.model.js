import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    quizId: {
      type: Schema.ObjectId,
      ref: "Quiz",
      required: true,
    },
    studentId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: {
          type: Schema.ObjectId,
          ref: "Question",
          required: true,
        },
        givenAnswer: {
          type: String,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    timeTaken: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["completed", "pending", "in-progress"],
      default: "pending",
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);
