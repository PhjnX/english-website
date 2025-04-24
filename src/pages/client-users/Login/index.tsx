import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import {
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Header from "../_components/Header";
import bg from "../../../assets/images/background-1.jpg";

const LoginPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Login values:", values);
    // TODO: handle login logic
  };

  return (
    <>
      {/* Navbar */}
      <Header />

      {/* Main Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background image with blur */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={bg}
            alt="background"
            className="w-full h-full object-cover filter blur-xs brightness-75"
          />
        </div>

        {/* Nội dung chính, nằm trên ảnh mờ */}
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Highlight Side with Overlay */}
          <div
            className="relative hidden lg:flex flex-col justify-center p-12 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
          >
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative z-10 text-white">
              <h3 className="text-3xl font-extrabold mb-4">
                Join Our Community
              </h3>
              <p className="mb-6">
                Grow your skills with expert-led courses and interactive
                tutorials:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircleOutlined className="mr-3 text-green-300" />
                  Expert Instructors
                </li>
                <li className="flex items-center">
                  <CheckCircleOutlined className="mr-3 text-green-300" />
                  Hands-on Projects
                </li>
                <li className="flex items-center">
                  <CheckCircleOutlined className="mr-3 text-green-300" />
                  Community Support
                </li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 lg:p-16">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to continue to your account
            </p>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              className="space-y-6"
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Enter a valid email!" },
                ]}
              >
                <Input
                  placeholder="your.email@example.com"
                  size="large"
                  className="rounded-lg border-gray-300"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
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

              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600">Remember me</Checkbox>
                </Form.Item>
                <Link
                  to="#"
                  className="text-sm text-orange-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="rounded-lg bg-orange-500 hover:bg-orange-600 shadow-md"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <Button
              block
              icon={<GoogleOutlined />}
              size="large"
              className="flex items-center justify-center rounded-lg border border-gray-300 hover:shadow"
            >
              Sign in with Google
            </Button>

            <p className="text-center text-gray-700 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
