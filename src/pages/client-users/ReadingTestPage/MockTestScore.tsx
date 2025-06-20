import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  FaRedo,
  FaHome,
  FaEye,
  FaRocket,
  FaAward,
  FaBookReader,
  FaChartLine,
} from "react-icons/fa";
import { Part, Group } from "./reading";
import ConfirmModal from "../../../components/ConfirmModal";

// Band mapping - giữ nguyên
const bandMapping = [
  { score: 39, band: 9.0 },
  { score: 37, band: 8.5 },
  { score: 35, band: 8.0 },
  { score: 33, band: 7.5 },
  { score: 30, band: 7.0 },
  { score: 27, band: 6.5 },
  { score: 23, band: 6.0 },
  { score: 19, band: 5.5 },
  { score: 15, band: 5.0 },
  { score: 13, band: 4.5 },
  { score: 10, band: 4.0 },
  { score: 8, band: 3.5 },
  { score: 6, band: 3.0 },
];

// Thêm band "Below 3.0" để hiển thị
const displayBandMapping = [...bandMapping, { score: 0, band: "Below 3.0" }];

const getBand = (score: number): number | string => {
  for (let i = 0; i < bandMapping.length; i++) {
    if (score >= bandMapping[i].score) return bandMapping[i].band;
  }
  return "Below 3.0";
};

const ReadingScore = () => {
  const location = useLocation();
  let state = location.state;
  const navigate = useNavigate();

  if (!state) {
    try {
      state = JSON.parse(localStorage.getItem("reading_result") || "{}");
    } catch {}
  }

  // Thêm font Be Vietnam Pro
  useEffect(() => {
    if (!document.getElementById("be-vietnam-pro-font")) {
      const fontLink = document.createElement("link");
      fontLink.id = "be-vietnam-pro-font";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  }, []);

  // Lấy state truyền từ trang test
  const {
    score = 0,
    band: stateBand,
    timeSpent = 0,
    answers = {},
    questions = [],
    parts = [],
  } = state || {};

  // Sử dụng band từ state nếu có, nếu không thì tính lại từ score
  const band = stateBand || getBand(score);
  const [showConfetti, setShowConfetti] = useState(true);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  const handleRetake = () => {
    setShowRetakeModal(false);
    navigate("/mock-test");
  };

  const handleReview = () => {
    navigate("/mock-test-review", {
      state: { answers, questions, parts, score, band },
    });
  };

  // Đếm chính xác số câu hỏi của tất cả dạng
  const countQuestions = (parts: Part[]): number => {
    let total = 0;
    parts.forEach((part: Part) => {
      part.groups.forEach((group: Group) => {
        // Ưu tiên sử dụng startNumber và endNumber nếu có
        if (
          typeof group.startNumber === "number" &&
          typeof group.endNumber === "number"
        ) {
          total += group.endNumber - group.startNumber + 1;
        } else if (group.questions && group.questions.length > 0) {
          // Fallback: đếm theo số lượng questions
          total += group.questions.length;
        } else {
          // Fallback cuối: đếm theo nội dung questionText của group
          if (group.questionText) {
            const text = group.questionText;
            if (
              group.questionType === "gap-fill" ||
              group.questionType === "paragraph"
            ) {
              // Đếm số chỗ trống ___
              const numBlanks = (text.match(/_{2,}/g) || []).length;
              total += numBlanks > 0 ? numBlanks : 1;
            } else if (group.questionType === "matching") {
              // Đếm số statement có dạng "1. ...", "2. ..."
              const numStatements = text
                .split(/\n/)
                .filter(
                  (s: string) => s.trim() && /^\d+\./.test(s.trim())
                ).length;
              total += numStatements > 0 ? numStatements : 1;
            } else {
              // Các loại khác mặc định là 1
              total += 1;
            }
          }
        }
      });
    });
    return total;
  };

  const totalQuestions =
    Array.isArray(parts) && parts.length > 0
      ? countQuestions(parts)
      : questions && Array.isArray(questions)
      ? questions.length
      : 40;

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.44, ease: "easeOut" },
    },
  };

  // Style gradient động cho button (inline, không cần file ngoài)
  const gradBtnStyle: React.CSSProperties = {
    backgroundImage: "linear-gradient(to right, #667eea 0%, #764ba2 100%)",
    backgroundSize: "200% auto",
    color: "white",
    transition: "background-position 0.5s, color 0.5s, transform 0.16s",
    border: "none",
    borderRadius: 16,
    boxShadow: "0 8px 32px 0 rgba(102, 126, 234, 0.3)",
    fontWeight: 700,
    fontSize: 16,
    padding: "14px 28px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "fit-content",
    maxWidth: 280,
    marginTop: 12,
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Be Vietnam Pro', 'Inter', Arial, Helvetica, sans-serif",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.1}
          colors={["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"]}
        />
      )}

      <motion.div
        className="container mx-auto px-4 py-8 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-4 shadow-xl border border-white/30"
            whileHover={{ scale: 1.05 }}
          >
            <FaAward className="text-yellow-300 text-2xl" />
            <span className="text-white font-bold text-xl">
              Kết quả IELTS Reading
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl font-black text-transparent bg-clip-text mb-2"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #FFD700, #FFA500, #FF6347)",
            }}
            animate={{ scale: [0.9, 1.1, 1] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            Chúc mừng!
          </motion.h1>
          <motion.p
            className="text-white/90 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Bạn đã hoàn thành bài kiểm tra
          </motion.p>
        </motion.div>

        {/* Main Score Display */}
        <motion.div
          variants={itemVariants}
          className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl border border-white/20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Circular Progress */}
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <CircularProgressbarWithChildren
                  value={(score / totalQuestions) * 100}
                  styles={buildStyles({
                    pathColor: "#4ade80",
                    trailColor: "rgba(255,255,255,0.2)",
                    strokeLinecap: "round",
                    pathTransitionDuration: 2.5,
                  })}
                  strokeWidth={8}
                >
                  <div className="text-center">
                    <div className="text-6xl font-black text-white mb-2">
                      {score}
                    </div>
                    <div className="text-white/80 text-lg font-medium">
                      / {totalQuestions}
                    </div>
                    <div className="text-sm text-white/60 mt-1">câu đúng</div>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </div>

            {/* Score Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <FaAward className="text-yellow-400 text-2xl" />
                  <span className="text-white font-bold text-xl">
                    Band Score
                  </span>
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  {band}
                </div>
                <div className="text-white/70 text-sm mt-1">
                  Thang điểm IELTS
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <FaChartLine className="text-blue-400 text-2xl" />
                  <span className="text-white font-bold text-xl">Thống kê</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {score}
                    </div>
                    <div className="text-white/70 text-xs">Câu đúng</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {totalQuestions - score}
                    </div>
                    <div className="text-white/70 text-xs">Câu sai</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <FaBookReader className="text-indigo-400 text-2xl" />
                  <span className="text-white font-bold text-xl">
                    Thời gian
                  </span>
                </div>
                <div className="text-2xl font-bold text-indigo-400">
                  {Math.floor(timeSpent / 60)} phút {timeSpent % 60} giây
                </div>
                <div className="text-white/70 text-xs">
                  Thời gian hoàn thành
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Band Analysis - chỉ hiển thị nếu có band */}
        {band && (
          <motion.div
            variants={itemVariants}
            className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Phân tích Band Score
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayBandMapping.slice(0, 8).map((item, index) => {
                const isCurrentBand =
                  typeof band === "number"
                    ? item.band === band
                    : item.band === band;
                return (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCurrentBand
                        ? "bg-gradient-to-r from-yellow-400/30 to-orange-500/30 border-yellow-400 shadow-lg"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${
                          isCurrentBand ? "text-yellow-300" : "text-white"
                        }`}
                      >
                        {item.band}
                      </div>
                      <div
                        className={`text-sm ${
                          isCurrentBand ? "text-yellow-200" : "text-white/70"
                        }`}
                      >
                        {item.score}+ điểm
                      </div>
                      {isCurrentBand && (
                        <div className="text-xs text-yellow-300 mt-1 font-semibold">
                          Kết quả của bạn
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Nút hành động */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/")}
              style={{
                ...gradBtnStyle,
                backgroundPosition: "left center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundPosition = "right center")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundPosition = "left center")
              }
            >
              <FaHome size={18} />
              <span>Trang chủ</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowRetakeModal(true)}
              style={{
                ...gradBtnStyle,
                backgroundPosition: "left center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundPosition = "right center")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundPosition = "left center")
              }
            >
              <FaRedo size={18} />
              <span>Làm lại</span>
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleReview}
              style={{
                ...gradBtnStyle,
                backgroundImage:
                  "linear-gradient(to right, #f093fb 0%, #f5576c 100%)",
                backgroundPosition: "left center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundPosition = "right center")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundPosition = "left center")
              }
            >
              <FaEye size={18} />
              <span>Xem đáp án</span>
            </motion.button> */}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/lessons")}
            style={{
              ...gradBtnStyle,
              backgroundImage:
                "linear-gradient(to right, #667eea 0%, #764ba2 100%)",
              backgroundPosition: "left center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundPosition = "right center")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundPosition = "left center")
            }
          >
            <FaRocket size={20} />
            <span>Tiếp tục lộ trình học tập</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showRetakeModal}
        onClose={() => setShowRetakeModal(false)}
        onConfirm={handleRetake}
        title="Xác nhận làm lại"
        message="Bạn có chắc chắn muốn làm lại bài kiểm tra IELTS Reading không?"
        confirmText="Làm lại ngay"
        cancelText="Hủy bỏ"
        type="warning"
      />
    </div>
  );
};

export default ReadingScore;
