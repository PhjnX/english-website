// src/pages/Login/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "../../../assets/images/logo.png"; // Logo Readify
import pageBackgroundIllustration from "../../../assets/images/login_background.png"; // Ảnh bạn cung cấp là loginBg, giả sử đây là signupIllustration
// import signupIllustrationPanel from "../../../assets/images/reading-illustration.png"; // Ảnh riêng cho panel nếu muốn

import { loginApi, signupApi } from "../../../apis/auth-api";

// === LeftSidePanel Content Component (Panel trái trang trí) ===
const SignupInfoPanel: React.FC = () => {
  const panelVariants = {
    hidden: { opacity: 0, x: -50, width: 0 },
    visible: {
      opacity: 1,
      x: 0,
      width: "100%",
      transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
    },
    exit: {
      opacity: 0,
      x: -30,
      width: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className="hidden lg:flex flex-col justify-center items-center p-10 xl:p-12 
                 bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-700 
                 text-white rounded-l-2xl relative overflow-hidden flex-grow" // Thêm rounded-l-2xl
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.img
        src={logo} // Có thể dùng một illustration khác ở đây
        alt="Readify - IELTS Reading Platform"
        className="w-24 h-24 rounded-full object-contain mb-6 shadow-lg bg-white p-2"
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      />
      <motion.h2
        className="text-3xl xl:text-4xl font-bold mb-3 text-center font-be-vietnam-pro drop-shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Chào Mừng Đến Readify!
      </motion.h2>
      <motion.p
        className="text-base text-center text-purple-100/90 font-inter max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Nâng cao kỹ năng đọc hiểu và chinh phục điểm số IELTS mơ ước của bạn.
      </motion.p>
      {/* Thêm các hình khối trang trí cho panel này */}
      <motion.div
        className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full filter blur-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.div
        className="absolute bottom-5 right-5 w-24 h-24 border-4 border-white/20 rounded-full filter blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
    </motion.div>
  );
};

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (location.state?.isSignUp && isLogin) {
      setIsLogin(false);
    }
    form.resetFields();
  }, [location.state, form]);

  useEffect(() => {
    form.resetFields();
  }, [isLogin, form]);

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
        navigate(from === "/assessment" ? "/assessment-confirm" : "/", {
          replace: true,
        });
      } else {
        if (password !== confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp!");
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
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
          autoClose: 1800,
          onClose: () => {
            setIsLogin(true);
            form.setFieldsValue({ user_name: user_name, password: "" });
          },
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Đã có lỗi. Vui lòng thử lại!";
      toast.error(msg);
    }
  };

  // --- STYLING MỚI CHO FORM (Theme Tím & Trắng) ---
  const inputWrapperClasses = "relative"; // Cho custom floating label
  const inputBaseClasses = `!w-full !h-11 !px-3.5 !py-2.5 !text-sm !text-purple-900 
                           !bg-purple-50/60 !border !border-purple-300/50 
                           placeholder-transparent focus:!bg-white 
                           peer !rounded-lg transition-all duration-300 focus:!border-purple-600 
                           focus:!ring-1 focus:!ring-purple-600/70`;
  const labelClasses = `absolute left-3 -top-2.5 scale-75 origin-top-left px-1 
                          text-xs font-medium text-purple-700 transition-all 
                          peer-placeholder-shown:left-3.5 peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100 
                          peer-placeholder-shown:text-purple-500/90 
                          peer-focus:left-2 peer-focus:-top-2.5 peer-focus:scale-75 peer-focus:!text-purple-700 
                          bg-gradient-to-b from-transparent via-white/0 to-white rounded`; // Nền label khi float

  const antInputPrefixClass = "!text-purple-500 !mr-2";

  // --- VARIANTS CHO ANIMATION ---
  const mainCardVariants = {
    login: {
      maxWidth: "450px", // Chiều rộng cho form Đăng Nhập
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 28,
        duration: 0.5,
      },
    },
    signup: {
      maxWidth: "860px", // Mở rộng sang phải khi Đăng Ký (cho 2 cột: form + panel)
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 28,
        duration: 0.5,
      },
    },
  };

  const formFieldsBlockVariants = {
    // Dùng cho các khối input của signup
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-inter">
      <div className="absolute inset-0 z-0">
        <img
          src={pageBackgroundIllustration}
          alt="Readify Background"
          className="w-full h-full object-cover filter blur-md brightness-90 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-fuchsia-100/40 to-indigo-200/50"></div>
      </div>

      <motion.div
        layout
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl 
                   border border-purple-200/60 
                   flex flex-col lg:flex-row overflow-hidden min-h-[620px] md:min-h-[660px]"
        variants={mainCardVariants}
        animate={isLogin ? "login" : "signup"}
        initial={location.state?.isSignUp === true ? "signup" : "login"}
        transition={{
          layout: {
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 25,
          },
        }}
      >
        {/* Panel Hình Ảnh/Thông điệp (BÊN TRÁI KHI ĐĂNG KÝ) */}
        {/* Sẽ chỉ hiển thị trên lg screens khi isLogin là false */}
        <AnimatePresence>{!isLogin && <SignupInfoPanel />}</AnimatePresence>

        {/* Cột Form Chính (Bên phải khi đăng ký, hoặc toàn bộ khi đăng nhập) */}
        <div
          className={`flex flex-col justify-center p-6 sm:p-8 md:p-10 
                     transition-all duration-500 ease-in-out relative overflow-y-auto
                     ${isLogin ? "w-full" : "lg:flex-grow w-full"}`} // flex-grow để chiếm phần còn lại
        >
          <div
            className={`flex justify-center mb-5 ${
              !isLogin ? "lg:hidden" : ""
            }`}
          >
            {" "}
            {/* Ẩn logo ở đây nếu đang ở form đăng ký trên desktop */}
            <motion.img
              src={logo}
              alt="Readify Logo"
              className="h-16 md:h-20 rounded-full"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 150,
              }}
            />
          </div>

          <motion.h1
            className="text-2xl md:text-3xl font-bold text-center mb-1.5 text-purple-700 font-be-vietnam-pro uppercase"
            key={`title-${isLogin ? "login" : "signup"}`} // Key để trigger animation khi text thay đổi
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
          </motion.h1>
          <motion.p
            className="text-center text-purple-600/90 mb-6 font-inter text-sm"
            key={`subtitle-${isLogin ? "login" : "signup"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {isLogin
              ? "Chào mừng bạn quay trở lại!"
              : "Chỉ vài bước để khám phá Readify!"}
          </motion.p>

          <Form
            form={form}
            name={isLogin ? "loginForm" : "signupForm"}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            className="space-y-3.5"
          >
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  layout
                  key="signupOnlyFields"
                  variants={formFieldsBlockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3.5"
                >
                  {" "}
                  {/* GRID 2 CỘT */}
                  <Form.Item
                    name="full_name"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                    className="!mb-0"
                  >
                    <div className={inputWrapperClasses}>
                      <Input
                        prefix={
                          <IdcardOutlined className={antInputPrefixClass} />
                        }
                        id="full_name_signup"
                        className={inputBaseClasses}
                        placeholder=" "
                      />
                      <label
                        htmlFor="full_name_signup"
                        className={labelClasses}
                      >
                        Họ và Tên
                      </label>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="phone_number"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                        message: "Số điện thoại không hợp lệ.",
                      },
                    ]}
                    className="!mb-0"
                  >
                    <div className={inputWrapperClasses}>
                      <Input
                        prefix={
                          <PhoneOutlined className={antInputPrefixClass} />
                        }
                        id="phone_signup"
                        type="tel"
                        className={inputBaseClasses}
                        placeholder=" "
                      />
                      <label htmlFor="phone_signup" className={labelClasses}>
                        Số Điện Thoại
                      </label>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ." },
                    ]}
                    className="md:col-span-2 !mb-0"
                  >
                    <div className={inputWrapperClasses}>
                      <Input
                        prefix={
                          <MailOutlined className={antInputPrefixClass} />
                        }
                        id="email_signup"
                        type="email"
                        className={inputBaseClasses}
                        placeholder=" "
                      />
                      <label htmlFor="email_signup" className={labelClasses}>
                        Email
                      </label>
                    </div>
                  </Form.Item>
                </motion.div>
              )}
            </AnimatePresence>

            <Form.Item
              name="user_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
              className="!mb-3.5"
            >
              <div className={inputWrapperClasses}>
                <Input
                  prefix={<UserOutlined className={antInputPrefixClass} />}
                  id="user_name_main"
                  className={inputBaseClasses}
                  placeholder=" "
                />
                <label htmlFor="user_name_main" className={labelClasses}>
                  Tên Đăng Nhập
                </label>
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              className="!mb-3.5"
            >
              <div className={inputWrapperClasses}>
                <Input.Password
                  prefix={<LockOutlined className={antInputPrefixClass} />}
                  id="password_main"
                  className={inputBaseClasses}
                  placeholder=" "
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone twoToneColor="#8B5CF6" />
                    ) : (
                      <EyeInvisibleOutlined className="!text-purple-400" />
                    )
                  }
                />
                <label htmlFor="password_main" className={labelClasses}>
                  Mật Khẩu
                </label>
              </div>
            </Form.Item>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  layout
                  key="confirmPasswordField"
                  variants={formFieldsBlockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="!mb-3.5"
                >
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng xác nhận mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value)
                            return Promise.resolve();
                          return Promise.reject(
                            new Error("Mật khẩu xác nhận không khớp!")
                          );
                        },
                      }),
                    ]}
                  >
                    <div className={inputWrapperClasses}>
                      <Input.Password
                        prefix={
                          <LockOutlined className={antInputPrefixClass} />
                        }
                        id="confirm_password_signup"
                        className={inputBaseClasses}
                        placeholder=" "
                        iconRender={(visible) =>
                          visible ? (
                            <EyeTwoTone twoToneColor="#8B5CF6" />
                          ) : (
                            <EyeInvisibleOutlined className="!text-purple-400" />
                          )
                        }
                      />
                      <label
                        htmlFor="confirm_password_signup"
                        className={labelClasses}
                      >
                        Xác Nhận Mật Khẩu
                      </label>
                    </div>
                  </Form.Item>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {isLogin && (
                <motion.div
                  layout
                  key="loginExtras"
                  variants={formFieldsBlockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex justify-between items-center !mt-2 !mb-5"
                >
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    noStyle
                    className="!mb-0"
                  >
                    <Checkbox className="!text-sm !font-inter !text-purple-700/90">
                      Ghi nhớ tôi
                    </Checkbox>
                  </Form.Item>
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-indigo-600 hover:underline font-medium focus:outline-none"
                  >
                    Quên mật khẩu?
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <Form.Item className="!pt-3">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-12 !rounded-xl !font-bold !text-base !bg-gradient-to-r !from-purple-600 !via-fuchsia-500 !to-indigo-600 hover:!from-fuchsia-600 hover:!via-purple-600 hover:!to-indigo-700 !text-white shadow-xl hover:shadow-purple-500/50 !border-none transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] focus:!ring-2 focus:!ring-offset-2 focus:!ring-offset-white focus:!ring-fuchsia-500/70"
              >
                {isLogin ? "Đăng Nhập" : "Đăng Ký Ngay"}
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-slate-700 font-inter text-sm mt-6">
            {isLogin ? "Chưa có tài khoản Readify?" : "Đã là thành viên?"}{" "}
            <button
              type="button"
              className="font-semibold cursor-pointer text-purple-600 hover:text-indigo-700 hover:underline focus:outline-none transition-colors duration-300"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? "Tạo tài khoản mới" : "Đăng nhập tại đây"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
