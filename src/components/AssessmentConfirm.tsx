import React from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

interface AssessmentConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssessmentConfirm: React.FC<AssessmentConfirmProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    navigate('/assessment');
  };

  const handleCancel = () => {
    onClose();
    navigate('/');
  };

  return (
    <Modal
      title="Xác nhận làm bài test"
      open={isOpen}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="Có, tôi muốn làm bài test"
      cancelText="Không, quay về trang chủ"
    >
      <p>Bạn có chắc chắn muốn làm bài test đánh giá trình độ không?</p>
      <p>Bài test sẽ giúp chúng tôi đánh giá trình độ hiện tại của bạn và đề xuất lộ trình học phù hợp.</p>
    </Modal>
  );
};

export default AssessmentConfirm; 
