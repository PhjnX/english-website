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
import { Part, Group, Question } from "./reading";

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
  }, []); // Lấy state truyền từ trang test
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

  const handleReview = () => {
    navigate("/review", {
      state: {
        answers,
        questions,
        parts,
        isSubmitted: true,
        isReviewing: true,
        score,
        band,
      },
    });
  };

  // Đếm chính xác số câu hỏi của tất cả dạng
  const countQuestions = (parts: Part[]): number => {
    let total = 0;
    parts.forEach((part: Part) => {
      part.groups.forEach((group: Group) => {
        group.questions.forEach((q: Question) => {
          if (q.type === "gap-fill" || q.type === "paragraph") {
            // Mỗi chỗ ___ là 1 câu hỏi
            const numBlanks = (q.questionText.match(/_{2,}/g) || []).length;
            total += numBlanks;
          } else if (q.type === "matching") {
            // Mỗi statement là 1 câu hỏi
            const numStatements = q.questionText
              .split(/\n/)
              .filter((s: string) => s.trim()).length;
            total += numStatements;
          } else {
            // multiple-choice, true-false-notgiven: mỗi object là 1 câu hỏi
            total += 1;
          }
        });
      });
    });
    return total;
  };

  const totalQuestions =
    Array.isArray(parts) && parts.length > 0 ? countQuestions(parts) : 40;

  // Gradient màu động cho progressbar
  const progressColor = (percent: number) =>
    percent >= 80
      ? "url(#gradSuccess)"
      : percent >= 60
      ? "url(#gradGood)"
      : percent >= 40
      ? "url(#gradOkay)"
      : "url(#gradNeedsImprovement)";

  const bandProgressColor = (currentBand: number | string) =>
    typeof currentBand !== "number"
      ? "url(#gradNeedsImprovement)"
      : currentBand >= 7.0
      ? "url(#gradExcellentBand)"
      : currentBand >= 5.5
      ? "url(#gradGoodBand)"
      : "url(#gradOkayBand)";

  // Hiệu ứng motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.09,
      },
    },
  };
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
    margin: "0 8px",
    cursor: "pointer",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minWidth: 140,
    textTransform: "capitalize" as const,
    fontFamily: "'Be Vietnam Pro', 'Inter', Arial, Helvetica, sans-serif",
  };
  return (
    <div
      className="min-h-screen w-full overflow-y-auto flex flex-col items-center justify-center px-4 py-6"
      style={{
        fontFamily: "'Be Vietnam Pro', 'Inter', Arial, Helvetica, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={score > 0 ? 260 : 40}
          gravity={0.09}
        />
      )}{" "}
      {/* SVG linear gradient cho Progressbar */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradSuccess" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradGood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="gradOkay" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient
            id="gradNeedsImprovement"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient
            id="gradExcellentBand"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="gradGoodBand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="gradOkayBand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="backdrop-blur-xl bg-white/90 border border-white/40 rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 w-full max-w-5xl text-center mx-auto my-auto"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)",
          fontFamily: "'Be Vietnam Pro', 'Inter', Arial, Helvetica, sans-serif",
        }}
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-7"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="flex items-center justify-center gap-4 mb-3"
          >
            {" "}
            <FaRocket className="text-6xl text-purple-500 animate-bounce" />
            <span className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-lg">
              Chúc mừng! Bạn đã hoàn thành bài thi thử !
            </span>
            <FaRocket className="text-6xl text-purple-500 animate-bounce scale-x-[-1]" />
          </motion.div>{" "}
          <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
            Đây là kết quả bài thi thử IELTS Reading của bạn.
            <br />
            Hãy sử dụng kết quả này để đánh giá năng lực hiện tại và lên kế
            hoạch luyện tập để đạt mục tiêu!
          </p>
        </motion.div>
        {/* 3 Card thống kê */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-11"
        >
          {" "}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            className="flex flex-col items-center px-6 py-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl shadow-lg border border-orange-200"
          >
            <div className="w-32 h-32 mb-4">
              <CircularProgressbarWithChildren
                value={totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: progressColor(
                    totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
                  ),
                  trailColor: "#fed7aa",
                  pathTransitionDuration: 1.2,
                  strokeLinecap: "round",
                })}
              >
                <FaBookReader className="text-3xl text-orange-600 mb-2" />
                <div className="text-sm text-orange-700 font-bold">Đúng</div>
                <div className="text-2xl font-extrabold text-orange-800">
                  {score}/{totalQuestions > 0 ? totalQuestions : "N/A"}
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <p className="text-lg font-bold text-orange-800">Số câu trả lời</p>
          </motion.div>{" "}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            className="flex flex-col items-center px-6 py-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg border border-purple-200"
          >
            <div className="w-32 h-32 mb-4">
              <CircularProgressbarWithChildren
                value={typeof band === "number" ? (band / 9) * 100 : 0}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: bandProgressColor(band),
                  trailColor: "#e9d5ff",
                  pathTransitionDuration: 1.2,
                  strokeLinecap: "round",
                })}
              >
                <FaAward className="text-3xl text-purple-600 mb-2" />
                <div className="text-sm text-purple-700 font-bold">Band</div>
                <div className="text-2xl font-extrabold text-purple-800">
                  {band}
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <p className="text-lg font-bold text-purple-800">Điểm số IELTS</p>
          </motion.div>{" "}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            className="flex flex-col items-center px-6 py-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-lg border border-green-200"
          >
            <div className="w-32 h-32 mb-4">
              <CircularProgressbarWithChildren
                value={100}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: "url(#gradGood)",
                  trailColor: "#bbf7d0",
                  strokeLinecap: "round",
                })}
              >
                <FaChartLine className="text-3xl text-green-600 mb-2" />
                <div className="text-sm text-green-700 font-bold">
                  Thời gian
                </div>
                <div className="text-xl font-bold text-green-800">
                  {Math.floor(timeSpent / 60)}p {timeSpent % 60}s
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <p className="text-lg font-bold text-green-800">
              Thời lượng làm bài
            </p>
          </motion.div>
        </motion.div>{" "}
        {/* Dải band điểm */}
        <motion.div variants={itemVariants} className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Vị trí điểm số của bạn trên thang điểm IELTS:
          </h3>
          <div className="flex flex-wrap gap-2 justify-center px-2">
            {displayBandMapping
              .slice()
              .reverse()
              .map((b) => (
                <motion.span
                  key={b.band}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-300 shadow-md
                  ${
                    b.band === band
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600 scale-110 ring-4 ring-purple-200 ring-offset-2 shadow-lg"
                      : typeof band === "number" &&
                        typeof b.band === "number" &&
                        b.band < band
                      ? "bg-purple-100 text-purple-800 border-purple-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                  whileHover={{ y: -2, transition: { duration: 0.14 } }}
                >
                  {b.band}
                </motion.span>
              ))}
          </div>
        </motion.div>
        {/* Nút hành động */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full">
            {" "}
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
              onClick={() => navigate("/mock-test")}
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
            <motion.button
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
            </motion.button>
          </div>{" "}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/lessons")}
            style={{
              ...gradBtnStyle,
              width: "100%",
              maxWidth: 400,
              fontSize: 18,
              marginTop: 20,
              backgroundImage:
                "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
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
    </div>
  );
};

export default ReadingScore;
