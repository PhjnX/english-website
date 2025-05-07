import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { message } from "antd";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    message.error("Bạn không đủ quyền truy cập!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
    