import React from "react";
import { Card, Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ReadingGroupCard from "./ReadingGroupCard";

// Interface Question và Group giữ nguyên như bạn đã cung cấp
interface Question {
  id: number;
  question_text: string;
  correct_answer: string;
  explanation: string;
  order_num?: number;
  [key: string]: any; // Cho phép các thuộc tính khác nếu cần
}

interface Group {
  id: number;
  heading: string;
  type: string;
  startNumber: number; // Đảm bảo kiểu dữ liệu là number
  endNumber: number;   // Đảm bảo kiểu dữ liệu là number
  questions: Question[];
  [key: string]: any; // Cho phép các thuộc tính khác nếu cần
}

interface Part {
  id: number;
  title: string;
  instructions?: string;
  reading_group: any[]; // Dữ liệu từ backend
}

interface Props {
  part: Part;
  onEditPart: (part: Part) => void;
  onDeletePart: (partId: number) => void;
  onAddGroup: (partId: number) => void;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: number) => void;
  onAddQuestion: (groupId: number, type: string) => void;
  onEditQuestion: (question: Question, type: string) => void;
  onDeleteQuestion: (questionId: number) => void;
}

const ReadingPartCard: React.FC<Props> = ({
  part,
  onEditPart,
  onDeletePart,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const groups: Group[] = part.reading_group
    ? part.reading_group
        .filter((g: any) => {
          if (!g) return false;
          // Chấp nhận một trong các tên trường: type, question_type (snake_case), hoặc questionType (camelCase)
          return !!(g.type || g.question_type || g.questionType);
        })
        .map((g: any) => ({
          // Giữ lại các trường gốc từ g, nhưng ưu tiên các trường đã được chuẩn hóa bên dưới
          ...g,
          id: g.id,
          heading: g.heading,
          // Chuẩn hóa tên trường và kiểu dữ liệu
          type: String(g.type || g.question_type || g.questionType || "-"),
          startNumber: Number(g.start_number || g.startNumber || 0), // Chuyển đổi sang Number, mặc định là 0 nếu không có
          endNumber: Number(g.end_number || g.endNumber || 0),     // Chuyển đổi sang Number, mặc định là 0 nếu không có
          questions: (g.reading_question || g.questions || []) as Question[],
        }))
    : [];

  return (
    <div className="mb-12">
      <div className="h-2 w-full bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 rounded-t-2xl mb-0"></div>
      <Card
        title={
          <span className="font-bold text-lg text-green-800 uppercase tracking-wide">
            {part.title}
          </span>
        }
        className="rounded-2xl shadow-2xl border border-gray-100 bg-white"
        extra={
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => onEditPart(part)} />
            <Popconfirm
              title="Xoá Part này?"
              onConfirm={() => onDeletePart(part.id)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        }
        bodyStyle={{ paddingBottom: 0, background: "#fcfcfd" }}
      >
        <div className="mb-4">
          <div className="text-gray-600 mb-2 italic">
            <span className="font-medium">Hướng dẫn:</span>{" "}
            {part.instructions || <span className="text-gray-400">Không có</span>}
          </div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => onAddGroup(part.id)}
            className="mb-2"
          >
            Thêm Group
          </Button>
        </div>
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-5">
          {groups.map((group) => (
            <ReadingGroupCard
              key={group.id}
              group={group}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
              onAddQuestion={onAddQuestion}
              onEditQuestion={onEditQuestion}
              onDeleteQuestion={onDeleteQuestion}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReadingPartCard;
