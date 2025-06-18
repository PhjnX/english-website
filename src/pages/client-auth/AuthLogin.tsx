import React, { useState } from "react";
import { Form, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { loginApi, getUserInfo } from "../../apis/auth-api";
import LogoAdmin from "../../assets/images/logo-admin.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// SVG nền sóng gradient tím xanh, chuẩn style SaaS
const BackgroundWave = () => (
  <svg
    className="absolute inset-0 w-full h-[75vh] md:h-[65vh] z-0" // Tăng chiều cao để sóng chiếm nhiều không gian hơn
    viewBox="0 0 1440 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="wave-gradient-light" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#E0BBE4" /> {/* tím lavender nhạt */}
        <stop offset="0.7" stopColor="#957DAD" /> {/* tím xám */}
        <stop offset="1" stopColor="#D291BC" /> {/* hồng tím nhạt */}
      </linearGradient>
    </defs>
    <path
      d="M0 160 Q720 360 1440 160 V420 H0 V160Z"
      fill="url(#wave-gradient-light)" // Sử dụng gradient nhạt hơn
      opacity="0.6" // Giảm độ mờ hơn nữa
    />
    <path
      d="M0 260 Q720 480 1440 260 V420 H0 V260Z"
      fill="url(#wave-gradient-light)" // Sử dụng gradient nhạt hơn
      opacity="0.3" // Giảm độ mờ hơn nữa
    />
  </svg>
);

export default function AuthLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();

  const handleLogin = async (values: { identifier: string; password: string }) => {
    try {
      setLoading(true);
      const { identifier, password } = values;
      const { token, role } = await loginApi(identifier, password);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      const userInfo = await getUserInfo(token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      if (role === "admin") {
        toast.success("Đăng nhập thành công!", { autoClose: 1400 });
        setTimeout(() => {
          const redirectPath = location.state?.from?.pathname || "/admin";
          navigate(redirectPath, { replace: true });
        }, 800);
      } else {
        toast.warn("Tài khoản không có quyền truy cập!", { autoClose: 2200 });
        setTimeout(() => form.resetFields(), 500);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
      toast.error(msg, { autoClose: 2100 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8f6fb] to-[#e8e4f1] flex flex-col items-center justify-center overflow-hidden"> {/* Nền tổng thể mềm mại hơn */}
      {/* Nền sóng gradient nhẹ nhàng hơn */}
      <BackgroundWave />

      {/* Card trắng tinh tế */}
      <div className="relative z-10 w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl px-8 py-10 flex flex-col items-center border border-gray-50" // Giảm độ rộng card, bóng tinh tế hơn
        style={{ minWidth: 320, boxShadow: "0 8px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)" }}
      >
        <img src={LogoAdmin} alt="Logo" className="w-20 h-20 object-contain mb-4 opacity-90" /> {/* Logo nhỏ hơn, mờ nhẹ */}
        <div className="text-center text-xl font-bold text-gray-800 mb-6 tracking-wide">Đăng nhập quản trị</div> {/* Font đậm hơn, màu tối hơn, cỡ nhỏ hơn chút */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
          className="w-full space-y-4"
        >
          <Form.Item
            name="identifier"
            rules={[{ required: true, message: "Vui lòng nhập email hoặc tài khoản!" }]}
          >
            <Input
              size="large"
              placeholder="Email hoặc tài khoản"
              className="rounded-lg bg-white border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Nền trắng, viền rõ hơn, bóng nhẹ
              disabled={loading}
              autoFocus
              prefix={<UserOutlined className="site-form-item-icon text-gray-500 mr-2" />} // Icon đậm hơn chút
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              className="rounded-lg bg-white border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Nền trắng, viền rõ hơn, bóng nhẹ
              disabled={loading}
              prefix={<LockOutlined className="site-form-item-icon text-gray-500 mr-2" />} // Icon đậm hơn chút
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg mt-4 font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5" // Màu nút khác, chữ đậm hơn
              style={{
                boxShadow: "0 8px 25px rgba(99,102,241,0.25)" // Đổ bóng cho nút dựa trên màu xanh
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </Form.Item>
        </Form>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
