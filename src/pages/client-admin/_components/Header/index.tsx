// src/components/CustomHeader.tsx
import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  MenuProps,
  Typography,
  Divider,
  Space,
  Button,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const { Header } = Layout;
const { Text } = Typography;

interface UserInfo {
  full_name: string | null;
  role: string;
  picture: string | null;
}

export default function CustomHeader({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const generateBreadcrumbs = () => {
    const pathArray = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [{ title: <HomeOutlined />, href: "/admin" }];
    pathArray.forEach((path, index) => {
      const href = `/${pathArray.slice(0, index + 1).join("/")}`;
      const breadcrumbTitle: { [key: string]: string } = {
        dashboard: "Trang chủ",
      };
      breadcrumbs.push({
        title: <span>{breadcrumbTitle[path] || path}</span>,
        href,
      });
    });
    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();
  const avatarSrc = user?.picture ?? null;

  const userMenuItems: MenuProps["items"] = [
    {
      key: "avatar",
      label: (
        <div className="w-44">
          <Space direction="horizontal" size="small">
            <Avatar size={50} src={avatarSrc} icon={!avatarSrc ? <UserOutlined /> : undefined} />
            <div className="flex flex-col">
              <Text strong>{user?.full_name || "Người dùng"}</Text>
              <Text type="secondary">{user?.role || "Vai trò"}</Text>
            </div>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
        </div>
      ),
    },
    {
      key: "profile",
      label: "Thông tin",
      icon: <InfoCircleOutlined />,
      onClick: () => navigate("/admin/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.clear();
        navigate("/auth");
      },
    },
    { type: "divider" },
    {
      key: "version",
      label: "Hoàng Phi - 2025",
      disabled: true,
      style: { textAlign: "center" },
    },
  ];

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 18 }}
        />
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight" arrow>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <Avatar size="default" src={avatarSrc} icon={!avatarSrc ? <UserOutlined /> : undefined} />
        </div>
      </Dropdown>
    </Header>
  );
}
