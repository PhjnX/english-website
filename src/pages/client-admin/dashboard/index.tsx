import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import { getAllReadingTests } from "../../../apis/reading-api";
import { getAllUsers } from "../../../apis/user-api";

const { Title, Paragraph } = Typography;
const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#ff8042", "#ffbb28", "#ff6384"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [readings, setReadings] = useState<any[]>([]);
  const [levelData, setLevelData] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [userRes, readingRes] = await Promise.all([
        getAllUsers(),
        getAllReadingTests(),
      ]);
      const users = userRes || [];
      const readings = readingRes || [];
      setUsers(users);
      setReadings(readings);

      // Biểu đồ số bài reading từng level (level 1-6)
      const levelCount: Record<string, number> = {};
      readings.forEach((r: any) => {
        const level = r.level || r.band || "Khác";
        levelCount[level] = (levelCount[level] || 0) + 1;
      });
      setLevelData(
        Object.entries(levelCount).map(([level, value]) => ({
          name: "Level " + level,
          value,
        }))
      );

      // Pie chart user theo role
      const roleCount: Record<string, number> = {};
      users.forEach((u: any) => {
        const role = u.role || "user";
        roleCount[role] = (roleCount[role] || 0) + 1;
      });
      setRoleData(
        Object.entries(roleCount).map(([role, value]) => ({
          name: role,
          value,
        }))
      );

      setLoading(false);
    }
    fetchData();
  }, []);

  // Tổng số user
  const totalUsers = users.length;

  // User mới hôm nay
  const today = dayjs().format("YYYY-MM-DD");
  const userToday = users.filter(
    (u) => dayjs(u.createdAt || u.created_at).format("YYYY-MM-DD") === today
  ).length;

  // Tổng số bài reading
  const totalReadings = readings.length;

  // Bài reading mới hôm nay
  const readingsToday = readings.filter(
    (r) => dayjs(r.createdAt || r.created_at).format("YYYY-MM-DD") === today
  ).length;

  if (loading) return <Spin size="large" className="mt-10" />;

  return (
    <div>
      <Title level={2}>Dashboard Admin</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card title="Tổng thành viên" bordered>
          <Paragraph strong>{totalUsers} thành viên</Paragraph>
        </Card>
        <Card title="Thành viên mới hôm nay" bordered>
          <Paragraph strong>{userToday} thành viên</Paragraph>
        </Card>
        <Card title="Tổng bài luyện Reading" bordered>
          <Paragraph strong>{totalReadings} bài</Paragraph>
        </Card>
        <Card title="Bài Reading mới hôm nay" bordered>
          <Paragraph strong>{readingsToday} bài</Paragraph>
        </Card>
      </div>

      {/* Bar Chart: số bài từng level */}
      <div className="mt-8">
        <Title level={4}>Số bài Reading từng Level</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={levelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Số bài">
              {levelData.map((entry, idx) => (
                <Cell key={`bar-cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Tỷ lệ user theo vai trò */}
      <div className="mt-8 flex flex-col items-center">
        <Title level={4}>Tỷ lệ vai trò thành viên</Title>
        <ResponsiveContainer width="60%" height={300}>
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {roleData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
