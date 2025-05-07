// src/app/components/UserFeature/EditUserModal.tsx
import React from "react";
import { Modal, Form, Input, Select, Switch } from "antd";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
}

export default function EditUserModal({
  visible,
  onClose,
  onSubmit,
  initialValues,
}: Props) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        password: "", // để trống nếu không thay đổi
      });
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title="Cập nhật người dùng"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Huỷ"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item name="user_name" label="Tài khoản">
          <Input disabled />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>

        <Form.Item name="password" label="Mật khẩu mới">
          <Input.Password placeholder="Để trống nếu không đổi" />
        </Form.Item>

        <Form.Item name="full_name" label="Họ tên">
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item name="phone_number" label="Số điện thoại">
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item name="picture" label="Ảnh đại diện (URL)">
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item name="level" label="Level">
          <Input placeholder="Level" />
        </Form.Item>

        <Form.Item name="band" label="Band">
          <Input placeholder="Band" />
        </Form.Item>

        <Form.Item name="role" label="Vai trò">
          <Select>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item name="active" label="Kích hoạt" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
