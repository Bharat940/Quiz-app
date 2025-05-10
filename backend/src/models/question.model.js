import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
