import React, { useState, useEffect } from "react";
import { useQuiz } from "../utils/QuizContext";
import { useResult } from "../utils/ResultContext";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock } from "lucide-react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

export const TakeQuiz = () => {
  const { startQuiz, loading: quizLoading, error: quizError } = useQuiz();
  const { submitQuiz, submissionLoading, submissionError } = useResult();
  const navigate = useNavigate();

  const [accessCode, setAccessCode] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [localError, setLocalError] = useState(null);

  const currentQuestion = quiz?.questionIds[currentQuestionIndex];

  const initializeQuiz = (quizData) => {
    setQuiz(quizData);
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(
      quizData.questionIds.map((q) => ({
        questionId: q._id,
        givenAnswer: null,
      }))
    );
    setScore(null);
    setLocalError(null);
    if (quizData.duration > 0) {
      setTimeRemaining(quizData.duration * 60);
      setTimerRunning(true);
    } else {
      setTimeRemaining(null);
      setTimerRunning(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!accessCode) {
      setLocalError("Please enter the quiz access code.");
      return;
    }
    try {
      const response = await startQuiz(accessCode);
      if (response) {
        if (!response.isAlwaysAvailable) {
          const now = new Date();
          const startTime = new Date(response.availableFrom);
          const endTime = new Date(response.availableTo);

          if (now < startTime) {
            setLocalError(
              `This quiz will be available from ${startTime.toLocaleString()}.`
            );
            return;
          }

          if (now > endTime) {
            setLocalError(`This quiz expired on ${endTime.toLocaleString()}.`);
            return;
          }
        }
        initializeQuiz(response);
      } else {
        setLocalError("No such quiz exists.");
      }
    } catch (error) {
      setLocalError(error?.response?.data?.message || "Failed to start quiz.");
    }
  };

  const handleAnswerSelection = (answer, index) => {
    setSelectedAnswer(answer);
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = {
        questionId: currentQuestion._id,
        givenAnswer: index.toString(),
      };
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    setLocalError(null);
    if (currentQuestionIndex < quiz.questionIds.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(
        userAnswers[currentQuestionIndex + 1]?.givenAnswer || null
      );
    }
  };

  const handlePreviousQuestion = () => {
    setLocalError(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(
        userAnswers[currentQuestionIndex - 1]?.givenAnswer || null
      );
    }
  };

  const calculateScore = (userAnswers, quizQuestions) => {
    let correctCount = 0;
    userAnswers.forEach((answer) => {
      const currentQuizQuestion = quizQuestions.find(
        (q) => q._id === answer.questionId
      );
      const correctAnswerIndex = currentQuizQuestion?.correctAnswerIndex;
      const givenAnswerIndex = parseInt(answer.givenAnswer);

      if (
        correctAnswerIndex !== undefined &&
        givenAnswerIndex === correctAnswerIndex
      ) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const finishQuiz = async () => {
    setTimerRunning(false);
    setQuizFinished(true);
    setLocalError(null);
    const calculatedScore = calculateScore(userAnswers, quiz.questionIds);
    setScore(calculatedScore);
    try {
      const response = await submitQuiz(
        quiz._id,
        userAnswers,
        quiz.duration * 60 - (timeRemaining ?? 0)
      );
      if (response) {
        navigate("/studentDashboard");
      }
    } catch (error) {
      console.error(
        "Failed to submit quiz:",
        error?.response?.data?.message || error.message
      );
      setLocalError("Failed to submit quiz results.");
    }
  };

  useEffect(() => {
    if (timerRunning && timeRemaining !== null && timeRemaining > 0) {
      const intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => (prevTime ?? 0) - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timeRemaining === 0 && quizStarted) {
      setTimerRunning(false);
      setQuizFinished(true);
      const calculatedScore = calculateScore(userAnswers, quiz.questionIds);
      setScore(calculatedScore);
      try {
        submitQuiz(quiz._id, userAnswers, quiz.duration * 60);
      } catch (error) {
        console.error(
          "Failed to submit quiz on timeout:",
          error?.response?.data?.message || error.message
        );
        setLocalError("Failed to submit quiz results due to timeout.");
      }
    }
  }, [
    timerRunning,
    timeRemaining,
    quizStarted,
    userAnswers,
    quiz?.questionIds,
    quiz?._id,
    submitQuiz,
    quiz?.duration,
  ]);

  const handleDashboardClick = () => {
    navigate("/student/dashboard");
  };

  const handleTakeQuizClick = () => {
    navigate("/take-quiz");
  };

  if (quizLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading Quiz...
        </div>
      </div>
    );
  }

  if (quizError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-red-600 font-semibold">Error: {quizError}</div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <NavigationBar
          onDashboardClick={handleDashboardClick}
          onTakeQuizClick={handleTakeQuizClick}
        />
        <div className="flex-grow flex items-center justify-center py-6 sm:py-12">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Enter Quiz Code
            </h2>
            {localError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">
                  <AlertTriangle className="inline mr-2 h-5 w-5 align-middle" />
                  Error!
                </strong>
                <span className="block sm:inline">{localError}</span>
              </div>
            )}
            <input
              type="text"
              placeholder="Quiz Access Code"
              className="w-full p-3 border rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500 mb-4"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            <button
              className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300"
              onClick={handleStartQuiz}
              disabled={quizLoading}
            >
              {quizLoading ? "Starting..." : "Start Quiz"}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-green-100 flex flex-col">
        <NavigationBar
          onDashboardClick={handleDashboardClick}
          onTakeQuizClick={handleTakeQuizClick}
        />
        <div className="flex-grow flex items-center justify-center py-6 sm:py-12">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Quiz Finished!
            </h2>
            {localError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">
                  <AlertTriangle className="inline mr-2 h-5 w-5 align-middle" />
                  Error!
                </strong>
                <span className="block sm:inline">{localError}</span>
              </div>
            )}
            <p className="text-gray-700 mb-4">
              Your Score:{" "}
              <span className="font-bold text-lg text-green-600">{score}</span>{" "}
              / {quiz?.questionIds?.length}
            </p>
            {submissionLoading && (
              <p className="text-yellow-600 text-sm mb-3">
                Submitting your results...
              </p>
            )}
            {submissionError && !localError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">
                  <AlertTriangle className="inline mr-2 h-5 w-5 align-middle" />
                  Error!
                </strong>
                <span className="block sm:inline">{submissionError}</span>
              </div>
            )}
            <button
              className="cursor-pointer mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              onClick={() => navigate("/studentDashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavigationBar
        onDashboardClick={handleDashboardClick}
        onTakeQuizClick={handleTakeQuizClick}
      />
      <div className="flex-grow py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          {localError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">
                <AlertTriangle className="inline mr-2 h-5 w-5 align-middle" />
                Error!
              </strong>
              <span className="block sm:inline">{localError}</span>
            </div>
          )}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {quiz.title}
              </h2>
              <p className="text-gray-600 text-sm">{quiz.description}</p>
            </div>
            {timeRemaining !== null && (
              <div className="text-red-600 font-semibold flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Time Left:{" "}
                <span className="font-bold">
                  {Math.floor(timeRemaining / 60)}:
                  {String(timeRemaining % 60).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Question {currentQuestionIndex + 1} / {quiz.questionIds.length}
            </h3>
            <p className="text-gray-800 mb-4">
              {currentQuestion?.questionText}
            </p>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
              {currentQuestion?.options?.map((option, index) => (
                <button
                  key={index}
                  className={`cursor-pointer p-3 border rounded-md text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                    selectedAnswer === option
                      ? "bg-blue-200 font-semibold"
                      : "bg-white"
                  }`}
                  onClick={() => handleAnswerSelection(option, index)}
                >
                  {option}
                </button>
              ))}
            </div>
            {localError && (
              <p className="text-red-500 text-sm mt-3">{localError}</p>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              disabled={currentQuestionIndex === quiz.questionIds.length - 1}
            >
              Next
            </button>
            {currentQuestionIndex === quiz.questionIds.length - 1 && (
              <button
                onClick={finishQuiz}
                disabled={submissionLoading}
                className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
              >
                {submissionLoading ? "Finishing..." : "Finish Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
