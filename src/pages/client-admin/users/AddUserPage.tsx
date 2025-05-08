import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const AddUserPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/user", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("🎉 Thêm người dùng thành công!");
      navigate("/admin/users");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Lỗi khi thêm người dùng!";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Thêm người dùng mới"
        bordered={false}
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_name"
                label="Tài khoản"
                rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
              >
                <Input placeholder="Tên tài khoản" autoComplete="off" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="example@email.com" autoComplete="off" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password placeholder="••••••••" autoComplete="new-password" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="full_name" label="Họ tên">
                <Input placeholder="Họ và tên (tuỳ chọn)" autoComplete="off" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^(0\d{9,10})$/,
                    message: "Số điện thoại phải bắt đầu bằng 0 và có 10 hoặc 11 chữ số",
                  },
                ]}
              >
                <Input placeholder="SĐT (tuỳ chọn)" autoComplete="off" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="role" label="Vai trò" initialValue="user">
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="level" label="Level">
                <Input placeholder="Level (tuỳ chọn)" autoComplete="off" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="band" label="Band">
                <Input placeholder="Band (tuỳ chọn)" autoComplete="off" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm người dùng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddUserPage;
