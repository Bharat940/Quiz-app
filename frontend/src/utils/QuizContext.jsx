import axios from "axios";
import React, {
  createContext,
  use,
  useCallback,
  useContext,
  useState,
} from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const createQuiz = async (quizData) => {
    setLoading(true);
    setError(null);

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
      const response = await axios.post(`${BASE_URL}/quiz/`, quizData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setQuizzes((prev) => [...prev, response.data.data]);
      setLoading(false);
      return response.data.data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create quiz");
      setLoading(false);
      throw err;
    }
  };

  const startQuiz = async (accessCode) => {
    setLoading(true);
    setError(null);

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
      const response = await axios.get(`${BASE_URL}/quiz/code/${accessCode}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoading(false);
      return response.data.data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to start quiz");
      setLoading(false);
      return null;
    }
  };

  const getTeacherQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);

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
      const response = await axios.get(`${BASE_URL}/quiz/teacher`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setQuizzes(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to fetch teacher quizzes"
      );
      setLoading(false);
      return [];
    }
  }, []);

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        loading,
        error,
        createQuiz,
        startQuiz,
        getTeacherQuizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }

  return context;
};
