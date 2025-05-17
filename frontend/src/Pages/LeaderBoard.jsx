import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResult } from "../utils/ResultContext";
import NavigationBar from "../components/NavigationBar";
import Card, { CardContent, CardHeader } from "../components/Card";
import { ArrowLeft } from "lucide-react";

const LeaderBoard = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const {
    getLeaderboard,
    leaderboardLoading,
    leaderboardError,
    leaderboardData,
  } = useResult();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(quizId);
      if (data) {
        setLeaderboard(data.sort((a, b) => b.score - a.score));
      }
    };

    fetchLeaderboard();
  }, [getLeaderboard, quizId]);

  if (leaderboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Fetching the brightest minds...
        </div>
      </div>
    );
  }

  if (leaderboardError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-red-600 font-semibold">
          Oops! Could not load the leaderboard: {leaderboardError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar
        onDashboardClick={() => {
          navigate("/teacherDashboard");
        }}
      />
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">
              Quiz Leaderboard
            </h2>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No students have completed this quiz yet. Once submissions are
                in, the leaderboard will be displayed here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Time (s)
                      </th>
                      <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Completed At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 border-b border-gray-200 text-sm">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 text-sm">
                          {entry.fullName}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 text-sm">
                          {entry.email}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 text-sm">
                          {entry.score}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 text-sm">
                          {entry.timeTaken}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 text-sm">
                          {new Date(entry.completedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              onClick={() => navigate(-1)}
              className="mt-6 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
            >
              <ArrowLeft className="inline-block mr-2 h-4 w-4 align-middle" />{" "}
              Back
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderBoard;
