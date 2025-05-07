import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Divider,
  Select,
  Table,
  Modal,
} from "antd";
import {
  createPart,
  createGroup,
  createQuestion,
  getAllAssessments,
} from "../../../apis/assessment-api";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

export default function ManageAssessmentPage() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [form] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllAssessments();
        const found = data.find((a: any) => a.id === Number(assessmentId));
        setAssessment(found);
      } catch (err) {
        message.error("Không thể tải bài test!");
      }
    })();
  }, [assessmentId]);

  const handleCreatePart = async (values: any) => {
    try {
      await createPart(Number(assessmentId), {
        ...values,
        order: Number(values.order),
      });
      message.success("Tạo Part thành công");
      window.location.reload();
    } catch {
      message.error("Lỗi khi tạo Part");
    }
  };

  const handleCreateGroup = async (values: any) => {
    try {
      await createGroup(Number(selectedPartId), values);
      message.success("Tạo Group thành công");
      setGroupModalOpen(false);
      window.location.reload();
    } catch {
      message.error("Lỗi khi tạo Group");
    }
  };

  const handleCreateQuestion = async (values: any) => {
    try {
      const payload = {
        ...values,
        groupId: Number(selectedGroupId),
        type: questionType,
        options:
          values.options && Array.isArray(values.options)
            ? JSON.stringify(values.options)
            : values.options
              ? JSON.stringify(values.options.split("\n"))
              : undefined,
        correctAnswer:
          values.correctAnswer &&
          Array.isArray(values.correctAnswer)
            ? JSON.stringify(values.correctAnswer)
            : values.correctAnswer,
      };
      await createQuestion(Number(selectedGroupId), payload);
      message.success("Tạo câu hỏi thành công");
      setQuestionModalOpen(false);
      questionForm.resetFields();
    } catch {
      message.error("Lỗi khi tạo câu hỏi");
    }
  };

  const renderQuestionFields = () => {
    switch (questionType) {
      case "multiple-choice":
        return (
          <>
            <Form.Item name="questionText" label="Nội dung câu hỏi">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="options"
              label="Các lựa chọn (mỗi dòng 1 lựa chọn)"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label="Đáp án đúng (A, B, C hoặc D)"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        );
      case "paragraph":
        return (
          <>
            <Form.Item name="questionText" label="Đoạn văn có chỗ trống">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label="Đáp án (mỗi dòng 1 từ)"
              rules={[{ required: true }]}
            >
              <TextArea rows={3} />
            </Form.Item>
          </>
        );
      case "matching":
        return (
          <>
            <Form.Item name="questionText" label="Mô tả matching">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="options"
              label="Danh sách tuỳ chọn (mỗi dòng 1 tuỳ chọn)"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
label='Đáp án (VD: ["A", "B"])'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        );
      case "true-false-notgiven":
        return (
          <>
            <Form.Item name="questionText" label="Danh sách câu hỏi">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label="Đáp án (TRUE/FALSE/NOT GIVEN)"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Quản lý bài test: {assessment?.name}
      </h2>

      <Card title="Thêm Part mới" className="mb-6">
        <Form layout="vertical" form={form} onFinish={handleCreatePart}>
          <Form.Item name="title" label="Tiêu đề Part" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn (optional)">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="order" label="Thứ tự" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Tạo Part
          </Button>
        </Form>
      </Card>

      {assessment?.parts?.map((part: any) => (
        <Card key={part.id} title={part.title} className="mb-6">
          <p>Hướng dẫn: {part.instructions}</p>
          <Button
            type="dashed"
            onClick={() => {
              setSelectedPartId(part.id);
              setGroupModalOpen(true);
            }}
          >
            ➕ Thêm Group
          </Button>

          {part.groups?.map((group: any) => (
            <Card
              type="inner"
              title={group.heading}
              key={group.id}
              className="mt-4"
              extra={
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setQuestionModalOpen(true);
                    setQuestionType(group.questionType);
                  }}
                >
                  ➕ Thêm Câu hỏi
                </Button>
              }
            >
              <p>Loại: {group.questionType}</p>
              <p>Số câu: {group.startNumber} - {group.endNumber}</p>
              <Table
                dataSource={group.questions}
                columns={[
                  { title: "Câu hỏi", dataIndex: "questionText" },
                  { title: "Đáp án", dataIndex: "correctAnswer" },
                ]}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          ))}
        </Card>
      ))}

      {/* Modal Thêm Group */}
      <Modal
        title="Thêm Group"
        open={isGroupModalOpen}
        onCancel={() => setGroupModalOpen(false)}
        onOk={() => groupForm.submit()}
      >
        <Form layout="vertical" form={groupForm} onFinish={handleCreateGroup}>
          <Form.Item name="heading" label="Tiêu đề nhóm câu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="questionType" label="Loại câu hỏi" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="multiple-choice">Multiple Choice</Select.Option>
              <Select.Option value="paragraph">Paragraph</Select.Option>
              <Select.Option value="matching">Matching</Select.Option>
              <Select.Option value="true-false-notgiven">True/False/Not Given</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="startNumber" label="Từ câu số" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="endNumber" label="Đến câu số" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm Câu hỏi */}
      <Modal
        title="Thêm Câu hỏi"
        open={isQuestionModalOpen}
        onCancel={() => setQuestionModalOpen(false)}
        onOk={() => questionForm.submit()}
      >
        <Form layout="vertical" form={questionForm} onFinish={handleCreateQuestion}>
          {renderQuestionFields()}
          <Form.Item name="explanation" label="Giải thích">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
