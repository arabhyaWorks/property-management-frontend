import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = localStorage.getItem("user"); // Check if user exists in localStorage

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
