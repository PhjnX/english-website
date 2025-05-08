import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ReadingTestPage from "./ReadingTestPage";

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: { pathname: "/assessment" } } });
    }
  }, [token, navigate]);

  const handleConfirm = () => {
    setShowConfirm(false);
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!token) return null;

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
            <ExclamationCircleOutlined />
            🎯 Bắt đầu bài kiểm tra đánh giá
          </div>
        }
        open={showConfirm}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="✅ Tôi sẵn sàng"
        cancelText="❌ Quay về trang chủ"
        centered
        bodyStyle={{ paddingTop: 10, paddingBottom: 20 }}
        okButtonProps={{ className: "bg-green-500 hover:bg-green-600 text-white" }}
        cancelButtonProps={{ danger: true }}
      >
        <div className="text-base text-gray-800 space-y-2">
          <p>
            ✍️ Bài test sẽ giúp <strong>đánh giá trình độ hiện tại</strong> của bạn.
          </p>
          <p>
            🚀 Dựa vào kết quả, hệ thống sẽ <strong>đề xuất lộ trình học phù hợp</strong> cho bạn.
          </p>
          <p>⏰ Thời gian làm bài: <strong>60 phút</strong>. Bạn đã sẵn sàng chưa?</p>
        </div>
      </Modal>

      {!showConfirm && <ReadingTestPage />}
    </>
  );
};

export default AssessmentPage;
