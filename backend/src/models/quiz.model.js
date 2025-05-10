import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    accessCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },

    questionIds: [
      {
        type: Schema.ObjectId,
        ref: "Question",
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    isAlwaysAvailable: {
      type: Boolean,
      default: false,
    },

    availableFrom: {
      type: Date,
    },

    availableTo: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
