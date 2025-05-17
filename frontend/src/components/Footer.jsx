import React from "react";
import { BrainCircuit, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <div className="flex items-center">
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                QuizMaster
              </span>
            </div>
            <p className="mt-4 text-sm sm:text-base text-gray-500">
              A powerful platform for creating, sharing, and participating in
              educational quizzes. Designed for both teachers and students to
              enhance the learning experience.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
              Features
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  For Teachers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  For Students
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Schedule Your Quizzes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Take Quizzes from anywhere
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
