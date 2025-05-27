import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

const { TextArea } = Input;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const AddReadingQuestionModal: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch {
      // validation failed
    }
  };

  return (
    <Modal
      title={initialValues ? "Sửa câu hỏi" : "Thêm câu hỏi"}
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={initialValues ? "Cập nhật" : "Thêm"}
      cancelText="Huỷ"
      destroyOnClose
    >
      <Form layout="vertical" form={form} initialValues={initialValues}>
        {/* Nội dung câu hỏi */}
        <Form.Item
          label="Nội dung câu hỏi (TRUE/FALSE/NOT GIVEN)"
          name="question_text"
          rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
        >
          <TextArea placeholder="Eg: The statement ..." rows={3} />
        </Form.Item>

        {/* Đáp án đúng */}
        <Form.Item
          label="Đáp án đúng (TRUE, FALSE hoặc NOT GIVEN)"
          name="correct_answer"
          rules={[
            { required: true, message: "Vui lòng nhập đáp án đúng" },
            {
              validator: (_, value) => {
                const v = (value || "").toUpperCase().trim();
                if (["TRUE", "FALSE", "NOT GIVEN"].includes(v)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Nhập: TRUE hoặc FALSE hoặc NOT GIVEN")
                );
              },
            },
          ]}
        >
          <Input placeholder="TRUE" />
        </Form.Item>

        {/* Giải thích đáp án */}
        <Form.Item
          label="Giải thích đáp án (bắt buộc)"
          name="explanation"
          rules={[{ required: true, message: "Vui lòng nhập phần giải thích đáp án" }]}
        >
          <TextArea placeholder="Nhập giải thích đáp án..." rows={4} />
        </Form.Item>

        {/* Tiêu đề đoạn văn */}
        <Form.Item label="Tiêu đề đoạn văn (nếu có)" name="paragraph_heading">
          <Input placeholder="Ví dụ: Aboriginal influence" />
        </Form.Item>

        {/* Tham chiếu dòng */}
        <Form.Item label="Tham chiếu dòng (nếu có)" name="line_reference">
          <Input placeholder="Ví dụ: đoạn 2, dòng 5" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddReadingQuestionModal;
