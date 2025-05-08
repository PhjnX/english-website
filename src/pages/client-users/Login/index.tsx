import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import logo from "../../../assets/images/logo.png";
import bg from "../../../assets/images/background-1.jpg";
import LeftSidePanel from "./LeftSidePanel";
import { loginApi, signupApi, logout } from "../../../apis/auth-api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user_name = localStorage.getItem("user_name");
    if (user_name) {
      setLoggedInUser(user_name);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.isSignUp) {
      setIsLogin(false);
    }
  }, [location.state]);

  const handleFinish = async (values: any) => {
    const {
      user_name,
      password,
      email,
      confirmPassword,
      full_name,
      phone_number,
    } = values;

    try {
      if (isLogin) {
        const res = await loginApi(user_name, password);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user_name", res.user_name);
        toast.success("Đăng nhập thành công!");
const from = location.state?.from?.pathname || "/";
if (from === "/assessment") {
  navigate("/assessment-confirm", { replace: true });
} else {
  navigate("/", { replace: true });
}
      } else {
        if (password !== confirmPassword) {
          toast.error("Mật khẩu không khớp");
          return;
        }

        await signupApi({
          email,
          password,
          user_name,
          full_name,
          phone_number,
          role: "user",
        });

        toast.success("Đăng ký thành công! Đang chuyển sang đăng nhập...", {
          autoClose: 2000,
          onClose: () => setIsLogin(true),
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!";
      toast.error(msg);
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
          <LeftSidePanel />

          <div className="p-10 lg:p-16">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="h-20" />
            </div>

            {loggedInUser ? (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-green-600">
                  Xin chào, {loggedInUser}
                </h2>
                <Button
                  type="default"
                  className="!text-red-600 border-red-600 hover:!bg-red-50"
                  onClick={() => {
                    logout();
                    toast.success("Đăng xuất thành công");
                    navigate("/login");
                    window.location.reload();
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Form
                  name={isLogin ? "login" : "signup"}
                  onFinish={handleFinish}
                  layout="vertical"
                  className="space-y-6"
                  autoComplete="off"
                >
                  {!isLogin && (
                    <>
                      <Form.Item
                        label="Họ tên"
                        name="full_name"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                      >
                        <Input
                          placeholder="Nhập họ tên"
                          size="large"
                          autoComplete="off"
                          className="rounded-lg border-gray-300"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Số điện thoại"
                        name="phone_number"
                        rules={[
                          { required: true, message: "Vui lòng nhập số điện thoại!" },
                          {
                            pattern: /^[0-9]{9,11}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          size="large"
                          autoComplete="off"
                          className="rounded-lg border-gray-300"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input
                          placeholder="Nhập email"
                          size="large"
                          autoComplete="off"
                          className="rounded-lg border-gray-300"
                        />
                      </Form.Item>
                    </>
                  )}

                  <Form.Item
                    label="Tên đăng nhập"
                    name="user_name"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                  >
                    <Input
                      placeholder="Nhập tên đăng nhập"
                      size="large"
                      autoComplete="off"
                      className="rounded-lg border-gray-300"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      size="large"
                      autoComplete="new-password"
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
                      rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
                    >
                      <Input.Password
                        placeholder="Xác nhận mật khẩu"
                        size="large"
                        autoComplete="new-password"
                        className="rounded-lg border-gray-300"
                      />
                    </Form.Item>
                  )}

                  {isLogin && (
                    <div className="flex justify-between items-center">
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox className="text-gray-600">Ghi nhớ đăng nhập</Checkbox>
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
