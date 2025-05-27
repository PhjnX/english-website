import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo-admin.png";

const { Sider } = Layout;

interface SidebarProps {
  setLoading?: (value: boolean) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function AdminSidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") return; // logout xử lý riêng
    setSelectedKey(key);
    navigate(key);
  };

  const adminMenu: MenuProps["items"] = [
    !collapsed
      ? { label: "Giao diện - Người dùng", type: "group" }
      : { type: "divider" },
    { key: "/admin", label: "Trang chủ", icon: <MailOutlined /> },
    {
      key: "sub1",
      label: "Quản lý người dùng",
      icon: <SettingOutlined />,
      children: [
        { key: "/admin/users", label: "Danh sách người dùng" },
        { key: "/admin/users/add-user", label: "Thêm người dùng" },
      ],
    },
    !collapsed ? { label: "Học tập", type: "group" } : { type: "divider" },
    {
      key: "sub2",
      label: "Quản lý bài kiểm tra",
      icon: <SettingOutlined />,
      children: [
        { key: "/admin/assessments", label: "Danh sách bài kiểm tra" },
      ],
    },
    {
      key: "sub3",
      label: "Quản lý bài luyện tập",
      icon: <SettingOutlined />,
      children: [
        { key: "/admin/reading", label: "Danh sách bài luyện tập" },
      ],
    },
    !collapsed ? { label: "Hệ thống", type: "group" } : { type: "divider" },
    {
      key: "sub4",
      label: "Tài khoản",
      icon: <UserOutlined />,
      children: [
        { key: "/admin/your-course", label: "Khoá học đã tạo" },
        { key: "/admin/profile", label: "Thông tin cá nhân" },
        { key: "/admin/password", label: "Cập nhật mật khẩu" },
      ],
    },
    {
      key: "logout",
      label: "Đăng xuất",
      danger: true,
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.clear();
        navigate("/auth");
      },
    },
  ];

  const {
    token: { colorBgBase, colorTextBase },
  } = theme.useToken();

  return (
    <Sider
      breakpoint="md"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{ background: colorBgBase }}
    >
      <div className="relative px-4">
        <div className="h-16 flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 object-contain 
              ${collapsed ? "w-10 h-10" : "w-24 md:w-28 lg:w-32"}`}
          />
        </div>
      </div>

      <div style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: colorBgBase, color: colorTextBase }}
          items={adminMenu}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
}
