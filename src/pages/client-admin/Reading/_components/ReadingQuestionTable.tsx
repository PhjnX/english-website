import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Question {
  id: number;
  question_text: string; 
  correct_answer: string; 
  explanation: string;
  order_num?: number;
  [key: string]: any;
}

interface Props {
  questions: Question[];
  questionType: string;
  startNumber?: number;
  endNumber?: number;
  onEdit: (q: Question, type: string) => void;
  onDelete: (id: number) => void;
}

const ReadingQuestionTable: React.FC<Props> = ({
  questions,
  questionType,
  startNumber = 1,
  endNumber,
  onEdit,
  onDelete,
}) => {
  const isGroupRow = questionType === "paragraph" || questionType === "matching";
  const showSTT = true;

  const renderAnswers = (ans: string | undefined) => {
    if (ans === undefined || ans === null) {
      return <div style={{ textAlign: "center" }}>-</div>;
    }
    try {
      const arr = JSON.parse(ans);
      if (Array.isArray(arr)) {
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {arr.map((item, idx) => (
              <div key={idx} style={{ textAlign: "center", minWidth: 24 }}>{item}</div>
            ))}
          </div>
        );
      }
      return <div style={{ textAlign: "center" }}>{ans}</div>;
    } catch {
      if (typeof ans === "string" && ans.includes("\n")) {
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {ans.split("\n").map((item, idx) => (
              <div key={idx} style={{ textAlign: "center", minWidth: 24 }}>{item.trim()}</div>
            ))}
          </div>
        );
      }
      return <div style={{ textAlign: "center" }}>{ans}</div>;
    }
  };

  const columns = [
    showSTT
      ? {
          title: <div style={{ textAlign: "center" }}>STT</div>,
          key: "stt",
          width: 80,
          align: "center" as const,
          render: (_: any, record: Question, idx: number) => {
            if (isGroupRow) {
              return (
                <span>
                  {startNumber}
                  {endNumber && endNumber !== startNumber ? ` - ${endNumber}` : ""}
                </span>
              );
            } else {
              return startNumber + idx;
            }
          },
        }
      : null,
    {
      title: <div style={{ textAlign: "center" }}>Câu hỏi</div>,
      dataIndex: "question_text",
      key: "question_text",
      render: (text: any) => <span style={{ whiteSpace: "pre-line" }}>{text}</span>,
      align: "left" as const,
    },
    {
      title: <div style={{ textAlign: "center" }}>Đáp án đúng</div>,
      dataIndex: "correct_answer",
      key: "correct_answer",
      render: renderAnswers,
      align: "center" as const,
    },
    {
      title: <div style={{ textAlign: "center" }}>Giải thích</div>,
      dataIndex: "explanation",
      key: "explanation",
      render: (text: any) => <span style={{ whiteSpace: "pre-line" }}>{text}</span>,
      align: "left" as const,
    },
    {
      title: <div style={{ textAlign: "center" }}>Hành động</div>,
      key: "action",
      render: (_: any, record: Question) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record, questionType)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xoá câu hỏi này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 120,
      align: "center" as const,
    },
  ].filter(Boolean);

  // !!! Sửa lại, KHÔNG ép id về chuỗi group-... !!!
  const dataSource =
    isGroupRow && questions.length > 0
      ? [{ ...questions[0] }]
      : questions;

  return (
    <Table
      rowKey="id"
      columns={columns as any}
      dataSource={dataSource}
      pagination={false}
      bordered
      size="middle"
      className="mb-2"
    />
  );
};

export default ReadingQuestionTable;
