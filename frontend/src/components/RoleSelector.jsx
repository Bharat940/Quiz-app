import React from "react";
import { UserRound } from "lucide-react";

const RoleSelector = ({ selectedRole, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full my-6">
      <button
        type="button"
        onClick={() => {
          onChange("teacher");
        }}
        className={` cursor-pointer flex flex-col flex-1 items-center justify-center p-6 rounded-lg border-2 transition-all duration-300  ${
          selectedRole === "teacher"
            ? "border-amber-500 bg-amber-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <div
          className={`p-3 rounded-full mb-3 ${
            selectedRole === "teacher"
              ? "bg-amber-100 text-amber-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <UserRound size={24} />
        </div>

        <h3 className="text-lg font-medium">Teacher</h3>
        <p className="text-sm text-gray-500 text-center mt-2">
          Create and manage quizzes for students
        </p>
      </button>

      <button
        type="button"
        onClick={() => {
          onChange("student");
        }}
        className={` cursor-pointer flex flex-col flex-1 items-center justify-center p-6 rounded-lg border-2 transition-all duration-300  ${
          selectedRole === "student"
            ? "border-sky-500 bg-sky-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <div
          className={`p-3 rounded-full mb-3 ${
            selectedRole === "student"
              ? "bg-sky-100 text-sky-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <UserRound size={24} />
        </div>

        <h3 className="text-lg font-medium">Student</h3>
        <p className="text-sm text-gray-500 text-center mt-2">
          Participate in quizzes
        </p>
      </button>
    </div>
  );
};

export default RoleSelector;
