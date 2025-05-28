// src/pages/client-admin/assessment/AssessmentListPage.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip } from "antd";
import { getAllAssessments } from "../../../apis/assessment-api";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

export default function AssessmentListPage() {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllAssessments();
        setData(res);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bài test", err);
      }
    })();
  }, []);

  const columns = [
    {
      title: "Tên bài test",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trình độ",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Quản lý bài test">
            <Button
              type="primary"
              onClick={() => navigate(`/admin/assessments/${record.id}/manage`)}
            >
              Quản lý
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh sách bài test</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/assessments/create")}
        >
          Tạo bài test mới
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} />
    </div>
  );
}
