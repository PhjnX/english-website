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
  message, // Giữ lại message nếu bạn dùng, hoặc thay bằng toast nếu chỉ dùng toast
} from "antd";
import { useParams } from "react-router-dom";
import {
  getAllReadingTests,
  createReadingPart,
  createReadingGroup,
  createReadingQuestion,
  updateReadingPart,
  updateReadingGroup,
  updateReadingQuestion,
  deleteReadingPart,
  deleteReadingGroup,
  deleteReadingQuestion,
} from "../../../apis/reading-api";
import ReadingPartCard from "./_components/ReadingPartCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;

export default function ManageReadingTestPage() {
  const { readingTestId } = useParams();
  const [readingTest, setReadingTest] = useState<any>(null);

  const [createPartForm] = Form.useForm();
  const [editPartForm] = Form.useForm();
  const [groupForm] = Form.useForm(); // Form cho việc thêm/sửa group
  const [questionForm] = Form.useForm();

  const [isAddPartModalOpen, setAddPartModalOpen] = useState(false);

  const [editPart, setEditPart] = useState<any>(null);
  const [isEditPartModalOpen, setEditPartModalOpen] = useState(false);

  const [editGroup, setEditGroup] = useState<any>(null); // State cho group đang sửa
  const [isEditGroupModalOpen, setEditGroupModalOpen] = useState(false); // State mở/đóng modal group

  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null); // ID của Part khi thêm Group
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<string>("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [readingTestId]);

  const loadData = async () => {
    try {
      const data = await getAllReadingTests();
      const found = data.find((a: any) => a.id === Number(readingTestId));
      setReadingTest(found);
    } catch {
      toast.error("Không thể tải bài lesson!");
    }
  };

  // --- PART ---
  const handleCreatePart = async (values: any) => {
    try {
      const payload = {
        ...values,
        order_num: values.order_num !== undefined ? Number(values.order_num) : null, // Sửa lại key order_num và đảm bảo là số
      };
      // delete payload.order; // Nếu không có field 'order' thì không cần xóa
      await createReadingPart(Number(readingTestId), payload);
      toast.success("Tạo Part thành công");
      setAddPartModalOpen(false);
      loadData();
      createPartForm.resetFields();
    } catch(error) {
      console.error("Lỗi khi tạo Part:", error);
      toast.error("Lỗi khi tạo Part");
    }
  };
  

  const handleEditPart = (part: any) => {
    setEditPart(part);
    setEditPartModalOpen(true);
    // Đảm bảo gán đúng giá trị cho order_num nếu tên field trong form là order_num
    editPartForm.setFieldsValue({
        ...part,
        order_num: part.order_num // Hoặc part.order nếu tên field trong form là order
    });
  };

  const handleUpdatePart = async (values: any) => {
    try {
      const payload = {
        ...values,
        order_num: values.order_num !== undefined ? Number(values.order_num) : null, // Sửa lại key order_num
      };
      // delete payload.order; // Nếu không có field 'order' thì không cần xóa
      await updateReadingPart(editPart.id, payload);
      setEditPartModalOpen(false);
      toast.success("Cập nhật Part thành công");
      loadData();
    } catch(error) {
      console.error("Lỗi khi cập nhật Part:", error);
      toast.error("Lỗi khi cập nhật Part");
    }
  };

  const handleDeletePart = async (id: number) => {
    try {
      await deleteReadingPart(id);
      toast.success("Đã xoá Part");
      loadData();
    } catch {
      toast.error("Không thể xoá Part");
    }
  };

  // --- GROUP ---
  const handleAddGroup = (partId: number) => {
    setSelectedPartId(partId); // Lưu partId để biết group này thuộc part nào
    setEditGroup(null); // Đảm bảo đang ở chế độ thêm mới
    groupForm.resetFields(); // Xóa các giá trị cũ trên form
    setEditGroupModalOpen(true); // Mở modal
  };

  const handleEditGroup = (group: any) => {
    setEditGroup(group); // Đặt group cần sửa
    setSelectedPartId(group.reading_part_id); // Lưu partId nếu cần
    // Đảm bảo map đúng tên field từ object group sang form
    // Ví dụ: nếu group.question_type là snake_case và form field là questionType (camelCase)
    groupForm.setFieldsValue({
        heading: group.heading,
        questionType: group.question_type || group.questionType, // Ưu tiên snake_case từ DB
        startNumber: group.start_number || group.startNumber,
        endNumber: group.end_number || group.endNumber,
    });
    setEditGroupModalOpen(true); // Mở modal
  };

  // Hàm xử lý chính cho việc Tạo hoặc Cập nhật Group
  const handleUpdateGroup = async (formValues: any) => {
    // formValues ở đây là giá trị từ groupForm, ví dụ:
    // { heading: "...", questionType: "...", startNumber: "...", endNumber: "..." }

    // Chuyển đổi payload để gửi lên backend với snake_case keys
    const payloadForBackend = {
      heading: formValues.heading,
      question_type: formValues.questionType, // Chuyển từ questionType (form) sang question_type (DTO)
      // Đảm bảo startNumber và endNumber là kiểu số
      start_number: formValues.startNumber !== undefined ? Number(formValues.startNumber) : null,
      end_number: formValues.endNumber !== undefined ? Number(formValues.endNumber) : null,
    };

    try {
      if (editGroup && editGroup.id) { // Nếu có editGroup và id của nó -> đang Sửa
        await updateReadingGroup(editGroup.id, payloadForBackend);
        toast.success("Cập nhật Group thành công");
      } else if (selectedPartId !== null) { // Nếu không có editGroup và có selectedPartId -> đang Thêm mới
        await createReadingGroup(selectedPartId, payloadForBackend);
        toast.success("Tạo Group thành công");
      } else {
        toast.error("Không xác định được Part ID để tạo Group.");
        return;
      }
      setEditGroup(null); // Reset trạng thái sửa
      setEditGroupModalOpen(false); // Đóng modal
      loadData(); // Tải lại dữ liệu để cập nhật UI
      groupForm.resetFields(); // Reset form sau khi thành công
    } catch (error) {
      console.error("Lỗi khi xử lý Group:", error);
      toast.error("Lỗi khi xử lý Group");
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteReadingGroup(groupId);
      toast.success("Đã xoá Group");
      loadData();
    } catch {
      toast.error("Không thể xoá Group");
    }
  };

  // --- QUESTION ---
  const handleAddQuestion = (groupId: number, type: string) => {
    setSelectedGroupId(Number(groupId)); // Sửa tại đây
    setQuestionType(type);
    setEditQuestion(null);
    questionForm.resetFields();
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: any, type: string) => {
    setEditQuestion(question);
    setQuestionType(type);
    // Chuyển đổi options từ chuỗi JSON (nếu có) thành chuỗi nhiều dòng cho TextArea
    const optionsForForm = question.options ? JSON.parse(question.options).join("\n") : "";
    // Đảm bảo các tên trường từ `question` object khớp với `name` của Form.Item
    questionForm.setFieldsValue({
      ...question, // Giữ lại các trường khác
      question_text: question.question_text || question.questionText, // Xử lý cả snake_case và camelCase
      correct_answer: question.correct_answer || question.correctAnswer,
      options: optionsForForm,
      // Các trường khác tương tự nếu có sự khác biệt về casing
    });
    setQuestionModalOpen(true);
  };

  const handleSubmitQuestion = async (values: any) => {
  try {
    const payload = {
      ...values,
      type: questionType,
      options: values.options
        ? JSON.stringify(values.options.split("\n").map((opt: string) => opt.trim()).filter((opt: string) => opt))
        : undefined,
    };

    const finalPayload = {
      question_text: values.question_text || values.questionText,
      options: payload.options,
      correct_answer: values.correct_answer || values.correctAnswer,
      explanation: values.explanation,
      type: payload.type,
      paragraph_heading: values.paragraph_heading,
      line_reference: values.line_reference,
      show_answer: values.show_answer !== undefined ? values.show_answer : true,
      order_num: values.order_num ? Number(values.order_num) : null,
    };

    if (editQuestion && editQuestion.id) {
      await updateReadingQuestion(editQuestion.id, finalPayload);
      toast.success("Cập nhật câu hỏi thành công");
    } else if (selectedGroupId !== null) {
      await createReadingQuestion(Number(selectedGroupId), finalPayload); // Sửa tại đây
      toast.success("Tạo câu hỏi thành công");
    } else {
      toast.error("Không xác định được Group ID để tạo câu hỏi.");
      return;
    }
    setEditQuestion(null);
    setQuestionModalOpen(false);
    loadData();
    questionForm.resetFields();
  } catch (error) {
    console.error("Lỗi khi xử lý câu hỏi:", error);
    toast.error("Lỗi khi xử lý câu hỏi");
  }
};

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteReadingQuestion(questionId);
      toast.success("Đã xoá câu hỏi");
      loadData();
    } catch {
      toast.error("Không thể xoá câu hỏi");
    }
  };

  // --- Form câu hỏi động ---
  // Trong renderQuestionFields, đảm bảo các <Form.Item name="..."> sử dụng tên nhất quán
  // Ví dụ, nếu DTO backend là question_text, thì name="question_text"
  const renderQuestionFields = () => {
    // Ví dụ cho true-false-notgiven, đảm bảo name="question_text", name="correct_answer"
    switch (questionType) {
      case "multiple-choice":
        return (
          <>
            <Form.Item name="question_text" label="Nội dung câu hỏi" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="options"
              label="Các lựa chọn (mỗi dòng 1 lựa chọn)"
              extra="Nhập mỗi đáp án 1 dòng, ví dụ: A. Option 1"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} placeholder={`A. ...\nB. ...\nC. ...\nD. ...`} />
            </Form.Item>
            <Form.Item
              name="correct_answer" // snake_case
              label='Đáp án đúng - Nhập dạng mảng JSON. VD: ["C"] hoặc ["A", "B"] nếu nhiều đáp án'
              rules={[{ required: true }]}
              extra='Nhập: ["C"] hoặc ["A","B"] nếu nhiều đáp án'
            >
              <Input placeholder='VD: ["C"] hoặc ["A","B"]' />
            </Form.Item>
            <Form.Item
              name="explanation"
              label="Giải thích đáp án (bắt buộc)"
              rules={[{ required: true, message: "Phải nhập giải thích đáp án" }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="paragraph_heading" // snake_case
              label="Tiêu đề đoạn văn (nếu có)"
            >
              <Input />
            </Form.Item>
            <Form.Item name="line_reference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item
              name="show_answer" // snake_case
              label="Hiện đáp án sau khi nộp"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox />
            </Form.Item>
          </>
        );
      case "paragraph": // Điền vào đoạn văn (nhiều chỗ trống)
        return (
          <>
            <Form.Item name="question_text" label="Đoạn văn có chỗ trống (dùng ____ cho mỗi chỗ trống)" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="correct_answer" // snake_case
              label="Đáp án (mỗi dòng 1 từ đúng cho từng chỗ trống, nhiều đáp án đúng cho 1 chỗ dùng | ngăn cách)"
              rules={[{ required: true }]}
              extra="VD: Paris\n1999|2000\nbanana|an banana"
            >
              <TextArea rows={3} placeholder={`VD:\nParis\n1999|2000`} />
            </Form.Item>
             <Form.Item
              name="explanation"
              label="Giải thích đáp án (bắt buộc)"
              rules={[{ required: true, message: "Phải nhập giải thích đáp án" }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="paragraph_heading" label="Tiêu đề đoạn văn (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="line_reference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="show_answer" label="Hiện đáp án sau khi nộp" valuePropName="checked" initialValue={true}>
              <Checkbox />
            </Form.Item>
          </>
        );
      case "matching":
        return (
          <>
            <Form.Item name="question_text" label="Mô tả câu hỏi matching (ví dụ: Nối tên người với phát biểu)" rules={[{ required: true }]}>
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="options" // Đây là danh sách các lựa chọn (ví dụ: A. Person 1, B. Person 2)
              label="Danh sách các lựa chọn để nối (mỗi dòng 1 lựa chọn)"
              rules={[{ required: true }]}
              extra="Mỗi lựa chọn 1 dòng. VD: A. Name 1"
            >
              <TextArea rows={4} placeholder={`A. ...\nB. ...\nC. ...`} />
            </Form.Item>
            <Form.Item
              name="correct_answer" // snake_case. VD: ["C","A","B"] tương ứng với các câu hỏi ẩn trong question_text
              label='Đáp án - Nhập dạng mảng JSON theo thứ tự câu hỏi. VD: ["E","A","C","B"]'
              rules={[{ required: true }]}
              extra='Nhập: ["E","A","C","B"] (mỗi phần tử là key của options)'
            >
              <Input placeholder='VD: ["E","A","C","B"]' />
            </Form.Item>
            <Form.Item
              name="explanation"
              label="Giải thích đáp án (bắt buộc)"
              rules={[{ required: true, message: "Phải nhập giải thích đáp án" }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="paragraph_heading" label="Tiêu đề đoạn văn (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="line_reference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="show_answer" label="Hiện đáp án sau khi nộp" valuePropName="checked" initialValue={true}>
              <Checkbox />
            </Form.Item>
          </>
        );
      case "true-false-notgiven":
        return (
          <>
            <Form.Item
              name="question_text" // snake_case
              label="Nội dung câu hỏi (TRUE/FALSE/NOT GIVEN)"
              rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
              extra="Chỉ nhập 1 câu hỏi cho mỗi lần thêm!"
            >
              <TextArea rows={2} placeholder="Eg: The statement ..." />
            </Form.Item>
            <Form.Item
              name="correct_answer" // snake_case
              label="Đáp án đúng (nhập: TRUE, FALSE hoặc NOT GIVEN, chỉ 1 đáp án)"
              rules={[
                { required: true, message: "Vui lòng nhập đáp án" },
                {
                    validator: (_, value) => {
                        const v = (value || "").toUpperCase().trim();
                        if (["TRUE", "FALSE", "NOT GIVEN"].includes(v)) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error("Nhập: TRUE, FALSE hoặc NOT GIVEN"));
                    }
                }
              ]}
              extra="Nhập: TRUE hoặc FALSE hoặc NOT GIVEN"
            >
              <Input placeholder="TRUE" />
            </Form.Item>
            <Form.Item
              name="explanation"
              label="Giải thích đáp án (bắt buộc)"
              rules={[{ required: true, message: "Phải nhập giải thích đáp án" }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="paragraph_heading" label="Tiêu đề đoạn văn (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="line_reference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="show_answer" label="Hiện đáp án sau khi nộp" valuePropName="checked" initialValue={true}>
              <Checkbox />
            </Form.Item>
          </>
        );
      case "gap-fill": // Điền từ vào 1 chỗ trống
        return (
          <>
            <Form.Item
              name="question_text" // snake_case
              label="Nội dung câu hỏi (ghi rõ chỗ trống bằng ____ hoặc [blank]) - Mỗi câu 1 entry!"
              rules={[{ required: true }]}
              extra="VD: Supermarkets want fruit and vegetables to be standard in their ____."
            >
              <TextArea rows={3} placeholder="Supermarkets want fruit and vegetables to be standard in their ____." />
            </Form.Item>
            <Form.Item
              name="correct_answer" // snake_case
              label="Đáp án đúng (chỉ 1 đáp án, hoặc nhiều đáp án dùng | ngăn cách). VD: appearance hoặc 1999|2000"
              rules={[{ required: true }]}
              extra="Nhập: appearance hoặc 1999|2000 nếu nhiều đáp án đúng"
            >
              <Input placeholder="appearance" />
            </Form.Item>
            <Form.Item
              name="explanation"
              label="Giải thích đáp án (bắt buộc)"
              rules={[{ required: true, message: "Phải nhập giải thích đáp án" }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="paragraph_heading" label="Tiêu đề đoạn văn (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="line_reference" label="Tham chiếu dòng (nếu có)">
              <Input />
            </Form.Item>
            <Form.Item name="show_answer" label="Hiện đáp án sau khi nộp" valuePropName="checked" initialValue={true}>
              <Checkbox />
            </Form.Item>
          </>
        );
      default:
        return <p>Vui lòng chọn loại câu hỏi cho Group trước khi thêm câu hỏi.</p>;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={1800} newestOnTop />
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-900">
        Reading Lesson - {readingTest?.title} 
      </h2>
      
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setAddPartModalOpen(true)}>
          Thêm Part mới
        </Button>
      </div>
      <Modal
        title="Thêm Part mới"
        open={isAddPartModalOpen}
        onCancel={() => { createPartForm.resetFields(); setAddPartModalOpen(false);}}
        onOk={() => createPartForm.submit()}
        okText="Tạo Part"
        cancelText="Huỷ"
        destroyOnClose // Thêm để reset form khi đóng modal
      >
        <Form
          layout="vertical"
          form={createPartForm}
          onFinish={handleCreatePart}
          initialValues={{ order_num: readingTest?.reading_part?.length ? readingTest.reading_part.length + 1 : 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Tiêu đề Part"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề Part" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="instructions"
              label="Hướng dẫn (optional)"
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 2 }} />
            </Form.Item>
            <Form.Item
                name="order_num" // Đổi tên thành order_num
              label="Thứ tự"
              rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="titleDescription"
              label="Gợi ý tiêu đề (optional)"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="headerContent"
              label="Tiêu đề đoạn văn"
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="content" label="Nội dung đoạn văn (passage)">
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      <Divider className="my-6" />
      <div className="space-y-8">
        {readingTest?.reading_part?.map((part: any) => (
          <ReadingPartCard
            key={part.id}
            part={part}
            onEditPart={handleEditPart}
            onDeletePart={handleDeletePart}
            onAddGroup={handleAddGroup} // Truyền hàm để mở modal thêm group
            onEditGroup={handleEditGroup} // Truyền hàm để mở modal sửa group
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
        onCancel={() => { editPartForm.resetFields(); setEditPartModalOpen(false);}}
        onOk={() => editPartForm.submit()}
        okText="Cập nhật Part"
        cancelText="Huỷ"
        destroyOnClose
      >
        <Form layout="vertical" form={editPartForm} onFinish={handleUpdatePart}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="order_num" label="Thứ tự" rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}> 
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
        onCancel={() => { groupForm.resetFields(); setEditGroupModalOpen(false); setEditGroup(null); }}
        onOk={() => groupForm.submit()} // Submit form sẽ gọi handleUpdateGroup
        okText={editGroup ? "Cập nhật Group" : "Tạo Group"}
        cancelText="Huỷ"
        destroyOnClose
      >
        <Form 
            layout="vertical" 
            form={groupForm} 
            onFinish={handleUpdateGroup} // Gắn hàm xử lý khi form được submit
            initialValues={{ questionType: 'true-false-notgiven' }} // Giá trị mặc định nếu cần
        >
          <Form.Item
            name="heading"
            label="Tiêu đề nhóm (VD: Questions 1-5)"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề nhóm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="questionType" // camelCase trên form
            label="Loại câu hỏi cho nhóm này"
            rules={[{ required: true, message: "Vui lòng chọn loại câu hỏi" }]}
          >
            <Select>
              <Select.Option value="multiple-choice">Multiple Choice</Select.Option>
              <Select.Option value="paragraph">Paragraph (Điền vào đoạn văn)</Select.Option>
              <Select.Option value="matching">Matching</Select.Option>
              <Select.Option value="true-false-notgiven">True/False/Not Given</Select.Option>
              <Select.Option value="gap-fill">Gap-fill (Điền từ vào 1 chỗ trống)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startNumber" // camelCase trên form
            label="Từ câu số (VD: 1)"
            rules={[{ required: true, message: "Vui lòng nhập số thứ tự câu bắt đầu" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="endNumber" // camelCase trên form
            label="Đến câu số (VD: 5)"
            rules={[{ required: true, message: "Vui lòng nhập số thứ tự câu kết thúc" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm/Sửa Câu hỏi */}
      <Modal
        title={editQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi"}
        open={isQuestionModalOpen}
        onCancel={() => { questionForm.resetFields(); setQuestionModalOpen(false); setEditQuestion(null);}}
        onOk={() => questionForm.submit()}
        okText={editQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
        cancelText="Huỷ"
        width={800} // Tăng chiều rộng modal câu hỏi
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={questionForm}
          onFinish={handleSubmitQuestion}
        >
          {renderQuestionFields()}
        </Form>
      </Modal>
    </div>
  );
}
