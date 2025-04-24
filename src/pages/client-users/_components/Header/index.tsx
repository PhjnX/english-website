import React from "react";
import { Menu, Button } from "antd";
import "../../../../App.css";
import {
  HomeOutlined,
  BookOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { key: "home", icon: <HomeOutlined />, label: "Home", href: "/" },
  {
    key: "courses",
    icon: <BookOutlined />,
    label: "Courses",
    href: "/courses",
  },
  {
    key: "about",
    icon: <InfoCircleOutlined />,
    label: "About",
    href: "/about",
  },
  {
    key: "contact",
    icon: <PhoneOutlined />,
    label: "Contact",
    href: "/contact",
  },
];

const Header: React.FC = () => {
  const location = useLocation();
  const selectedKey =
    menuItems.find((item) => item.href === location.pathname)?.key || "home";

  return (
    <header className="bg-gray-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8" />
        </Link>

        {/* Menu giữa */}
        <div className="flex-1">
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            className="custom-menu justify-center"
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.href}>{item.label}</Link>,
            }))}
          />
        </div>

        {/* Nút SignUp + Login */}
        <div className="flex items-center space-x-3">
          <Link
            to="/signup"
            className="text-sm text-gray-800 hover:text-red-600 hover:underline"
          >
            Sign Up
          </Link>

          {/* Bọc Button trong Link */}
          <Link to="/login">
            <Button
              type="primary"
              danger
              className="bg-red-600 border-red-600 hover:bg-red-700 rounded-md px-5 text-white"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
