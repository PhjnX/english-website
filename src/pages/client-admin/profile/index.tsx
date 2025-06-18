import React, { useEffect, useState } from "react";
import { Card, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  if (!user) return <div>Không tìm thấy thông tin tài khoản!</div>;

  return (
    <div className="flex justify-center mt-8">
      <Card
        style={{ width: 400, boxShadow: "0 4px 16px #0001" }}
        title={<Title level={4}>Thông tin tài khoản</Title>}
      >
        <div className="flex flex-col items-center gap-4 mb-4">
          <Avatar
            size={80}
            src={user.picture}
            icon={!user.picture ? <UserOutlined /> : undefined}
          />
          <Title level={5} style={{ marginBottom: 0 }}>
            {user.full_name || "Chưa đặt tên"}
          </Title>
          <Paragraph type="secondary">{user.role}</Paragraph>
        </div>
        <Paragraph>
          <b>Username:</b> {user.user_name || "Không có"}
        </Paragraph>
        <Paragraph>
          <b>Email:</b> {user.email || "Không có"}
        </Paragraph>
      </Card>
    </div>
  );
}
