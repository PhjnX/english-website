import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Modal,
  Select,
  Checkbox,
  Divider,
} from "antd";
import { useParams } from "react-router-dom";
import {
  getAllAssessments,
  createPart,
  createGroup,
  createQuestion,
  updatePart,
  updateGroup,
  updateQuestion,
  deletePart,
  deleteGroup,
  deleteQuestion,
} from "../../../apis/assessment-api";
import PartCard from "./_components/PartCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;

export default function ManageAssessmentPage() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState<any>(null);

  const [createPartForm] = Form.useForm();
  const [editPartForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [questionForm] = Form.useForm();

  // Modal Thêm Part
  const [isAddPartModalOpen, setAddPartModalOpen] = useState(false);

  const [editPart, setEditPart] = useState<any>(null);
  const [isEditPartModalOpen, setEditPartModalOpen] = useState(false);

  const [editGroup, setEditGroup] = useState<any>(null);
  const [isEditGroupModalOpen, setEditGroupModalOpen] = useState(false);

  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [assessmentId]);

  const loadData = async () => {
    try {
      const data = await getAllAssessments();
      const found = data.find((a: any) => a.id === Number(assessmentId));
      setAssessment(found);
    } catch {
      toast.error("Không thể tải bài test!");
    }
  };

  // --- PART ---
  const handleCreatePart = async (values: any) => {
    try {
      await createPart(Number(assessmentId), values);
      toast.success("Tạo Part thành công");
      setAddPartModalOpen(false); // Đóng modal sau khi thêm
      loadData();
      createPartForm.resetFields();
    } catch {
      toast.error("Lỗi khi tạo Part");
    }
  };

  const handleEditPart = (part: any) => {
    setEditPart(part);
    setEditPartModalOpen(true);
    editPartForm.setFieldsValue(part);
  };

  const handleUpdatePart = async (values: any) => {
    try {
      await updatePart(editPart.id, values);
      setEditPartModalOpen(false);
      toast.success("Cập nhật Part thành công");
      loadData();
    } catch {
      toast.error("Lỗi khi cập nhật Part");
    }
  };

  const handleDeletePart = async (id: number) => {
    try {
      await deletePart(id);
      toast.success("Đã xoá Part");
      loadData();
    } catch {
      toast.error("Không thể xoá Part");
    }
  };

  // --- GROUP ---
  const handleAddGroup = (partId: number) => {
    setSelectedPartId(partId);
    setEditGroup(null);
    setEditGroupModalOpen(true);
    groupForm.resetFields();
  };

  const handleEditGroup = (group: any) => {
    setEditGroup(group);
    setEditGroupModalOpen(true);
    groupForm.setFieldsValue(group);
  };

  const handleUpdateGroup = async (values: any) => {
    try {
      const transformedQuestions = values.questions?.map((q: any) => ({
        ...q,
        options: q.options
          ? q.options
              .split("\n")
              .map((opt: string) => opt.trim())
              .filter((opt: string) => opt !== "")
          : [],
      }));

      const payload = { ...values, questions: transformedQuestions };
      if (editGroup) {
        await updateGroup(editGroup.id, payload);
        toast.success("Cập nhật Group thành công");
      } else {
        await createGroup(Number(selectedPartId), payload);
        toast.success("Tạo Group thành công");
      }
      setEditGroup(null);
      setEditGroupModalOpen(false);
      loadData();
    } catch {
      toast.error("Lỗi khi xử lý Group");
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
      toast.success("Đã xoá Group");
      loadData();
    } catch {
      toast.error("Không thể xoá Group");
    }
  };

  // --- QUESTION ---
  const handleAddQuestion = (groupId: number, type: string) => {
    setSelectedGroupId(groupId);
    setQuestionType(type);
    setEditQuestion(null);
    questionForm.resetFields();
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: any, type: string) => {
    setEditQuestion(question);
    setQuestionType(type);
    setQuestionModalOpen(true);
    questionForm.setFieldsValue({
      ...question,
      options: question.options ? JSON.parse(question.options).join("\n") : "",
    });
  };

  const handleSubmitQuestion = async (values: any) => {
    try {
      // Validate trước
      if (!values.correctAnswer || values.correctAnswer.trim() === "") {
        toast.error("Bạn chưa nhập đáp án đúng!");
        return;
      }

      // Chuẩn hóa đáp án
      let parsedCorrectAnswer: any = [];

      try {
        const raw = values.correctAnswer.trim();
        if (raw.startsWith("[") && raw.endsWith("]")) {
          parsedCorrectAnswer = JSON.parse(raw);
        } else {
          parsedCorrectAnswer = [raw]; // Chuỗi thường, wrap lại thành mảng
        }
      } catch (e) {
        parsedCorrectAnswer = [values.correctAnswer.trim()];
      }

      // Chuẩn hóa options nếu có
      const formattedOptions = values.options
        ? JSON.stringify(
            values.options
              .split("\n")
              .map((opt: string) => opt.trim())
              .filter(Boolean)
          )
        : undefined;

      const payload = {
        ...values,
        type: questionType,
        options: formattedOptions,
        correctAnswer: JSON.stringify(parsedCorrectAnswer),
      };

      if (editQuestion) {
        await updateQuestion(editQuestion.id, payload);
        toast.success("Cập nhật câu hỏi thành công");
      } else {
        await createQuestion(Number(selectedGroupId), payload);
        toast.success("Tạo câu hỏi thành công");
      }

      setEditQuestion(null);
      setQuestionModalOpen(false);
      loadData();
    } catch (error) {
      console.error("❌ Lỗi khi submit câu hỏi:", error);
      toast.error("Lỗi khi xử lý câu hỏi");
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteQuestion(questionId);
      toast.success("Đã xoá câu hỏi");
      loadData();
    } catch {
      toast.error("Không thể xoá câu hỏi");
    }
  };

  // --- Form câu hỏi động ---
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
              extra="Nhập mỗi đáp án 1 dòng, ví dụ: A. Option 1"
            >
              <TextArea
                rows={4}
                placeholder={`A. ...\nB. ...\nC. ...\nD. ...`}
              />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label='Đáp án đúng (A, B, C hoặc D) - Nhập dạng mảng JSON. VD: ["C"] hoặc ["A", "B"] nếu nhiều đáp án'
              rules={[{ required: true }]}
              extra='Nhập: ["C"] hoặc ["A","B"] nếu nhiều đáp án'
            >
              <Input placeholder='VD: ["C"] hoặc ["A","B"]' />
            </Form.Item>
            <Form.Item name="explanation" label="Giải thích (tùy chọn)">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="paragraphHeading"
              label="Tiêu đề đoạn văn (nếu có)"
            >
              <Input />
            </Form.Item>
            <Form.Item name="lineReference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item
              name="showAnswer"
              label="Hiện đáp án sau khi nộp"
              valuePropName="checked"
            >
              <Checkbox />
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
              label="Đáp án (mỗi dòng 1 từ đúng cho từng chỗ trống, nhiều đáp án đúng cho 1 chỗ dùng | ngăn cách)"
              rules={[{ required: true }]}
              extra="VD: Paris\n1999|2000\nbanana|an banana"
            >
              <TextArea rows={3} placeholder={`VD:\nParis\n1999|2000`} />
            </Form.Item>
            <Form.Item name="explanation" label="Giải thích (tùy chọn)">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="paragraphHeading"
              label="Tiêu đề đoạn văn (nếu có)"
            >
              <Input />
            </Form.Item>
            <Form.Item name="lineReference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item
              name="showAnswer"
              label="Hiện đáp án sau khi nộp"
              valuePropName="checked"
            >
              <Checkbox />
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
              extra="Mỗi lựa chọn 1 dòng. VD: A. Name 1"
            >
              <TextArea rows={4} placeholder={`A. ...\nB. ...\nC. ...`} />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label='Đáp án - Nhập dạng mảng JSON theo thứ tự câu hỏi. VD: ["E","A","C","B"]'
              rules={[{ required: true }]}
              extra='Nhập: ["E","A","C","B"]'
            >
              <Input placeholder='VD: ["E","A","C","B"]' />
            </Form.Item>
            <Form.Item name="explanation" label="Giải thích (tùy chọn)">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="paragraphHeading"
              label="Tiêu đề đoạn văn (nếu có)"
            >
              <Input />
            </Form.Item>
            <Form.Item name="lineReference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item
              name="showAnswer"
              label="Hiện đáp án sau khi nộp"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </>
        );
      case "true-false-notgiven":
        return (
          <>
            <Form.Item
              name="questionText"
              label="Nội dung câu hỏi (TRUE/FALSE/NOT GIVEN) - Mỗi câu là 1 entry"
              extra="Chỉ nhập 1 câu hỏi cho mỗi lần thêm!"
            >
              <TextArea rows={2} placeholder="Eg: The statement ..." />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label="Đáp án đúng (nhập: TRUE, FALSE hoặc NOT GIVEN, chỉ 1 đáp án)"
              rules={[{ required: true }]}
              extra="Nhập: TRUE hoặc FALSE hoặc NOT GIVEN"
            >
              <Input placeholder="TRUE" />
            </Form.Item>
            <Form.Item name="explanation" label="Giải thích (tùy chọn)">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="paragraphHeading"
              label="Tiêu đề đoạn văn (nếu có)"
            >
              <Input />
            </Form.Item>
            <Form.Item name="lineReference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item
              name="showAnswer"
              label="Hiện đáp án sau khi nộp"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </>
        );
      case "gap-fill":
        return (
          <>
            <Form.Item
              name="questionText"
              label="Nội dung câu hỏi (ghi rõ chỗ trống bằng ____ hoặc [blank]) - Mỗi câu 1 entry!"
              rules={[{ required: true }]}
              extra="VD: Supermarkets want fruit and vegetables to be standard in their ____."
            >
              <TextArea
                rows={3}
                placeholder="Supermarkets want fruit and vegetables to be standard in their ____."
              />
            </Form.Item>
            <Form.Item
              name="correctAnswer"
              label="Đáp án đúng (chỉ 1 đáp án, hoặc nhiều đáp án dùng | ngăn cách). VD: appearance hoặc 1999|2000"
              rules={[{ required: true }]}
              extra="Nhập: appearance hoặc 1999|2000 nếu nhiều đáp án đúng"
            >
              <Input placeholder="appearance" />
            </Form.Item>
            <Form.Item name="explanation" label="Giải thích (tùy chọn)">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="paragraphHeading"
              label="Tiêu đề đoạn văn (nếu có)"
            >
              <Input />
            </Form.Item>
            <Form.Item name="lineReference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item
              name="showAnswer"
              label="Hiện đáp án sau khi nộp"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-900">
        Assessment - {assessment?.name}
      </h2>

      {/* Nút + Modal Thêm Part */}
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setAddPartModalOpen(true)}>
          Thêm Part mới
        </Button>
      </div>
      <Modal
        title="Thêm Part mới"
        open={isAddPartModalOpen}
        onCancel={() => setAddPartModalOpen(false)}
        onOk={() => createPartForm.submit()}
        okText="Tạo Part"
        cancelText="Huỷ"
      >
        <Form
          layout="vertical"
          form={createPartForm}
          onFinish={handleCreatePart}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Tiêu đề Part"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="instructions" label="Hướng dẫn (optional)">
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 2 }} />
            </Form.Item>
            <Form.Item name="order" label="Thứ tự" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="titleDescription" label="Gợi ý tiêu đề (optional)">
              <Input />
            </Form.Item>
            <Form.Item name="headerContent" label="Tiêu đề đoạn văn">
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="content" label="Nội dung đoạn văn">
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      <Divider className="my-6" />
      <div className="space-y-8">
        {assessment?.parts?.map((part: any) => (
          <PartCard
            key={part.id}
            part={part}
            onEditPart={handleEditPart}
            onDeletePart={handleDeletePart}
            onAddGroup={handleAddGroup}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            onAddQuestion={handleAddQuestion}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </div>

      {/* Modal sửa Part */}
      <Modal
        title="Sửa Part"
        open={isEditPartModalOpen}
        onCancel={() => setEditPartModalOpen(false)}
        onOk={() => editPartForm.submit()}
      >
        <Form layout="vertical" form={editPartForm} onFinish={handleUpdatePart}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="order" label="Thứ tự" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="titleDescription" label="Gợi ý tiêu đề (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="headerContent" label="Tiêu đề đoạn văn (heading)">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung đoạn văn">
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm/sửa Group */}
      <Modal
        title={editGroup ? "Sửa Group" : "Thêm Group"}
        open={isEditGroupModalOpen}
        onCancel={() => setEditGroupModalOpen(false)}
        onOk={() => groupForm.submit()}
      >
        <Form layout="vertical" form={groupForm} onFinish={handleUpdateGroup}>
          <Form.Item
            name="heading"
            label="Tiêu đề nhóm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="questionType"
            label="Loại câu hỏi"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="multiple-choice">
                Multiple Choice
              </Select.Option>
              <Select.Option value="paragraph">Paragraph</Select.Option>
              <Select.Option value="matching">Matching</Select.Option>
              <Select.Option value="true-false-notgiven">
                True/False/Not Given
              </Select.Option>
              <Select.Option value="gap-fill">
                Gap-fill (Điền từ/chỗ trống)
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startNumber"
            label="Từ câu số"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="endNumber"
            label="Đến câu số"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm/Sửa Câu hỏi */}
      <Modal
        title={editQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi"}
        open={isQuestionModalOpen}
        onCancel={() => setQuestionModalOpen(false)}
        onOk={() => questionForm.submit()}
      >
        <Form
          layout="vertical"
          form={questionForm}
          onFinish={handleSubmitQuestion}
        >
          {renderQuestionFields()}
        </Form>
      </Modal>

      <ToastContainer position="top-right" autoClose={1800} />
    </div>
  );
}
