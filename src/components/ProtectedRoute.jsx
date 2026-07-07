import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Redirect to login but keep the target location so we can redirect back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    // If authenticated but role is not allowed, redirect to their correct dashboard
    if (user.accountType === "consultant") {
      return <Navigate to="/organization/feed" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Support both wrapper pattern and parent layout Outlet pattern
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
