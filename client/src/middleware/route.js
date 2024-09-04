import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React from 'react';

// Protected Route for authenticated users
export const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace={true} />;
  }
  return children;
};

// Public Route for unauthenticated users
export const Public = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return children;
  }
  return <Navigate to="/" replace={true} />;
};

// Admin Route for users with admin role
export const Admin = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace={true} />;
  }

  try {
    const user = jwtDecode(token);
    if (user.role === "admin") {
      return children;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return <Navigate to="/" replace={true} />;
};
