// ✅ Full file UserList.tsx (Đã sửa lỗi không xoá được Modal)
import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Tooltip,
  Input,
  Select,
  Row,
  Col,
  Card,
  Modal,
  Button,
} from "antd"; // ✅ Import Modal ở đây luôn
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { getAllUsers, deleteUserApi } from "../../../apis/user-api";
import EditUserModal from "../_components/EditUserModal/EditUserModal";
import axios from "axios";
import { toast } from "react-toastify";

const { confirm } = Modal; // ✅ dùng Modal.confirm chuẩn
const { Search } = Input;
const { Option } = Select;

interface User {
  user_id: number;
  user_name: string;
  full_name?: string | null;
  email: string;
  phone_number?: string | null;
  role: "admin" | "user";
  band?: string | null;
  level?: string | null;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editInitialValues, setEditInitialValues] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Lỗi khi gọi API /user", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];
    const keyword = searchValue.trim().toLowerCase();

    if (keyword) {
      result = result.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(keyword) ||
          user.user_name?.toLowerCase().includes(keyword)
      );
    }

    if (selectedRole !== "all") {
      result = result.filter((user) => user.role === selectedRole);
    }

    setFilteredUsers(result);
  }, [searchValue, selectedRole, users]);

const handleDelete = async (userId: number) => {
  try {
    await deleteUserApi(userId);
    toast.success("🗑 Xoá người dùng thành công!");
    const updated = users.filter((u) => u.user_id !== userId);
    setUsers(updated);
    setFilteredUsers(updated);
  } catch (err) {
    toast.error("❌ Lỗi khi xoá người dùng!");
    console.error(err);
  }
};

  const handleUpdate = (user: User) => {
    setEditInitialValues(user);
    setEditModalVisible(true);
  };

  const handleSubmitUpdate = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/user/${editInitialValues.user_id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cập nhật thành công!");
      setEditModalVisible(false);
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi khi cập nhật!");
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "full_name",
      render: (name: string | null) =>
        name ? name : <Tag color="default">Chưa cập nhật</Tag>,
    },
    {
      title: "Tài khoản",
      dataIndex: "user_name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      render: (phone: string | null) =>
        phone ? phone : <Tag color="default">Chưa cập nhật</Tag>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role: string) =>
        role === "admin" ? (
          <Tag color="volcano">Admin</Tag>
        ) : (
          <Tag color="blue">User</Tag>
        ),
    },
    {
      title: "Band",
      dataIndex: "band",
      render: (_: any, record: User) =>
        record.role === "admin" ? (
          <Tag color="default">Không yêu cầu</Tag>
        ) : record.band ? (
          <Tag color="green">{record.band}</Tag>
        ) : (
          <Tag color="gold">Chưa làm bài đánh giá</Tag>
        ),
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (_: any, record: User) =>
        record.role === "admin" ? (
          <Tag color="default">Không yêu cầu</Tag>
        ) : record.level ? (
          <Tag color="green">{record.level}</Tag>
        ) : (
          <Tag color="gold">Chưa làm bài đánh giá</Tag>
        ),
    },
    {
      title: "Thao tác",
      render: (_: any, record: User) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <EditOutlined
              style={{ color: "#1677ff", cursor: "pointer" }}
              onClick={() => handleUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="Xoá người dùng">
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => handleDelete(record.user_id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-4 pt-4">
      <Card
        variant="outlined"
        styles={{ body: { paddingBottom: 16 } }} // ✅ Dùng đúng API mới
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]} align="middle" justify="start">
          <Col xs={24} sm={16} md={14} lg={10}>
            <Search
              placeholder="🔍 Tìm theo họ tên hoặc tài khoản..."
              allowClear
              size="middle"
              prefix={<SearchOutlined />}
              onSearch={(value) => setSearchValue(value)}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Select
              value={selectedRole}
              size="middle"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedRole(value)}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">🎭 Tất cả vai trò</Option>
              <Option value="admin">🔐 Admin</Option>
              <Option value="user">👤 User</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table
        scroll={{ x: "max-content" }}
        rowKey="user_id"
        dataSource={filteredUsers}
        columns={columns}
        bordered
        pagination={{ pageSize: 8 }}
      />

      <EditUserModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        initialValues={editInitialValues}
        onSubmit={handleSubmitUpdate}
      />
    </div>
  );
}
