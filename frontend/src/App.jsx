import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import { AuthProvider } from "./utils/AuthContext";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import TeacherDashboard from "./Pages/TeacherDashboard"
import StudentDashboard from "./Pages/StudentDashboard";
import { QuizProvider } from "./utils/QuizContext";
import { ResultProvider } from "./utils/ResultContext";
import { TakeQuiz } from "./Pages/TakeQuiz";
import MakeQuiz from "./Pages/MakeQuiz";
import LeaderBoard from "./Pages/LeaderBoard";
function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <ResultProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />}></Route>
              <Route
                path="/teacherDashboard"
                element={<TeacherDashboard />}
              ></Route>
              <Route
                path="/studentDashboard"
                element={<StudentDashboard />}
              ></Route>
              <Route path="/take-quiz" element={<TakeQuiz />}></Route>
              <Route path="/make-quiz" element={<MakeQuiz />}></Route>
              <Route
                path="/leaderboard/:quizId"
                element={<LeaderBoard />}
              ></Route>
            </Routes>
          </Router>
        </ResultProvider>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
