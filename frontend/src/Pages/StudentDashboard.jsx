import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useResult } from "../utils/ResultContext";
import { Trophy, BookOpen, Clock, AlertTriangle } from "lucide-react";
import Card, { CardHeader, CardContent } from "../components/Card";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    studentResultsLoading,
    studentResultsError,
    studentResultsData,
    fetchStudentResults,
  } = useResult();

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    fetchStudentResults();
  }, [fetchStudentResults]);

  useEffect(() => {
    if (studentResultsError) {
      setLocalError("Failed to load past quiz results.");
    }
  }, [studentResultsError]);

  if (!user || user.user.role !== "student") {
    navigate("/login");
    return null;
  }

  const handleDashboardClick = () => {
    navigate("/studentDashboard");
  };

  const handleTakeQuizClick = () => {
    navigate("/take-quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col">
      <NavigationBar
        onDashboardClick={handleDashboardClick}
        onTakeQuizClick={handleTakeQuizClick}
      />
      <div className="py-10 sm:py-16 flex-grow px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white shadow overflow-hidden rounded-lg order-first md:order-last">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-5">
                Ready for a New Challenge?
              </h2>
              <p className="text-gray-600 mb-5">
                Jump into a new quiz and sharpen your skills. Click the button
                below to begin!
              </p>
              <button
                onClick={() => navigate("/take-quiz")}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Start Quiz
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-lg order-last md:order-first">
            <div className="px-6 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Your Recent Quiz Results
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {" "}
              {/* Added max-h-96 and overflow-y-auto */}
              {studentResultsLoading && (
                <li className="px-6 py-4 text-center text-gray-500">
                  Fetching your past scores...
                </li>
              )}
              {studentResultsError && (
                <li className="px-6 py-4 text-center text-red-500">
                  Oops! Failed to load results: {studentResultsError}
                </li>
              )}
              {!studentResultsLoading && studentResultsData?.length === 0 && (
                <li className="px-6 py-4 text-center text-gray-500">
                  No quizzes taken yet. Get started!
                </li>
              )}
              {!studentResultsLoading &&
                studentResultsData?.length > 0 &&
                studentResultsData.map((result) => (
                  <li
                    key={result._id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-indigo-600">
                        {result.quizId?.title || "Untitled Quiz"}
                      </p>
                      <div className="text-sm text-gray-500">
                        <Clock className="inline mr-1 h-4 w-4" />
                        Completed on{" "}
                        {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Score: {result.score} out of {result.totalQuestions} (
                      <span className="text-yellow-500">
                        <Trophy className="inline mr-1 h-4 w-4" />
                        {((result.score / result.totalQuestions) * 100).toFixed(
                          0
                        )}
                        %
                      </span>
                      )
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
