import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import ReadingTestPage from '../pages/client-users/ReadingTestPage';

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [token, navigate, location]);

  const handleConfirm = () => {
    setShowConfirm(false);
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <>
      <Modal
        title="Xác nhận làm bài test"
        open={showConfirm}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Có, tôi muốn làm bài test"
        cancelText="Không, quay về trang chủ"
        centered
        bodyStyle={{ textAlign: 'center', fontSize: 16 }}
      >
        <p style={{ marginBottom: 8 }}><b>Bạn có chắc chắn muốn làm bài test đánh giá trình độ không?</b></p>
        <p>Bài test sẽ giúp chúng tôi đánh giá trình độ hiện tại của bạn và đề xuất lộ trình học phù hợp.</p>
      </Modal>

      {!showConfirm && <ReadingTestPage />}
    </>
  );
};

export default ProtectedRoute; 
