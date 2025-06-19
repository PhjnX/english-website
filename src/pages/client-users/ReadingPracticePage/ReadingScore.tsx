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
import { GiPartyPopper } from "react-icons/gi";
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
  // Lấy state truyền từ trang test
  const {
    score = 0,
    timeSpent = 0,
    answers = {},
    questions = [],
    parts = [],
  } = state || {};

  const band = getBand(score);
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
    backgroundImage:
      "linear-gradient(to right, #FEAC5E 0%, #C779D0 51%, #FEAC5E 100%)",
    backgroundSize: "200% auto",
    color: "white",
    transition: "background-position 0.5s, color 0.5s, transform 0.16s",
    border: "none",
    borderRadius: 12,
    boxShadow: "0 2px 12px 0 rgba(200,121,208,0.16)",
    fontWeight: 700,
    fontSize: 18,
    padding: "13px 36px",
    margin: "0 6px",
    cursor: "pointer",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minWidth: 160,
    textTransform: "uppercase" as const,
  };

  return (
    <div
      className="min-h-screen w-full overflow-y-auto flex flex-col items-center justify-center px-2 py-6 font-inter"
      style={{
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
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
      )}

      {/* SVG linear gradient cho Progressbar */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradSuccess" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="gradGood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="gradOkay" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient
            id="gradNeedsImprovement"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient
            id="gradExcellentBand"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          <linearGradient id="gradGoodBand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="gradOkayBand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="backdrop-blur-2xl bg-white/80 border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-10 md:p-14 w-full max-w-4xl text-center mx-auto my-auto"
        style={{
          boxShadow: "0 8px 48px 0 rgba(202,122,213,0.10)",
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
            <GiPartyPopper className="text-5xl text-yellow-400 animate-pulse" />
            <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 drop-shadow">
              Excellent!
            </span>
            <GiPartyPopper className="text-5xl text-yellow-400 animate-pulse scale-x-[-1]" />
          </motion.div>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            You’ve completed your Reading Test! Here are your results:
          </p>
        </motion.div>

        {/* 3 Card thống kê */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-11"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 26px 0 rgba(243, 114, 44, 0.15)",
            }}
            className="flex flex-col items-center px-5 py-6 bg-gradient-to-br from-[#fff7e8] to-[#f5e1ff] rounded-2xl shadow-md border border-orange-100/60"
          >
            <div className="w-28 h-28 mb-3">
              <CircularProgressbarWithChildren
                value={totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: progressColor(
                    totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
                  ),
                  trailColor: "#ffe3c9",
                  pathTransitionDuration: 0.8,
                  strokeLinecap: "round",
                })}
              >
                <FaBookReader className="text-2xl text-orange-400 mb-1" />
                <div className="text-xs text-orange-500 font-bold">Correct</div>
                <div className="text-xl font-extrabold text-orange-700">
                  {score}/{totalQuestions > 0 ? totalQuestions : "N/A"}
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <p className="text-base font-semibold text-orange-700">Answers</p>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 26px 0 rgba(147, 51, 234, 0.15)",
            }}
            className="flex flex-col items-center px-5 py-6 bg-gradient-to-br from-[#f5e1ff] to-[#ffe3c9] rounded-2xl shadow-md border border-purple-100/60"
          >
            <div className="w-28 h-28 mb-3">
              <CircularProgressbarWithChildren
                value={typeof band === "number" ? (band / 9) * 100 : 0}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: bandProgressColor(band),
                  trailColor: "#f3e8ff",
                  pathTransitionDuration: 0.8,
                  strokeLinecap: "round",
                })}
              >
                <FaAward className="text-2xl text-purple-500 mb-1" />
                <div className="text-xs text-purple-700 font-bold">Band</div>
                <div className="text-2xl font-extrabold text-purple-800">
                  {band}
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <p className="text-base font-semibold text-purple-700">
              IELTS Band
            </p>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 26px 0 rgba(255, 107, 107, 0.16)",
            }}
            className="flex flex-col items-center px-5 py-6 bg-gradient-to-br from-[#ffe3c9] to-[#f5e1ff] rounded-2xl shadow-md border border-pink-100/70"
          >
            <div className="w-28 h-28 mb-3">
              <CircularProgressbarWithChildren
                value={100}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: "url(#gradGood)",
                  trailColor: "#ffe3c9",
                  strokeLinecap: "round",
                })}
              >
                <FaChartLine className="text-xl text-pink-400 mb-1" />
                <div className="text-xs text-pink-600 font-bold">
                  Time Taken
                </div>
                <div className="text-lg font-bold text-pink-700">
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <p className="text-base font-semibold text-pink-700">Duration</p>
          </motion.div>
        </motion.div>

        {/* Dải band điểm */}
        <motion.div variants={itemVariants} className="mb-10">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">
            Your Band on the Scale:
          </h3>
          <div className="flex flex-wrap gap-2 justify-center px-2">
            {bandMapping
              .slice()
              .reverse()
              .map((b) => (
                <motion.span
                  key={b.band}
                  className={`px-3 py-1.5 rounded-lg border-2 text-sm font-bold transition-all duration-200 shadow
                  ${
                    b.band === band
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-purple-700 scale-110 ring-2 ring-pink-200 ring-offset-1"
                      : typeof band === "number" && b.band < band
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-400"
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
            <motion.button
              whileHover={{ scale: 1.04 }}
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
              <FaHome size={20} />
              <span>Home</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate("/assessment")}
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
              <FaRedo size={20} />
              <span>Try Again</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              onClick={handleReview}
              style={{
                ...gradBtnStyle,
                backgroundImage:
                  "linear-gradient(to right, #C779D0 0%, #FEAC5E 51%, #C779D0 100%)",
                backgroundPosition: "left center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundPosition = "right center")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundPosition = "left center")
              }
            >
              <FaEye size={20} />
              <span>Review Answers</span>
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/lessons")}
            style={{
              ...gradBtnStyle,
              width: "100%",
              maxWidth: 380,
              fontSize: 19,
              marginTop: 18,
              backgroundImage:
                "linear-gradient(to right, #43cea2 0%, #185a9d 100%)",
              backgroundPosition: "left center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundPosition = "right center")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundPosition = "left center")
            }
          >
            <FaRocket size={22} />
            <span>Continue Learning Path</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReadingScore;
