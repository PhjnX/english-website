import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaCheck, FaTimes } from "react-icons/fa";
import book from "../assets/book.gif";
import clock from "../assets/clock.gif";
import reading from "../assets/reading.gif";
import ReadingTestPage from "../pages/client-users/ReadingTestPage";
import pageBackgroundIllustration from "../assets/images/login_background.png";
// Main ProtectedRoute Component
const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(true);
  const token = localStorage.getItem("token"); // Or however you manage auth state // Effect to check for authentication token

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [token, navigate, location]); // Handler to start the test

  const handleConfirm = () => {
    setShowConfirm(false);
  }; // Handler to cancel and go back

  const handleCancel = () => {
    navigate("/"); // Navigate to home or another appropriate page
  };

  // Framer Motion variants for animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const infoPoints = [
    {
      icon: <img src={book} alt="Book" className="w-7 h-7" />,
      text: "Bài test đánh giá trình độ đọc hiểu tiếng Anh của bạn.",
    },
    {
      icon: <img src={reading} alt="Reading" className="w-7 h-7" />,
      text: "Kết quả sẽ gợi ý lộ trình học phù hợp nhất cho bạn.",
    },
    {
      icon: <img src={clock} alt="Clock" className="w-7 h-7" />,
      text: (
        <span>
          Thời gian làm bài: <strong>60 phút</strong>. Hãy đảm bảo bạn đã sẵn
          sàng!
        </span>
      ),
    },
  ];

  // Render nothing if not authenticated yet (to prevent flash of content)
  if (!token) return null;

  return (
    <>
      {/* Background illustration with blur effect */}
      {showConfirm && (
        <div
          style={{
            backgroundImage: `url(${pageBackgroundIllustration})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "fixed",
            inset: 0,
            zIndex: 40,
            filter: "blur(8px)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />
      )}
      {/* AnimatePresence allows animating the modal on enter and exit */}
      <AnimatePresence mode="wait">
        {showConfirm && (
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              key="modal"
              variants={modalVariants}
              className="relative w-full max-w-lg bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8 md:p-10 text-center"
            >
              {/* Header Icon */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-5"
              >
                <motion.div
                  className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                  }}
                >
                  <FaRocket className="text-white text-4xl" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-4"
              >
                Start Your Assessment
              </motion.h2>

              {/* Informative Text */}
              <motion.div
                variants={itemVariants}
                className="text-left space-y-4 my-8"
              >
                {infoPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-3 text-base text-gray-700"
                  >
                    <span className="mt-1 text-xl">{point.icon}</span>
                    <p>{point.text}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <motion.button
                  onClick={handleCancel}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 bg-white text-purple-700 border-2 border-purple-300 rounded-xl font-semibold text-base shadow-md hover:bg-purple-100 hover:border-purple-400 transition-all duration-250 cursor-pointer"
                >
                  <FaTimes />
                  <span>Go Back</span>
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-103 transition-all duration-250 cursor-pointer"
                >
                  <FaCheck />
                  <span>I'm Ready!</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Conditionally render the test page */}     {" "}
      {!showConfirm && <ReadingTestPage />}   {" "}
    </>
  );
};

export default ProtectedRoute;
