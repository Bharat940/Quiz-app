import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (fullName, email, password, role) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, {
        fullName,
        email,
        password,
        role,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data?.message || "Registration failed";
    }
  };

  const login = async (email, password, role) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/login`, {
        email,
        password,
        role,
      });
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return res.data.message;
    } catch (error) {
      throw error?.response?.data?.message || "Login failed";
    }
  };

  const logout = async () => {
    const storedUserString = localStorage.getItem("user");
    let accessToken = null;

    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        accessToken = storedUser?.accessToken;
      } catch (error) {
        localStorage.removeItem("user");
        setUser(null);
        return;
      }
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      throw error?.response?.data?.message || "Logout failed";
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/changePassword`, {
        currentPassword,
        newPassword,
      });
      return res.data.message;
    } catch (error) {
      throw error?.response?.data?.message || "Password change failed";
    }
  };

  const currentUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/current-user`);
      return res.data.data;
    } catch (error) {
      throw error?.response?.data?.message || "Failed to get current user";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        changePassword,
        currentUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
