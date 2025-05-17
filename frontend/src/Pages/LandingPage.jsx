import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavigationBar";
import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";
import {
  BookOpen,
  Users,
  BarChart3,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../utils/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleGetStarted = () => navigate("/register");
  const handleMakeQuizClick = () => navigate("/make-quiz");
  const handleTakeQuizClick = () => navigate("/take-quiz");

  const handleDashboardClick = () => {
    if (user && user.user.role === "teacher") {
      navigate("/teacherDashboard");
    } else if (user && user.user.role === "student") {
      navigate("/studentDashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onQuizCreationClick={handleMakeQuizClick}
        onTakeQuizClick={handleTakeQuizClick}
        onDashboardClick={handleDashboardClick}
      />
      <main className="flex-grow">
        <HeroSection onGetStarted={handleGetStarted} />

        <section className="py-16 bg-white" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Powerful Features for Engaging Learning
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Everything you need to create interactive quizzes and enhance
                the learning experience.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Users}
                title="Collaborative Learning"
                description="Enable group participation and discussion through shared quizzes and results."
              />
              <FeatureCard
                icon={BarChart3}
                title="Detailed Analytics"
                description="Track performance with Leaderboard."
              />
              <FeatureCard
                icon={Clock}
                title="Timed Assessments"
                description="Set time limits for quizzes to simulate exam conditions and improve time management."
              />{" "}
            </div>
          </div>
        </section>

        <section
          className="py-16 bg-gradient-to-b from-white to-amber-50"
          id="teachers"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  For Teachers
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Create engaging quizzes, track student progress, and gain
                  valuable insights into learning outcomes.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      Create engaging quizzes for your students
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      Monitor student performance with the Leaderboard
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      You can freely set the timing and duration for the quizzes
                    </p>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() =>
                      navigate("/register", { state: { role: "teacher" } })
                    }
                    className="bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 text-lg font-medium rounded-md px-5 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Join as Teacher
                  </button>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <img
                  src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Teacher working on digital content"
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-16 bg-gradient-to-b from-amber-50 to-sky-50"
          id="students"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mt-10 lg:mt-0 order-1 lg:order-0">
                <img
                  src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Student participating in online learning"
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
              <div className="order-0 lg:order-1">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  For Students
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Access learning materials, participate in quizzes, and track
                  your personal progress.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-sky-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      Give the quizzes and check your knowledge
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-sky-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      Quizzes accessed from anywhere
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-sky-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      Simulate the environment of the exams/tests for the better
                      results
                    </p>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() =>
                      navigate("/register", { state: { role: "student" } })
                    }
                    className="bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 text-lg font-medium rounded-md px-5 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Join as Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-indigo-700" id="contact">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to transform your learning experience?
              </h2>
              <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
                Join to elivate your learning experience and
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleRegisterClick}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 text-lg font-medium rounded-md px-6 py-3 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
