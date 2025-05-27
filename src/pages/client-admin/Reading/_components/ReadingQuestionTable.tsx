import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Question {
  id: number;
  questionText: string;
  correctAnswer?: string;
  explanation?: string;
}

interface Props {
  questions: Question[];
  questionType: string;
  startNumber: number | string;
  endNumber: number | string;
  onEdit: (q: Question, type: string) => void;
  onDelete: (id: number) => void;
}

const ReadingQuestionTable: React.FC<Props> = ({
  questions,
  questionType,
  onEdit,
  onDelete,
}) => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Câu hỏi", dataIndex: "questionText", key: "questionText" },
    { title: "Đáp án đúng", dataIndex: "correctAnswer", key: "correctAnswer" },
    { title: "Giải thích", dataIndex: "explanation", key: "explanation" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Question) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record, questionType)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá câu hỏi này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={questions}
      pagination={false}
    />
  );
};

export default ReadingQuestionTable;
