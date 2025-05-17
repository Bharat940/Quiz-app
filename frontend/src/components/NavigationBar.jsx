import React, { useState } from "react";
import {
  BrainCircuit,
  Menu,
  X,
  UserCircle,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const NavigationBar = ({
  onLoginClick,
  onRegisterClick,
  onQuizCreationClick,
  onTakeQuizClick,
  onDashboardClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div
            className="cursor-pointer flex items-center"
            onClick={() => {
              navigate("/");
            }}
          >
            <BrainCircuit className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              QuizMaster
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#about"
              className="text-gray-700 hover:text-indigo-600"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
            >
              About
            </a>

            {isLoggedIn ? (
              <>
                {user?.user.role === "teacher" ? (
                  <div className="relative group">
                    <a
                      href="#teachers"
                      className="text-gray-700 hover:text-indigo-600"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("teacher");
                      }}
                    >
                      For Teachers
                    </a>
                    <div className="absolute top-full left-0 hidden group-hover:block z-20 bg-white shadow-md mt-0.5 rounded-md">
                      <a
                        onClick={onDashboardClick}
                        className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                      >
                        <UserCircle className="inline mr-1 h-4 w-4" />
                        Teacher Dashboard
                      </a>
                      <a
                        onClick={onQuizCreationClick}
                        className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                      >
                        Make a Quiz
                      </a>
                    </div>
                  </div>
                ) : user?.user.role === "student" ? (
                  <div className="relative group">
                    <a
                      href="#students"
                      className="text-gray-700 hover:text-indigo-600"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("students");
                      }}
                    >
                      For Students
                    </a>
                    <div className="absolute hidden group-hover:block bg-white shadow-md mt-0.5 rounded-md">
                      <a
                        onClick={onDashboardClick}
                        className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                      >
                        <UserCircle className="inline mr-1 h-4 w-4" />
                        Student Dashboard
                      </a>
                      <a
                        onClick={onTakeQuizClick}
                        className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                      >
                        Take a Quiz
                      </a>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="relative group">
                  <a
                    href="#teachers"
                    className="text-gray-700 hover:text-indigo-600"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("teachers");
                    }}
                  >
                    For Teachers
                  </a>
                  <div className="absolute hidden group-hover:block bg-white shadow-md mt-0.5 rounded-md">
                    <a
                      onClick={onLoginClick}
                      className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                    >
                      Login
                    </a>
                    <a
                      onClick={onRegisterClick}
                      className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                    >
                      Register
                    </a>
                    <a
                      onClick={navigateToLogin}
                      className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                    >
                      Make a Quiz
                    </a>
                  </div>
                </div>
                <div className="relative group">
                  <a
                    href="#students"
                    className="text-gray-700 hover:text-indigo-600"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("students");
                    }}
                  >
                    For Students
                  </a>
                  <div className="absolute hidden group-hover:block bg-white shadow-md mt-0.5 rounded-md">
                    <a
                      onClick={onLoginClick}
                      className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                    >
                      Login
                    </a>
                    <a
                      onClick={onRegisterClick}
                      className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                    >
                      Register
                    </a>
                    <a
                      onClick={navigateToLogin} 
                      className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 cursor-pointer"
                    >
                      Take a Quiz
                    </a>
                  </div>
                </div>
              </>
            )}

            <a
              href="#contact"
              className="text-gray-700 hover:text-indigo-600"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contact Us
            </a>

            {!isLoggedIn ? (
              <div className="rounded-md shadow">
                <button
                  onClick={() => navigate("/register")}
                  className={
                    "cursor-pointer inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 text-lg py-1.5 px-5 w-full sm:w-auto group"
                  }
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <a
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 cursor-pointer flex items-center"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </a>
            )}
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 space-y-2">
          <a
            href="#about"
            className="block text-gray-700 hover:text-indigo-600"
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
              scrollToSection("about");
            }}
          >
            About
          </a>
          {isLoggedIn ? (
            <>
              {user.user.role === "teacher" ? (
                <>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      onDashboardClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <UserCircle className="inline mr-1 h-4 w-4" />
                    Teacher Dashboard
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      onQuizCreationClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    Make a Quiz
                  </a>
                </>
              ) : (
                <>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      onDashboardClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <UserCircle className="inline mr-1 h-4 w-4" />
                    Student Dashboard
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      onTakeQuizClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    Take a Quiz
                  </a>
                </>
              )}
              <a
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-indigo-600 cursor-pointer"
              >
                <LogOut className="inline mr-1 h-4 w-4" />
                Logout
              </a>
            </>
          ) : (
            <>
              <div>
                <a
                  href="#teachers"
                  className="block text-gray-500 font-semibold hover:text-indigo-600"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("teachers");
                    setIsMenuOpen(false);
                  }}
                >
                  For Teachers
                </a>
                <a
                  onClick={() => {
                    onLoginClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm pl-2 py-1 hover:text-indigo-600 cursor-pointer"
                >
                  Login
                </a>
                <a
                  onClick={() => {
                    onRegisterClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm pl-2 py-1 hover:text-indigo-600 cursor-pointer"
                >
                  Register
                </a>
                <a
                  onClick={() => {
                    navigateToLogin();
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm pl-2 py-1 hover:text-indigo-600 cursor-pointer"
                >
                  Make a Quiz
                </a>
              </div>
              <div>
                <a
                  href="#students"
                  className="block text-gray-500 font-semibold hover:text-indigo-600"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("students");
                    setIsMenuOpen(false);
                  }}
                >
                  For Students
                </a>
                <a
                  onClick={() => {
                    onLoginClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm pl-2 py-1 hover:text-indigo-600 cursor-pointer"
                >
                  Login
                </a>
                <a
                  onClick={() => {
                    onRegisterClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm pl-2 py-1 hover:text-indigo-600 cursor-pointer"
                >
                  Register
                </a>
                <a
                  onClick={() => {
                    navigateToLogin(); 
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm pl-2 py-1 hover:text-indigo-600 cursor-pointer"
                >
                  Take a Quiz
                </a>
              </div>
              <div className="rounded-md shadow">
                <button
                  onClick={() => navigate("/register")}
                  className={
                    "cursor-pointer inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 text-lg py-1.5 px-5 w-full sm:w-auto"
                  }
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
