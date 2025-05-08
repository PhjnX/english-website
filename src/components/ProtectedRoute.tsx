import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ReadingTestPage from "../pages/client-users/ReadingTestPage";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [token, navigate, location]);

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
          <div className="flex items-center gap-2 text-xl font-semibold text-red-600">
            <ExclamationCircleOutlined />
            Bắt đầu bài kiểm tra đánh giá 🎯
          </div>
        }
        open={showConfirm}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="✅ Tôi sẵn sàng"
        cancelText="❌ Quay về trang chủ"
        centered
        bodyStyle={{ padding: 20, fontSize: 16 }}
        okButtonProps={{
          className: "bg-green-500 hover:bg-green-600 text-white",
        }}
        cancelButtonProps={{ danger: true }}
      >
        <div className="text-base text-gray-800 space-y-3 leading-relaxed text-center">
          <p>
            ✍️ <strong>Bài test đánh giá trình độ đọc hiểu tiếng Anh</strong>.
          </p>
          <p>
            🚀 Dựa vào kết quả, hệ thống sẽ <strong>gợi ý lộ trình học phù hợp</strong> với bạn.
          </p>
          <p>
            ⏱️ <strong>Thời gian làm bài: 60 phút.</strong> Hãy đảm bảo bạn đang sẵn sàng!
          </p>
        </div>
      </Modal>

      {!showConfirm && <ReadingTestPage />}
    </>
  );
};

export default ProtectedRoute;
