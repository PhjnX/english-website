import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./_components/AdminSideBar";
import CustomHeader from "./_components/Header";
import { Layout, Spin, ConfigProvider } from "antd";

const { Content } = Layout;

export default function AdminLayoutClient() {
  return (
    <ConfigProvider componentSize="large">
      <Layout className="!h-screen">
        <AdminSidebar collapsed={false} setCollapsed={() => {}} />
        <Layout>
          <CustomHeader user={null} collapsed={false} setCollapsed={() => {}} />
          <Content
  style={{
    margin: "24px 16px",
    padding: 24,
    height: "calc(100vh - 64px)", // giả sử header cao 64px
    overflowY: "auto", // ✅ Cho phép cuộn nếu nội dung dài
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
