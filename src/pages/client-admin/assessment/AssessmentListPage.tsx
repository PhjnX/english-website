import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import {
  getAllAssessments,
  deleteAssessment,
  createAssessment,
  updateAssessment,
} from "../../../apis/assessment-api";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AssessmentListPage() {
  const [data, setData] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [currentEdit, setCurrentEdit] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllAssessments();
      setData(res);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách bài test!");
    }
  };

  // Xoá bài test
  const handleDelete = async (id: number) => {
    try {
      await deleteAssessment(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Đã xoá bài test!");
    } catch (err) {
      toast.error("Xoá bài test thất bại!");
    }
  };

  // Thêm bài test
  const handleCreate = async (values: any) => {
    try {
      await createAssessment(values);
      toast.success("✅ Tạo bài test thành công!");
      setIsAddModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi khi tạo bài test");
    }
  };

  // Sửa bài test
  const handleEditClick = (record: any) => {
    setCurrentEdit(record);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      name: record.name,
      level: record.level,
      time: record.time,
      description: record.description,
    });
  };

  const handleUpdate = async (values: any) => {
    if (!currentEdit) return;
    try {
      await updateAssessment(currentEdit.id, values);
      toast.success("✅ Cập nhật bài test thành công!");
      setIsEditModalOpen(false);
      setCurrentEdit(null);
      editForm.resetFields();
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật bài test");
    }
  };

  const columns = [
    {
      title: "Tên bài test",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trình độ",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Quản lý bài test">
            <Button
              type="primary"
              onClick={() =>
                (window.location.href = `/admin/assessments/${record.id}/manage`)
              }
            >
              Quản lý
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xoá bài test này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh sách bài test</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Tạo bài test mới
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} />

      {/* Modal thêm bài test */}
      <Modal
        title="Tạo bài test mới"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="Tên bài test"
            rules={[{ required: true, message: "Không được bỏ trống tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Trình độ (A1, A2, B1...)"
            rules={[
              { required: true, message: "Không được bỏ trống trình độ!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian làm bài (phút)"
            rules={[
              { required: true, message: "Không được bỏ trống thời gian!" },
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tuỳ chọn)">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa bài test */}
      <Modal
        title="Chỉnh sửa bài test"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setCurrentEdit(null);
        }}
        onOk={() => editForm.submit()}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="name"
            label="Tên bài test"
            rules={[{ required: true, message: "Không được bỏ trống tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Trình độ (A1, A2, B1...)"
            rules={[
              { required: true, message: "Không được bỏ trống trình độ!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian làm bài (phút)"
            rules={[
              { required: true, message: "Không được bỏ trống thời gian!" },
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tuỳ chọn)">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer position="top-right" autoClose={1800} />
    </div>
  );
}
