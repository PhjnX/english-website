// src/components/_components/Header.tsx
import React, { useEffect, useState, useRef } from "react";
import { Avatar, Dropdown, Space, message, MenuProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClipboardCheck,
  faFileAlt,
  faFileLines,
  faUserGraduate,
  faSignOutAlt,
  faUserCircle,
  faBars,
  faTimes,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import siteLogo from "../../../../assets/images/logo.png"; // SỬ DỤNG LOGO CŨ CỦA BẠN
import { getUserInfo, logout as logoutApi } from "../../../../apis/auth-api";

const mainNavItems = [
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
    href: "/#resources",
  },
];

const userMenuItems = (
  handleLogoutCallback: () => void,
  navigateCallback: (path: string) => void
): MenuProps["items"] => [
  {
    key: "dashboard",
    icon: (
      <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-purple-600" />
    ),
    label: <span className="font-medium text-slate-700">Lộ trình của tôi</span>,
    onClick: () => navigateCallback("/dashboard"),
  },
  { type: "divider" },
  {
    key: "logout",
    icon: <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />,
    label: <span className="font-medium text-red-500">Đăng xuất</span>,
    onClick: handleLogoutCallback,
  },
];

// NavLink được cập nhật với hiệu ứng hover mới
const NavLink: React.FC<{
  href: string;
  label: string;
  selected: boolean;
  icon?: any;
  isMobile?: boolean;
  onClick?: (e: React.MouseEvent, href: string) => void;
}> = ({ href, label, selected, icon, isMobile, onClick }) => {
  return (
    <Link
      to={href}
      className={`group flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ease-in-out
                  ${
                    isMobile
                      ? "w-full justify-start text-base"
                      : "text-sm md:text-base lg:text-lg relative overflow-visible"
                  } 
                  ${
                    selected
                      ? "text-purple-700 font-bold"
                      : "text-slate-600 hover:text-purple-700"
                  }`}
      style={{ position: isMobile ? undefined : "relative" }}
      onClick={(e) => onClick && onClick(e, href)}
    >
      {isMobile && icon && (
        <FontAwesomeIcon
          icon={icon}
          className="mr-4 w-5 text-purple-600 text-lg"
        />
      )}
      <span className="relative">
        {label}
        {/* Hiệu ứng underline động */}
        {!isMobile && (
          <span
            className={`absolute left-0 -bottom-1 h-[4px] w-full bg-purple-700 rounded transition-all duration-300
              ${
                selected
                  ? "opacity-100 scale-x-100 "
                  : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
              }
            `}
            style={{ transformOrigin: "left" }}
          />
        )}
      </span>
    </Link>
  );
};

const ReadifyLogoAndText: React.FC = () => (
  <Link to="/" className="flex items-center group">
    <motion.img
      src={siteLogo} // Sử dụng logo đã import
      alt="Readify Logo"
      className="h-12 w-12 md:h-14 md:w-14 rounded-md p-0.5 border-2 border-purple-200 group-hover:border-purple-400 transition-colors duration-300" // Thêm border cho logo
      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
    <motion.span
      className="ml-3 text-2xl md:text-3xl lg:text-4xl font-extrabold font-be-vietnam-pro group-hover:scale-105 transition-transform duration-300"
      style={{ fontFamily: "Be Vietnam Pro", fontWeight: 800 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <span className="text-purple-700">Read</span>
      <span className="text-indigo-500">ify</span>
    </motion.span>
  </Link>
);

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0); // Thêm state cho opacity
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const difference = latest - lastYRef.current;
    if (difference > 0 && latest > 0) {
      setHidden(true); // Ẩn ngay khi cuộn xuống
    } else if (difference < 0) {
      setHidden(false); // Hiện lại khi cuộn lên
    }
    // Hiệu ứng opacity background
    if (latest <= 0) {
      setBgOpacity(0);
    } else {
      setBgOpacity(1);
    }
    lastYRef.current = latest;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    getUserInfo(token)
      .then((data) => setUser(data))
      .catch(() => {
        /* Xử lý lỗi nếu cần */
      });
  }, [location.pathname]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logoutApi();
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_name");
    localStorage.removeItem("reading_result");
    setUser(null);
    message.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleNavLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === "/#resources") {
      if (window.location.pathname === "/") {
        e.preventDefault();
        const el = document.getElementById("resources");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const selectedKey =
    mainNavItems.find((item) => location.pathname.startsWith(item.href))?.key ||
    "";

  return (
    <motion.header
      className={`w-full shadow-lg fixed top-0 z-50 transition-colors duration-300 ${
        bgOpacity === 0
          ? "border-b-0 shadow-none"
          : "border-b border-purple-100/80"
      }`}
      animate={{
        y: hidden ? "-100%" : "0%",
        backgroundColor: `rgba(255,255,255,${bgOpacity})`,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Tăng chiều cao Header bằng padding py-5 hoặc py-6 */}
      <div className="container mx-auto flex items-center justify-between !py-8 md:py-6 px-4 sm:px-6 lg:px-8">
        <ReadifyLogoAndText />

        <nav className="hidden lg:flex items-center space-x-2 xl:space-x-3">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.key}
              href={item.href}
              label={item.label}
              selected={selectedKey === item.key}
              onClick={handleNavLinkClick}
            />
          ))}
        </nav>

        <div className="flex items-center space-x-3 md:space-x-4">
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems(handleLogout, navigate) }}
              trigger={["hover"]}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
              overlayClassName="mt-3 shadow-xl rounded-xl border border-gray-100 w-56" // Tùy chỉnh dropdown
            >
              <Space className="cursor-pointer group p-1.5 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                <Avatar
                  icon={<FontAwesomeIcon icon={faUserCircle} />}
                  src={user.avatar_url || undefined}
                  className="!bg-purple-100 !text-purple-600 border-2 !border-purple-200 group-hover:!border-purple-400 transition-colors"
                  size={44} // Avatar lớn hơn
                />
                <span className="hidden sm:inline text-slate-700 group-hover:text-purple-700 font-semibold text-base transition-colors">
                  {user.full_name || user.user_name}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="hidden sm:inline text-slate-400 group-hover:text-purple-600 transition-colors text-sm"
                />
              </Space>
            </Dropdown>
          ) : (
            <>
              <Link
                to="/login"
                state={{ isSignUp: true }}
                className="hidden sm:block text-base font-semibold text-purple-600 hover:text-purple-800 hover:bg-purple-100/70 px-4 py-2.5 rounded-lg transition-all duration-300"
              >
                Đăng ký
              </Link>
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/login">
                  <button className="text-base bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 !text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform cursor-pointer">
                    Đăng nhập
                  </button>
                </Link>
              </motion.div>
            </>
          )}
          <button
            className="lg:hidden text-purple-600 p-2 focus:outline-none rounded-md hover:bg-purple-100"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Mở menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:hidden bg-white shadow-inner border-t border-purple-100 absolute w-full"
          >
            <nav className="flex flex-col px-4 py-4 space-y-1.5">
              {mainNavItems.map((item) => (
                <NavLink
                  key={`mobile-${item.key}`}
                  href={item.href}
                  label={item.label}
                  selected={selectedKey === item.key}
                  icon={item.icon}
                  isMobile={true}
                  onClick={handleNavLinkClick}
                />
              ))}
              {!user && (
                <div className="pt-4 mt-3 border-t border-purple-100">
                  <Link to="/login" className="w-full block">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-4 py-3 rounded-lg font-bold shadow-sm transition-all duration-300 text-base">
                      Đăng nhập / Đăng ký
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
