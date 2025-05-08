import React, { useEffect, useState } from "react";
import { Menu, Avatar, Dropdown, Button, Space, message } from "antd";
import "../../../../App.css";
import {
  HomeOutlined,
  BookOutlined,
  FormOutlined,
  ReadOutlined,
  FileTextOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";
import { getUserInfo, logout as logoutApi } from "../../../../apis/auth-api";

interface SubMenuItem {
  key: string;
  label: React.ReactNode;
  href: string;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  href?: string;
  children?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <Link to="/">Trang chủ</Link>,
    href: "/",
  },
  {
    key: "lessons",
    icon: <BookOutlined />,
    label: <span>Bài học</span>,
    children: Array.from({ length: 6 }, (_, i) => ({
      key: `level${i + 1}`,
      label: <Link to={`/lessons/${i + 1}`}>{`Level ${i + 1}`}</Link>,
      href: `/lessons/${i + 1}`,
    })),
  },
  {
    key: "assessment",
    icon: <FormOutlined />,
    label: <Link to="/assessment">Đánh giá đầu vào</Link>,
    href: "/assessment",
  },
  {
    key: "mock",
    icon: <ReadOutlined />,
    label: <Link to="/mock-test">Bài thi thử</Link>,
    href: "/mock-test",
  },
  {
    key: "resources",
    icon: <FileTextOutlined />,
    label: <Link to="/resources">Tài nguyên</Link>,
    href: "/resources",
  },
  {
    key: "dashboard",
    icon: <ProfileOutlined />,
    label: <Link to="/dashboard">Lộ trình của tôi</Link>,
    href: "/dashboard",
  },

];

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getUserInfo(token)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        logoutApi();
        setUser(null);
        message.warning("Phiên đăng nhập đã hết hạn");
        navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    logoutApi();
    setUser(null);
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const findKey = (items: MenuItem[]): string => {
    for (const item of items) {
      if (item.href === location.pathname) return item.key;
      if (item.children) {
        for (const sub of item.children) {
          if (sub.href === location.pathname) return sub.key;
        }
      }
    }
    return "home";
  };
  const selectedKey = findKey(menuItems);

  const dropdownMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <header className="bg-gray-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-25 pt-5" />
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
              label: item.label,
              children: item.children?.map((sub) => ({
                key: sub.key,
                label: sub.label,
              })),
            }))}
          />
        </div>

        {/* Tài khoản / Nút đăng nhập */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Dropdown menu={dropdownMenu} trigger={["click"]} placement="bottomRight" arrow>
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} className="bg-red-600" />
                <span className="text-gray-800 font-medium">
                  {user.full_name || user.user_name}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <>
              <Link
                to="/login"
                state={{ isSignUp: true }}
                className="text-sm text-gray-800 hover:text-red-600 hover:underline"
              >
                Đăng ký
              </Link>
              <Link to="/login">
                <Button
                  type="primary"
                  danger
                  className="bg-red-600 border-red-600 hover:bg-red-700 rounded-md px-5 text-white"
                >
                  Đăng nhập
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
