import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Space, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBookOpen,
  faClipboardCheck,
  faFileAlt,
  faFileLines,
  faUserGraduate,
  faSignOutAlt,
  faUserCircle,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../../assets/images/logo.jpg";
import { getUserInfo, logout as logoutApi } from "../../../../apis/auth-api";

const menuItems = [
  { key: "home", icon: faHouse, label: "Trang chủ", href: "/" },
  { key: "lessons", icon: faBookOpen, label: "Bài học", href: "/lessons" },
  {
    key: "assessment",
    icon: faClipboardCheck,
    label: "Đánh giá đầu vào",
    href: "/assessment",
  },
  { key: "mock", icon: faFileAlt, label: "Bài thi thử", href: "/mock-test" },
  {
    key: "resources",
    icon: faFileLines,
    label: "Tài nguyên",
    href: "/resources",
  },
  {
    key: "dashboard",
    icon: faUserGraduate,
    label: "Lộ trình của tôi",
    href: "/dashboard",
  },
];

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getUserInfo(token)
      .then((data) => setUser(data))
      .catch(() => {
        logoutApi();
        setUser(null);
        message.warning("Phiên đăng nhập đã hết hạn");
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logoutApi();
    setUser(null);
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const selectedKey =
    menuItems.find((item) => item.href === location.pathname)?.key || "home";

  const dropdownMenu = {
    items: [
      {
        key: "logout",
        icon: <FontAwesomeIcon icon={faSignOutAlt} />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-r from-[#f5e9e2] via-[#fff4e6] to-[#e3f2fd] shadow-md fixed top-0 z-50 backdrop-blur-sm"
    >
      <div className="w-full mx-auto flex items-center justify-between py-2 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-16 max-w-screen-2xl">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Vlearn Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-white p-1 shadow-md"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#5a4032]">
            Vlearn<span className="text-[#ec8a48]">Reading</span>
          </span>
        </Link>

        <div className="hidden lg:flex flex-wrap gap-2 xl:gap-4 bg-white/80 rounded-full px-4 py-2 shadow-sm items-center backdrop-blur-md">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-full font-bold transition-all duration-200 text-xs sm:text-sm md:text-base ${
                selectedKey === item.key
                  ? "bg-gradient-to-r from-[#ff8a65] to-[#ff7043] text-white shadow"
                  : "text-gray-700 hover:bg-[#ffe0b2] hover:text-[#ff7043]"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Dropdown
              menu={dropdownMenu}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <Space className="cursor-pointer">
                <Avatar
                  icon={<FontAwesomeIcon icon={faUserCircle} />}
                  className="bg-[#ffe0b2] text-[#6d4c41] border"
                  size={36}
                />
                <span className="hidden sm:inline text-[#5d4037] font-semibold text-sm sm:text-base">
                  {user.full_name || user.user_name}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <>
              <Link
                to="/login"
                state={{ isSignUp: true }}
                className="hidden sm:inline text-xs sm:text-sm text-[#d32f2f] hover:underline font-semibold"
              >
                Đăng ký
              </Link>
              <Link to="/login" className="hidden sm:inline">
                <button className="text-xs sm:text-sm md:text-base bg-gradient-to-r from-[#ff7043] to-[#d84315] hover:from-[#f4511e] hover:to-[#e9582b] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105">
                  Đăng nhập
                </button>
              </Link>
            </>
          )}
          <button
            className="lg:hidden text-[#d32f2f]"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-white/90 shadow-inner px-6 pt-2 pb-4 space-y-2 backdrop-blur"
          >
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`block rounded-lg px-4 py-2 font-medium text-base transition-all duration-150 ${
                  selectedKey === item.key
                    ? "bg-gradient-to-r from-[#ff8a65] to-[#ff7043] text-white"
                    : "text-gray-800 hover:bg-[#ffe0b2] hover:text-[#d84315]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 border-t ">
                <Link to="/login">
                  <button className="w-full bg-gradient-to-r from-[#ff7043] to-[#d84315] hover:from-[#f4511e] hover:to-[#bf360c] text-white px-4 py-2 rounded-full font-bold shadow-md transition-all duration-300 ">
                    Đăng nhập
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
