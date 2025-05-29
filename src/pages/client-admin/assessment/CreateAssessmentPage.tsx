import { Button, Form, Input } from "antd";
import { createAssessment } from "../../../apis/assessment-api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateAssessmentPage() {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await createAssessment(values);
      toast.success("✅ Tạo bài test thành công!");
      form.resetFields();
    } catch (err) {
      toast.error("❌ Lỗi khi tạo bài test");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tạo bài test mới</h2>
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
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
          rules={[{ required: true, message: "Không được bỏ trống trình độ!" }]}
        >
          <Input />
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

        <Button htmlType="submit" type="primary">
          Tạo bài test
        </Button>
      </Form>
      <ToastContainer position="top-right" autoClose={1800} />
    </div>
  );
}
