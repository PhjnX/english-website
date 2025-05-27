import React from "react";
import { Card, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ReadingQuestionTable from "./ReadingQuestionTable";

interface Question {
  id: number;
  questionText: string;
  correctAnswer?: string;
  explanation?: string;
}

interface Group {
  id: number;
  heading: string;
  type: string;
  startNumber: number;
  endNumber: number;
  questions: Question[];
}

interface Props {
  group: Group;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: number) => void;
  onAddQuestion: (groupId: number, type: string) => void;
  onEditQuestion: (question: Question, type: string) => void;
  onDeleteQuestion: (questionId: number) => void;
}

const ReadingGroupCard: React.FC<Props> = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  if (!group) return null;

  const type = group.type || "-";
  const startNumber = group.startNumber ?? "-";
  const endNumber = group.endNumber ?? "-";

  return (
    <Card
      type="inner"
      title={group.heading}
      className="mt-4"
      extra={
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEditGroup(group)}
          />
          <Popconfirm
            title="Xoá nhóm câu hỏi này?"
            onConfirm={() => onDeleteGroup(group.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => onAddQuestion(group.id, type)}
          >
            Thêm câu
          </Button>
        </Space>
      }
    >
      <p>Loại: {type}</p>
      <p>
        Số câu: {startNumber !== "-" && endNumber !== "-" ? `${startNumber} - ${endNumber}` : "-"}
      </p>
      <ReadingQuestionTable
        questions={group.questions}
        questionType={type}
        startNumber={startNumber}
        endNumber={endNumber}
        onEdit={onEditQuestion}
        onDelete={onDeleteQuestion}
      />
    </Card>
  );
};

export default ReadingGroupCard;
