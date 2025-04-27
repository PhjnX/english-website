import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import logo from "../../../assets/images/logo.png";
import bg from "../../../assets/images/background-1.jpg";
import LeftSidePanel from "./LeftSidePanel";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("username");
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const location = useLocation();
  // Tự động chuyển sang form Đăng ký nếu state.isSignUp = true
  useEffect(() => {
    if (location.state?.isSignUp) {
      setIsLogin(false);
    }
  }, [location.state]);

  const handleFinish = (values: any) => {
    const { username, password, email, confirmPassword } = values;

    if (isLogin) {
      if (username === "AnhHuy" && password === "123456") {
        localStorage.setItem("username", username);
        setLoggedInUser(username);
        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } else {
      if (password !== confirmPassword) {
        message.error("Mật khẩu không khớp");
        return;
      }
      message.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      setIsLogin(true);
    }
  };

  return (
    <>
      <Header />

      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={bg}
            alt="background"
            className="w-full h-full object-cover filter blur-xs brightness-75"
          />
        </div>

        <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Bảng thông tin bên trái */}
          <LeftSidePanel />

          {/* Form Đăng nhập/Đăng ký */}
          <div className="p-10 lg:p-16">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="h-20" />
            </div>

            {loggedInUser ? (
              <h2 className="text-center text-xl font-semibold text-green-600">
                Xin chào, {loggedInUser}
              </h2>
            ) : (
              <>
                <Form
                  name={isLogin ? "login" : "signup"}
                  onFinish={handleFinish}
                  layout="vertical"
                  className="space-y-6"
                >
                  {!isLogin && (
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input
                        placeholder="Nhập email của bạn"
                        size="large"
                        className="rounded-lg border-gray-300"
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên đăng nhập!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên đăng nhập"
                      size="large"
                      className="rounded-lg border-gray-300"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      size="large"
                      className="rounded-lg border-gray-300"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  {!isLogin && (
                    <Form.Item
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng xác nhận mật khẩu!",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Xác nhận mật khẩu"
                        size="large"
                        className="rounded-lg border-gray-300"
                      />
                    </Form.Item>
                  )}

                  {isLogin && (
                    <div className="flex justify-between items-center">
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox className="text-gray-600">
                          Ghi nhớ đăng nhập
                        </Checkbox>
                      </Form.Item>
                      <span className="text-sm text-orange-500 cursor-pointer hover:underline">
                        Quên mật khẩu?
                      </span>
                    </div>
                  )}

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="rounded-lg !bg-red-800 hover:!bg-red-900 shadow-md"
                    >
                      {isLogin ? "Đăng nhập" : "Đăng ký"}
                    </Button>
                  </Form.Item>
                </Form>

                <div className="flex items-center my-6">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-2 text-gray-500">HOẶC</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                <p className="text-center text-gray-700 mt-6">
                  {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                  <span
                    className="text-red-600 font-medium hover:underline cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Đăng ký" : "Đăng nhập"}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LoginPage;
