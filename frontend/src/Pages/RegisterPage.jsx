import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, BrainCircuit, ArrowLeft } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import RoleSelector from "../components/RoleSelector";
import { useForm } from "react-hook-form";
import Card, { CardContent, CardHeader, CardFooter } from "../components/Card";
import { Link } from "react-router-dom";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Name is required"),
    email: z.string().min(3, "Email is required").email("Invalid email format"),
    password: z.string().min(8, "Password must be 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["student", "teacher"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.role || "student";

  const { register: registerUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: initialRole,
    },
  });

  const role = watch("role");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      await registerUser(data.fullName, data.email, data.password, data.role);
      navigate("/login");
    } catch (err) {
      setError(err || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const cardBg = role === "teacher" ? "bg-amber-50" : "bg-sky-50";
  const headerBg = role === "teacher" ? "bg-amber-100" : "bg-sky-100";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <div className="flex justify-center">
          <BrainCircuit className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join QuizMaster as a {role}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className={`${cardBg} shadow-lg`}>
          <CardHeader
            className={`${headerBg} flex items-center justify-between`}
          >
            <button
              className="cursor-pointer flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back To Home</span>
            </button>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  {...formRegister("fullName")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...formRegister("email")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...formRegister("password")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...formRegister("confirmPassword")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <RoleSelector
                selectedRole={role}
                onChange={(val) => setValue("role", val)}
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </CardContent>

            <CardFooter className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>

              <p className="text-sm text-gray-600 mt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default RegisterPage;
