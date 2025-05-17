import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../utils/QuizContext";
import NavigationBar from "../components/NavigationBar";
import Card, { CardContent, CardHeader, CardFooter } from "../components/Card";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MinusCircle, CheckCircle } from "lucide-react";

const MakeQuiz = () => {
  const navigate = useNavigate();
  const { createQuiz, loading, error } = useQuiz();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [isAlwaysAvailable, setIsAlwaysAvailable] = useState(true);
  const [availableFrom, setAvailableFrom] = useState(null);
  const [availableTo, setAvailableTo] = useState(null);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ]);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = "Quiz title is required.";
    }
    if (questions.every((q) => !q.questionText.trim())) {
      errors.questions = "At least one question is required.";
    } else {
      questions.forEach((q, index) => {
        if (!q.questionText.trim()) {
          errors[`questionText-${index}`] = "Question text is required.";
        }
        if (q.options.some((opt) => !opt.trim())) {
          errors[`options-${index}`] = `All options for question ${
            index + 1
          } are required.`;
        }
        if (q.correctAnswerIndex === null) {
          errors[
            `correctAnswer-${index}`
          ] = `Please select the correct answer for question ${index + 1}.`;
        }
      });
    }
    return errors;
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestion = [...questions];
      newQuestion.splice(index, 1);
      setQuestions(newQuestion);
    }
  };

  const handleQuestionTextChange = (index, value) => {
    const newQuestion = [...questions];
    newQuestion[index].questionText = value;
    setQuestions(newQuestion);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestion = [...questions];
    newQuestion[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestion);
  };

  const handleCorrectAnswerSelect = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswerIndex = optionIndex;
    setQuestions(newQuestions);
  };

  const handleAvailabilityChange = (e) => {
    setIsAlwaysAvailable(e.target.checked);
    if (e.target.checked) {
      setScheduledFor(null);
      setScheduledTo(null);
    }
  };

  const handleSubmitQuiz = async () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const quizData = {
      title,
      description,
      duration: parseInt(duration),
      isAlwaysAvailable,
      availableFrom: isAlwaysAvailable ? null : availableFrom?.toISOString(),
      availableTo: isAlwaysAvailable ? null : availableTo?.toISOString(),
      questions: questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
      })),
    };

    try {
      await createQuiz(quizData);
      navigate("/teacherDashboard");
    } catch (error) {
      setFormErrors({ submit: apiError?.message || "Failed to create quiz." });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Creating Quiz...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-red-600 font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavigationBar onDashboardClick={() => navigate("/teacherDashboard")} />
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex-grow">
        <Card>
          <CardHeader>
            <h1 className="text-lg font-semibold text-gray-800">
              Create a New Quiz
            </h1>
          </CardHeader>
          <CardContent className="space-y-4">
            {formErrors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {formErrors.submit}
              </div>
            )}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700 ${
                  formErrors.title ? "border-red-500" : ""
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div>
              <label className="inline-flex items-center text-gray-700 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                  checked={isAlwaysAvailable}
                  onChange={handleAvailabilityChange}
                />
                <span className="ml-2">Is Always Available</span>
              </label>
            </div>

            {!isAlwaysAvailable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="availableFrom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Scheduled For
                  </label>
                  <DatePicker
                    id="availableFrom"
                    selected={availableFrom}
                    onChange={(date) => setAvailableFrom(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy HH:mm"
                    placeholderText="Select start time"
                    className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="availableTo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Scheduled To
                  </label>
                  <DatePicker
                    id="availableTo"
                    selected={availableTo}
                    onChange={(date) => setAvailableTo(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy HH:mm"
                    placeholderText="Select end time"
                    className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
                  />
                </div>
              </div>
            )}

            <h3 className="text-md font-semibold text-gray-700 mt-4 mb-2">
              Questions: <span className="text-red-500">*</span>
            </h3>
            {questions.map((question, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-700">
                    Question {index + 1}
                  </h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none text-sm cursor-pointer"
                    >
                      <MinusCircle className="inline-block h-4 w-4 align-middle" />{" "}
                      Remove
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`questionText-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id={`questionText-${index}`}
                    className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700 ${
                      formErrors[`questionText-${index}`]
                        ? "border-red-500"
                        : ""
                    }`}
                    value={question.questionText}
                    onChange={(e) =>
                      handleQuestionTextChange(index, e.target.value)
                    }
                    rows="2"
                  />
                  {formErrors[`questionText-${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`questionText-${index}`]}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="relative">
                      <label
                        htmlFor={`option-${index}-${optionIndex}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Option {String.fromCharCode(65 + optionIndex)}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`option-${index}-${optionIndex}`}
                        className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:border-indigo-500 focus:ring-indigo-500 text-gray-700 ${
                          formErrors[`options-${index}`]?.includes(
                            `option ${optionIndex + 1}`
                          )
                            ? "border-red-500"
                            : ""
                        }`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCorrectAnswerSelect(index, optionIndex)
                        }
                        className={`absolute top-1/2 right-2 -translate-y-1/2 focus:outline-none cursor-pointer ${
                          question.correctAnswerIndex === optionIndex
                            ? "text-green-500"
                            : "text-gray-400 hover:text-blue-500"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {formErrors[`options-${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`options-${index}`]}
                    </p>
                  )}
                </div>
                {formErrors[`correctAnswer-${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors[`correctAnswer-${index}`]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
            >
              Add Question
            </button>
          </CardContent>
          <CardFooter className="text-right">
            <button
              onClick={handleSubmitQuiz}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Quiz
            </button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};
export default MakeQuiz;
