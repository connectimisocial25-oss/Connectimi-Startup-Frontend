import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    // If user is already logged in, redirect them to their home base
    if (user.accountType === "consultant") {
      return <Navigate to="/organization/feed" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Support both wrapper pattern and parent layout Outlet pattern
  return children ? children : <Outlet />;
}

export default PublicRoute;
