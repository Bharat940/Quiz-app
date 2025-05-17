import axios from "axios";
import React, {
  createContext,
  use,
  useCallback,
  useContext,
  useState,
} from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ResultContext = createContext();

const fetchQuizDetails = async (accessCode) => {
  try {
    const response = await axios.get(
      `https://quiz-app-9xg1.onrender.com/api/v1/quiz/code/${accessCode}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const ResultProvider = ({ children }) => {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [studentResultsLoading, setStudentResultsLoading] = useState(false);
  const [studentResultsError, setStudentResultsError] = useState(null);
  const [studentResultsData, setStudentResultsData] = useState([]);

  const submitQuiz = async (quizId, answers, timeTaken) => {
    setSubmissionLoading(true);
    setSubmissionError(false);

    const storedUserString = localStorage.getItem("user");
    let accessToken = null;
    let fullName = null;
    let email = null;

    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        accessToken = storedUser?.accessToken;
        fullName = storedUser?.fullName;
        email = storedUser?.email;
      } catch (err) {
        console.error("Error parsing stored user:", err);
        return;
      }
    }

    try {
      {
      }
      const response = await axios.post(
        `${BASE_URL}/result/submit`,
        {
          quizId,
          answers,
          timeTaken,
          fullName,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSubmissionLoading(false);
      return response.data.data;
    } catch (err) {
      setSubmissionError(
        err?.response?.data?.message || "Failed to submit quiz"
      );
      setSubmissionLoading(false);
      throw err;
    }
  };

  const getLeaderboard = useCallback(async (quizId) => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);

    const storedUserString = localStorage.getItem("user");
    let accessToken = null;

    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        accessToken = storedUser?.accessToken;
      } catch (err) {
        return;
      }
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/result/leaderboard/${quizId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLeaderboardData(response.data.data);
      setLeaderboardLoading(false);
      return response.data.data;
    } catch (err) {
      setLeaderboardError(
        err?.response?.data?.message || "Failed to fetch leaderboard"
      );
      setLeaderboardLoading(false);
      return [];
    }
  }, []);

  const fetchStudentResults = async () => {
    setStudentResultsLoading(false);
    setStudentResultsError(null);
    const storedUserString = localStorage.getItem("user");
    let accessToken = null;

    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        accessToken = storedUser?.accessToken;
      } catch (err) {
        console.error("Error parsing stored user:", err);
        return;
      }
    }

    try {
      const response = await axios.get(`${BASE_URL}/result/student`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStudentResultsData(response.data.data);
      setStudentResultsLoading(false);
      return response.data.data;
    } catch (err) {
      setStudentResultsError(
        err?.response?.data?.message || "Failed to fetch student results"
      );
      setStudentResultsLoading(false);
      return [];
    }
  };

  return (
    <ResultContext.Provider
      value={{
        submissionLoading,
        submissionError,
        submitQuiz,
        leaderboardLoading,
        leaderboardError,
        leaderboardData,
        getLeaderboard,
        studentResultsLoading,
        studentResultsError,
        studentResultsData,
        fetchStudentResults,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};
