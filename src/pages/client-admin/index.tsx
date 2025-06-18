import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./_components/AdminSideBar";
import CustomHeader from "./_components/Header";
import { Layout, ConfigProvider } from "antd";

const { Content } = Layout;

export default function AdminLayoutClient() {
  // State quản lý thu/phóng sidebar
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider componentSize="large">
      <Layout className="!h-screen">
        {/* Truyền collapsed & setCollapsed xuống sidebar và header */}
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
