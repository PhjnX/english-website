// src/pages/client-auth/AuthLogin.tsx
import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { loginApi, getUserInfo } from "../../apis/auth-api";
import LogoAdmin from "../../assets/images/logo-admin.png";

export default function AuthLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (values: { identifier: string; password: string }) => {
    try {
const { identifier, password } = values;
      const { token, role } = await loginApi(identifier, password);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Gọi API lấy thông tin người dùng
      const userInfo = await getUserInfo(token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      if (role === "admin") {
        message.success("Đăng nhập thành công!");
        const redirectPath = location.state?.from?.pathname || "/admin";
        navigate(redirectPath, { replace: true });
      } else {
        message.warning("Tài khoản không có quyền truy cập trang quản trị");
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
      message.error(msg);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-sky-200 to-emerald-200 flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img
            src={LogoAdmin}
            alt="English App Logo"
            className="w-32 h-16 object-contain"
          />
        </div>

        <p className="text-center text-red-500 mb-6 text-sm">
          Đăng nhập để quản lý nội dung học tập.
        </p>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="identifier"
            label={<span className="font-medium text-gray-700">Email hoặc tài khoản</span>}
            rules={[{ required: true, message: "Vui lòng nhập email hoặc tài khoản" }]}
          >
            <Input size="large" placeholder="admin hoặc admin@email.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="font-medium text-gray-700">Mật khẩu</span>}
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
          >
            Đăng nhập
          </Button>
        </Form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} English Learning System. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
