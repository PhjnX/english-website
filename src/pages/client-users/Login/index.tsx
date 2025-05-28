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
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import logo from "../../../assets/images/logo.png";
import { loginApi, signupApi, logout } from "../../../apis/auth-api";

const BackgroundShape = ({ className, initial, animate, transition }: any) => (
  <motion.div
    className={`absolute rounded-full filter blur-3xl opacity-30 ${className}`}
    initial={initial}
    animate={animate}
    transition={transition}
  />
);

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
    if (location.state?.isSignUp) setIsLogin(false);
    form.resetFields();
  }, [location.state, isLogin, form]);

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
          autoClose: 2500,
          onClose: () => {
            setIsLogin(true);
            form.setFieldsValue({ user_name: user_name, password: "" });
          },
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(msg);
    }
  };

  const inputBaseClasses = `h-12 !rounded-lg !border !text-slate-700 placeholder:!text-orange-300/80`;
  const inputThemeClasses = `!bg-orange-50/70 !border-orange-300/70 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500/50`;
  const labelClasses =
    "block text-sm font-semibold text-orange-800 mb-1.5 font-be-vietnam-pro";

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
    },
  };

  // Variants cho các khối trường form (Đăng ký)
  const formSectionVariants = {
    initial: { opacity: 0, height: 0, y: 15, originY: 0 }, // Bắt đầu ẩn và co lại từ trên, trượt nhẹ xuống
    animate: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        type: "spring", // Sử dụng spring cho hiệu ứng tự nhiên hơn
        damping: 22, // Giảm độ nảy
        stiffness: 200,
        when: "beforeChildren", // Animation của cha xong trước con
        staggerChildren: 0.06, // Các con xuất hiện lần lượt nhanh hơn
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10, // Trượt nhẹ lên khi thu hẹp
      transition: {
        duration: 0.3, // Thời gian thu hẹp
        ease: "anticipate", // Hiệu ứng "co rút" nhẹ trước khi biến mất
        // ease: [0.65, 0, 0.35, 1], // Hoặc ease cũ nếu thích
      },
    },
  };

  // Variants cho các mục riêng của form Đăng nhập (Ghi nhớ, Quên MK)
  const loginSpecificsVariants = {
    initial: { opacity: 0, height: 0, y: 10, originY: 0 },
    animate: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 180,
        delay: 0.15, // Xuất hiện sau khi các trường đăng ký đã bắt đầu biến mất
      },
    },
    exit: {
      // Khi chuyển từ Đăng nhập sang Đăng ký
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        duration: 1,
        ease: "anticipate",
      },
    },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-yellow-50 via-red-50 to-orange-100">
        {/* Background Shapes giữ nguyên */}
        <BackgroundShape
          className="w-96 h-96 bg-orange-300/80 -top-20 -left-20"
          initial={{ x: -100, y: -50, scale: 0.8 }}
          animate={{ x: 0, y: 0, scale: 1.2, rotate: 15 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <BackgroundShape
          className="w-80 h-80 bg-red-300/70 -bottom-24 -right-24"
          initial={{ x: 100, y: 50, scale: 0.9 }}
          animate={{ x: 0, y: 0, scale: 1.1, rotate: -25 }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <BackgroundShape
          className="hidden md:block w-60 h-60 bg-amber-300/70 top-1/3 right-1/4"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1, rotate: 20 }}
          transition={{
            duration: 50,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl border border-orange-200/50"
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex justify-center mb-6">
            <motion.img
              src={logo}
              alt="VLearnReading Logo"
              className="h-16 md:h-20 rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                type: "spring",
                stiffness: 150,
              }}
            />
          </div>

          <motion.h1
            className="text-2xl md:text-3xl font-bold text-center mb-2 text-orange-700 font-be-vietnam-pro uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
          </motion.h1>
          <motion.p
            className="text-center text-orange-600/90 mb-8 font-inter text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {isLogin
              ? "Chào mừng bạn trở lại VLearnReading!"
              : "Bắt đầu hành trình chinh phục IELTS ngay!"}
          </motion.p>

          <Form
            form={form}
            name={isLogin ? "loginForm" : "signupForm"}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            className="space-y-4 md:space-y-5"
          >
            {/* Sử dụng AnimatePresence cho các trường Đăng ký */}
            <AnimatePresence initial={false} mode="popLayout">
              {!isLogin && (
                <motion.div
                  layout
                  key="signupFields"
                  variants={formSectionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4 md:space-y-5 overflow-hidden"
                >
                  <Form.Item
                    label={<span className={labelClasses}>Họ và Tên</span>}
                    name="full_name"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input
                      prefix={
                        <IdcardOutlined className="text-orange-500 mr-2" />
                      }
                      placeholder="Nguyễn Văn An"
                      className={`${inputBaseClasses} ${inputThemeClasses}`}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className={labelClasses}>Số Điện Thoại</span>}
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
                  >
                    <Input
                      prefix={
                        <PhoneOutlined className="text-orange-500 mr-2" />
                      }
                      placeholder="09xxxxxxxx"
                      type="tel"
                      className={`${inputBaseClasses} ${inputThemeClasses}`}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className={labelClasses}>Email</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ." },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-orange-500 mr-2" />}
                      placeholder="email@vidu.com"
                      type="email"
                      className={`${inputBaseClasses} ${inputThemeClasses}`}
                    />
                  </Form.Item>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Các trường chung cho cả Đăng nhập và Đăng ký */}
            <Form.Item
              label={<span className={labelClasses}>Tên Đăng Nhập</span>}
              name="user_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-orange-500 mr-2" />}
                placeholder="Tài khoản"
                className={`${inputBaseClasses} ${inputThemeClasses}`}
              />
            </Form.Item>
            <Form.Item
              label={<span className={labelClasses}>Mật Khẩu</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-orange-500 mr-2" />}
                placeholder="••••••••"
                className={`${inputBaseClasses} ${inputThemeClasses}`}
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#F97316" />
                  ) : (
                    <EyeInvisibleOutlined className="!text-orange-400/80" />
                  )
                }
              />
            </Form.Item>

            {/* Sử dụng AnimatePresence cho trường Xác nhận mật khẩu (chỉ cho Đăng ký) */}
            <AnimatePresence initial={false} mode="popLayout">
              {!isLogin && (
                <motion.div
                  layout
                  key="confirmPasswordField"
                  variants={formSectionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <Form.Item
                    label={
                      <span className={labelClasses}>Xác Nhận Mật Khẩu</span>
                    }
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
                    <Input.Password
                      prefix={<LockOutlined className="text-orange-500 mr-2" />}
                      placeholder="Nhập lại mật khẩu"
                      className={`${inputBaseClasses} ${inputThemeClasses}`}
                      iconRender={(visible) =>
                        visible ? (
                          <EyeTwoTone twoToneColor="#F97316" />
                        ) : (
                          <EyeInvisibleOutlined className="!text-orange-400/80" />
                        )
                      }
                    />
                  </Form.Item>
                </motion.div>
              )}
            </AnimatePresence>

            <Form.Item className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-12 !rounded-lg !font-semibold !text-base !bg-gradient-to-r !from-orange-500 !via-red-500 !to-red-600 hover:!from-orange-600 hover:!via-red-600 hover:!to-red-700 !text-white shadow-lg hover:shadow-red-500/40 !border-none transition-all duration-300 transform hover:scale-[1.02] focus:!ring-2 focus:!ring-offset-2 focus:!ring-offset-white focus:!ring-orange-500/70"
              >
                {isLogin ? "Đăng Nhập" : "Đăng Ký Ngay"}
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-slate-600 font-inter text-sm mt-6">
            {isLogin ? "Chưa có tài khoản?" : "Đã là thành viên?"}{" "}
            <button
              type="button"
              className="font-semibold cursor-pointer text-red-600 hover:text-red-700 hover:underline focus:outline-none transition-colors duration-300"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? "Tạo tài khoản mới" : "Đăng nhập tại đây"}
            </button>
          </p>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
