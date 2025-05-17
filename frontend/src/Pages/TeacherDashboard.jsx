import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../utils/QuizContext";
import NavigationBar from "../components/NavigationBar";
import Card, { CardContent, CardHeader } from "../components/Card";
import Footer from "../components/Footer";
import { format } from "date-fns";
import { AlertTriangle, Plus, ChartBar, Clock } from "lucide-react";

function TeacherDashboard() {
  const navigate = useNavigate();
  const { quizzes, loading, error, getTeacherQuizzes } = useQuiz();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);

  useEffect(() => {
    getTeacherQuizzes();
  }, [getTeacherQuizzes]);

  useEffect(() => {
    const results = quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(results);
  }, [searchTerm, quizzes]);

  const handleMakeQuiz = () => {
    navigate("/make-quiz");
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/leaderboard/${quizId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading Your Quizzes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex flex-col">
        <NavigationBar onMakeQuizClick={handleMakeQuiz} />
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-xl font-semibold text-red-600 mb-2">
                Error Loading Quizzes
              </p>
              <p className="text-gray-700">{error}</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavigationBar onMakeQuizClick={handleMakeQuiz} />
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="px-4 py-3 bg-gray-50 sm:px-6 flex gap-3">
            <button
              onClick={handleMakeQuiz}
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md shadow-sm font-medium"
            >
              <Plus className="mr-2 -ml-1 h-5 w-5" />
              Create New Quiz
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Search Quizzes
            </h3>
          </div>
          <div className="px-4 py-3 sm:px-6">
            <input
              type="text"
              placeholder="Search quizzes by title..."
              className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg md:col-span-2 max-h-96 overflow-y-auto">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Your Quizzes</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredQuizzes.length === 0 ? (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No quizzes created yet.
              </li>
            ) : (
              filteredQuizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="md:flex md:items-center md:justify-between">
                    <h3 className="text-lg leading-6 font-medium text-indigo-600">
                      {quiz.title}
                    </h3>
                    <div className="mt-2 md:mt-0 md:ml-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewLeaderboard(quiz._id);
                        }}
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-500 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <ChartBar className="mr-1 h-4 w-4" />
                        Leaderboard
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                      <p className="font-medium text-gray-700">
                        Code:{" "}
                        <span className="text-indigo-600">
                          {quiz.accessCode}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        <Clock className="inline mr-1 h-4 w-4" />
                        {quiz.duration} minutes
                      </p>
                      <p className="text-sm text-gray-500">
                        Availability:{" "}
                        <span className="font-semibold">
                          {quiz.isAlwaysAvailable ? "Always" : "Scheduled"}
                        </span>
                      </p>
                      {!quiz.isAlwaysAvailable && (
                        <>
                          <p className="text-sm text-gray-500">
                            From:{" "}
                            <span className="font-semibold">
                              {format(
                                new Date(quiz.availableFrom),
                                "dd-MM-yyyy HH:mm"
                              )}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            To:{" "}
                            <span className="font-semibold">
                              {format(
                                new Date(quiz.availableTo),
                                "dd-MM-yyyy HH:mm"
                              )}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
            {loading && filteredQuizzes.length === 0 && (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                Loading quizzes...
              </li>
            )}
            {error && filteredQuizzes.length === 0 && (
              <li className="px-4 py-4 sm:px-6 text-center text-red-500">
                Error loading quizzes.
              </li>
            )}
          </ul>
        </div>

        {quizzes.length > 0 && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Quiz Statistics
              </h3>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Total Quizzes
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                    {quizzes.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TeacherDashboard;
