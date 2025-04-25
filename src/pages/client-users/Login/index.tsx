import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
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
  // Auto switch to SignUp form if state.isSignUp is true
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
        message.success("Login successful!");
        navigate("/");
      } else {
        message.error("Invalid username or password!");
      }
    } else {
      if (password !== confirmPassword) {
        message.error("Passwords do not match");
        return;
      }
      message.success("Sign up successful! You can now log in.");
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
          {/* Side Info */}
          <LeftSidePanel />

          {/* Form Side */}
          <div className="p-10 lg:p-16">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="h-20" />
            </div>

            {loggedInUser ? (
              <h2 className="text-center text-xl font-semibold text-green-600">
                Hi! {loggedInUser}
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
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Invalid email format" },
                      ]}
                    >
                      <Input
                        placeholder="Enter your email"
                        size="large"
                        className="rounded-lg border-gray-300"
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your username"
                      size="large"
                      className="rounded-lg border-gray-300"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter your password"
                      size="large"
                      className="rounded-lg border-gray-300"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  {!isLogin && (
                    <Form.Item
                      label="Confirm Password"
                      name="confirmPassword"
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Confirm your password"
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
                          Remember me
                        </Checkbox>
                      </Form.Item>
                      <span className="text-sm text-orange-500 cursor-pointer hover:underline">
                        Forgot password?
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
                      {isLogin ? "Sign In" : "Sign Up"}
                    </Button>
                  </Form.Item>
                </Form>

                <div className="flex items-center my-6">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-2 text-gray-500">OR</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                <p className="text-center text-gray-700 mt-6">
                  {isLogin
                    ? "Don’t have an account?"
                    : "Already have an account?"}{" "}
                  <span
                    className="text-red-600 font-medium hover:underline cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Sign Up" : "Login"}
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
