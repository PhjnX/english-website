import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationCircle, FaRedo } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận làm lại",
  message = "Bạn có chắc chắn muốn làm lại không?",
  confirmText = "Làm lại ngay",
  cancelText = "Hủy bỏ",
  type = "warning",
}) => {
  // Thêm font Be Vietnam Pro
  React.useEffect(() => {
    if (!document.getElementById("be-vietnam-pro-font")) {
      const fontLink = document.createElement("link");
      fontLink.id = "be-vietnam-pro-font";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  }, []);

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg:
            "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-400/30",
          iconColor: "text-red-400",
          confirmBg:
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600",
          confirmShadow: "hover:shadow-red-500/40",
        };
      case "info":
        return {
          iconBg:
            "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/30",
          iconColor: "text-blue-400",
          confirmBg:
            "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
          confirmShadow: "hover:shadow-blue-500/40",
        };
      default: // warning
        return {
          iconBg:
            "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-400/30",
          iconColor: "text-orange-400",
          confirmBg:
            "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500",
          confirmShadow: "hover:shadow-orange-500/40",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            fontFamily:
              "'Be Vietnam Pro', 'Inter', Arial, Helvetica, sans-serif",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gray-900 border border-purple-500/30 max-w-md w-full mx-4 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header với gradient */}
            <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-pink-700 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <FaRedo className="text-xl text-purple-200" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{title}</h3>
                      <p className="text-purple-200 text-sm">
                        Xác nhận hành động
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center text-red-300 hover:text-red-200 hover:bg-red-500/30 transition-all cursor-pointer"
                    onClick={onClose}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 bg-gray-900">
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 ${typeStyles.iconBg} border rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <FaExclamationCircle
                    className={`text-2xl ${typeStyles.iconColor}`}
                  />
                </div>
                <p className="text-gray-200 text-lg leading-relaxed">
                  {message}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Kết quả cũ sẽ được thay thế bằng kết quả mới
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    y: -1,
                    boxShadow: "0 5px 15px rgba(107, 114, 128, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500 cursor-pointer"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    y: -1,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className={`flex-1 px-6 py-3 ${typeStyles.confirmBg} text-white font-semibold rounded-xl shadow-lg transition-all duration-200 border border-white/20 ${typeStyles.confirmShadow} cursor-pointer`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaRedo className="text-sm" />
                    {confirmText}
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
