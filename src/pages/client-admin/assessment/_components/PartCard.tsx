import React from "react";
import { Card, Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import GroupCard from "./GroupCard";

interface Question {
  id: number;
  questionText: string;
  correctAnswer: string;
}

interface Group {
  id: number;
  heading: string;
  questionType: string;
  startNumber: number;
  endNumber: number;
  questions: Question[];
}

interface Part {
  id: number;
  title: string;
  instructions?: string;
  groups: Group[];
}

interface Props {
  part: Part;
  onEditPart: (part: Part) => void;
  onDeletePart: (partId: number) => void;
  onAddGroup: (partId: number) => void;

  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: number) => void;

  onAddQuestion: (groupId: number, questionType: string) => void;
  onEditQuestion: (question: Question, type: string) => void;
  onDeleteQuestion: (questionId: number) => void;
}

const PartCard: React.FC<Props> = ({
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
  return (
    <div className="mb-12">
      {/* Thanh màu gradient nổi bật ở đầu mỗi Part */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-400 rounded-t-2xl mb-0"></div>
      <Card
        title={
          <span className="font-bold text-lg text-blue-800 uppercase tracking-wide">
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
          {part.groups?.map((group) => (
            <GroupCard
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

export default PartCard;
