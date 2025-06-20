import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteAuthProps {
  children: React.ReactNode;
  redirectMessage?: string;
}

const PrivateRouteAuth: React.FC<PrivateRouteAuthProps> = ({
  children,
  redirectMessage = "Vui lòng đăng nhập để tiếp tục",
}) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Chuyển hướng đến trang login với thông tin về trang hiện tại
    return (
      <Navigate
        to="/login"
        state={{
          from: { pathname: location.pathname },
          redirectMessage,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRouteAuth;
