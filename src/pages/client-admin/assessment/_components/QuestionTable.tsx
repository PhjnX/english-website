import React from "react";
import { Table, Button, Space, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface QuestionTableProps {
  questions: any[];
  questionType: string;
  startNumber?: number;
  endNumber?: number;
  onEdit: (question: any, type: string) => void;
  onDelete: (id: number) => void;
}

export default function QuestionTable({
  questions,
  questionType,
  startNumber = 1,
  endNumber,
  onEdit,
  onDelete,
}: QuestionTableProps) {
  const isGroupRow = questionType === "paragraph" || questionType === "matching";
  const showSTT = true;

  // Cột đáp án: hiện mỗi đáp án 1 dòng, căn giữa mọi trường hợp
  const renderAnswers = (ans: string) => {
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
          dataIndex: "index",
          key: "index",
          width: 80,
          align: "center",
          render: (_: any, __: any, idx: number) => {
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
      dataIndex: "questionText",
      key: "questionText",
      render: (text: any) => <span style={{ whiteSpace: "pre-line" }}>{text}</span>,
      align: "left",
    },
    {
      title: <div style={{ textAlign: "center" }}>Đáp án</div>,
      dataIndex: "correctAnswer",
      key: "correctAnswer",
      render: renderAnswers,
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center" }}>Thao tác</div>,
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record, questionType)}
            />
          </Tooltip>
          <Popconfirm
            title="Xoá câu hỏi này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 120,
      align: "center",
    },
  ].filter(Boolean);

  const data =
    isGroupRow && questions.length > 0
      ? [{ ...questions[0] }]
      : questions;

  return (
    <Table
      rowKey="id"
      columns={columns as any}
      dataSource={data}
      pagination={false}
      bordered
      size="middle"
      className="mb-2"
    />
  );
}
