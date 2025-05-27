import React from "react";
import { Card, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import QuestionTable from "./QuestionTable";

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

interface Props {
  group: Group;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (groupId: number) => void;
  onAddQuestion: (groupId: number, questionType: string) => void;
  onEditQuestion: (question: Question, questionType: string) => void;
  onDeleteQuestion: (questionId: number) => void;
}

const GroupCard: React.FC<Props> = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
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
            onClick={() => onAddQuestion(group.id, group.questionType)}
          >
            Thêm câu
          </Button>
        </Space>
      }
    >
      <p>Loại: {group.questionType}</p>
      <p>Số câu: {group.startNumber} - {group.endNumber}</p>
      <QuestionTable
  questions={group.questions || []}
  questionType={group.questionType}
  startNumber={group.startNumber}
  endNumber={group.endNumber}
  onEdit={onEditQuestion}
  onDelete={onDeleteQuestion}
/>
    </Card>
  );
};

export default GroupCard;
