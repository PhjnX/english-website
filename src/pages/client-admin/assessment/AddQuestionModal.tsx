// src/pages/client-admin/assessment/_components/AddQuestionModal.tsx
import React, { useState } from "react";
import { Modal, Form, Select, Input, message } from "antd";

const { TextArea } = Input;

interface AddQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string>("");

  const handleFinish = (values: any) => {
    const payload: any = {
      ...values,
      options: values.options
        ? JSON.stringify(values.options.split("\n").map((opt) => opt.trim()))
        : undefined,
      correctAnswer: values.correctAnswer?.trim(),
      paragraphHeading: values.paragraphHeading,
    };
    onSubmit(payload);
    form.resetFields();
    onClose();
    message.success("✅ Đã thêm câu hỏi");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      title="➕ Thêm câu hỏi mới"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={(changed) => {
          if (changed.type) setType(changed.type);
        }}
      >
        <Form.Item name="type" label="Loại câu hỏi" rules={[{ required: true }]}>
          <Select placeholder="Chọn loại câu hỏi">
            <Select.Option value="multiple-choice">Multiple Choice</Select.Option>
            <Select.Option value="paragraph">Paragraph</Select.Option>
            <Select.Option value="matching">Matching</Select.Option>
            <Select.Option value="true-false-notgiven">True/False/Not Given</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="questionText" label="Câu hỏi chính" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>

        {type === "multiple-choice" && (
          <>
            <Form.Item name="options" label="Lựa chọn (mỗi dòng 1 lựa chọn)">
              <TextArea placeholder="A. option1\nB. option2\n..." />
            </Form.Item>
            <Form.Item name="correctAnswer" label="Đáp án đúng (A, B, C...)">
              <Input />
            </Form.Item>
            <Form.Item name="explanation" label="Giải thích (tùy chọn)">
              <TextArea />
            </Form.Item>
          </>
        )}

        {type === "paragraph" && (
          <>
            <Form.Item name="paragraphHeading" label="Heading đoạn văn (nếu có)">
              <TextArea />
            </Form.Item>
            <Form.Item name="correctAnswer" label="Đáp án (mỗi dòng 1 từ)">
              <TextArea />
            </Form.Item>
          </>
        )}

        {type === "matching" && (
          <>
            <Form.Item name="options" label="Tùy chọn (mỗi dòng)">
              <TextArea placeholder="A. Name\nB. Place..." />
            </Form.Item>
            <Form.Item name="correctAnswer" label="Đáp án (mỗi dòng A, B...)">
              <TextArea />
            </Form.Item>
          </>
        )}

        {type === "true-false-notgiven" && (
          <>
            <Form.Item name="options" label="Danh sách câu hỏi (mỗi dòng)">
              <TextArea />
            </Form.Item>
            <Form.Item name="correctAnswer" label="Đáp án (mỗi dòng TRUE/FALSE/NOT GIVEN)">
              <TextArea />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AddQuestionModal;
