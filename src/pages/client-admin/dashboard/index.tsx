// src/pages/client-admin/DashboardPage.tsx
import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  return (
    <div>
      <Title level={2}>Chào mừng đến trang quản trị</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card title="Tổng số khoá học" bordered>
          <Paragraph strong>12 khoá học</Paragraph>
        </Card>
        <Card title="Học viên đang học" bordered>
          <Paragraph strong>150 học viên</Paragraph>
        </Card>
        <Card title="Chờ duyệt" bordered>
          <Paragraph strong>5 yêu cầu mới</Paragraph>
        </Card>
      </div>
    </div>
  );
}
