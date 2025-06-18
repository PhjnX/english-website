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
  Select,
} from "antd";
import {
  getAllReadingTests,
  deleteReadingTest,
  createReadingTest,
  updateReadingTest,
} from "../../../apis/reading-api";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LEVEL_OPTIONS = [
  { value: 1, label: "Level 1 (IELTS 3.0)" },
  { value: 2, label: "Level 2 (IELTS 3.5)" },
  { value: 3, label: "Level 3 (IELTS 4.0)" },
  { value: 4, label: "Level 4 (IELTS 4.5)" },
  { value: 5, label: "Level 5 (IELTS 5.0)" },
  { value: 6, label: "Level 6 (IELTS 6.0)" },
];

// Hàm tách số trong chuỗi "Reading 1" -> 1, không thấy số trả về 0
const getReadingNumber = (title) => Number((title.match(/\d+/) || [])[0]) || 0;

export default function ReadingTestListPage() {
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [currentEdit, setCurrentEdit] = useState(null);
  const [levelFilter, setLevelFilter] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllReadingTests();
      // Sắp xếp theo số trong title, tăng dần
      const sorted = [...res].sort((a, b) => getReadingNumber(a.title) - getReadingNumber(b.title));
      setData(sorted);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách bài reading!");
    }
  };

  // Xoá bài lesson
  const handleDelete = async (id) => {
    try {
      await deleteReadingTest(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Đã xoá bài lesson!");
    } catch (err) {
      toast.error("Xoá bài lesson thất bại!");
    }
  };

  // Thêm bài lesson
  const handleCreate = async (values) => {
    try {
      await createReadingTest(values);
      toast.success("✅ Tạo bài lesson thành công!");
      setIsAddModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi khi tạo bài lesson");
    }
  };

  // Sửa bài lesson
  const handleEditClick = (record) => {
    setCurrentEdit(record);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      title: record.title,
      level: record.level,
      time: record.time,
      description: record.description,
    });
  };

  const handleUpdate = async (values) => {
    if (!currentEdit) return;
    try {
      await updateReadingTest(currentEdit.id, values);
      toast.success("✅ Cập nhật bài lesson thành công!");
      setIsEditModalOpen(false);
      setCurrentEdit(null);
      editForm.resetFields();
      fetchData();
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật bài lesson");
    }
  };

  // Lọc theo level
  const filteredData = levelFilter
    ? data.filter((d) => Number(d.level) === levelFilter)
    : data;

  const columns = [
    {
      title: "Tên bài lesson",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => getReadingNumber(a.title) - getReadingNumber(b.title),
      defaultSortOrder: "ascend",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (val) =>
        LEVEL_OPTIONS.find((o) => o.value === Number(val))?.label || val,
      filters: LEVEL_OPTIONS.map((o) => ({ text: o.label, value: o.value })),
      onFilter: (value, record) => Number(record.level) === value,
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
      render: (_, record) => (
        <Space>
          <Tooltip title="Quản lý chi tiết">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/reading/${record.id}/manage`)}
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
            title="Bạn có chắc muốn xoá bài lesson này?"
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
        <h2 className="text-xl font-bold">Danh sách bài Reading Lesson</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Tạo bài lesson mới
        </Button>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <span>Lọc theo Level: </span>
        <Select
          allowClear
          placeholder="Chọn level"
          style={{ width: 180 }}
          options={LEVEL_OPTIONS}
          value={levelFilter ?? undefined}
          onChange={(val) => setLevelFilter(val ?? null)}
        />
        {levelFilter && (
          <Button onClick={() => setLevelFilter(null)}>Bỏ lọc</Button>
        )}
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        bordered
      />

      {/* Modal thêm bài lesson */}
      <Modal
        title="Tạo bài Reading Lesson mới"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="title"
            label="Tên bài lesson"
            rules={[{ required: true, message: "Không được bỏ trống tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Không được bỏ trống level!" }]}
          >
            <Select options={LEVEL_OPTIONS} placeholder="Chọn level" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian làm bài (phút)"
            rules={[{ required: true, message: "Không được bỏ trống thời gian!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tuỳ chọn)">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa bài lesson */}
      <Modal
        title="Chỉnh sửa bài lesson"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setCurrentEdit(null);
        }}
        onOk={() => editForm.submit()}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="title"
            label="Tên bài lesson"
            rules={[{ required: true, message: "Không được bỏ trống tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Không được bỏ trống level!" }]}
          >
            <Select options={LEVEL_OPTIONS} placeholder="Chọn level" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian làm bài (phút)"
            rules={[{ required: true, message: "Không được bỏ trống thời gian!" }]}
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
