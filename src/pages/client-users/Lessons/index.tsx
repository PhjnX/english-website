import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaCrown,
  FaCheck,
  FaLock,
  FaBullseye,
  FaUserGraduate,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../_components/Header"; // Assuming path is correct
import Footer from "../_components/Footer"; // Assuming path is correct

// --- TYPE DEFINITIONS ---
interface UserData {
  level: number | null;
  band: number | null;
}

interface LevelCardData {
  id: number;
  level: number;
  band: string;
  description: string;
  icon: React.ReactElement;
  gradient: string;
}

// --- MOCK DATA ---
const readingLevels: LevelCardData[] = [
  {
    id: 1,
    level: 1,
    band: "3.0+",
    description:
      "Chủ đề cơ bản, câu hỏi dễ tiếp cận, phù hợp cho người mới bắt đầu.",
    icon: <FaBookOpen />,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    level: 2,
    band: "3.5+",
    description:
      "Nội dung quen thuộc, độ dài tăng nhẹ, thử sức với các câu hỏi nâng cao hơn.",
    icon: <FaBookOpen />,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    level: 3,
    band: "4.0+",
    description:
      "Chủ đề đa dạng, yêu cầu phân tích và tư duy nhiều hơn, thích hợp để luyện tập nâng cao.",
    icon: <FaBookOpen />,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: 4,
    level: 4,
    band: "4.5+",
    description:
      "Nội dung học thuật, độ dài và độ khó tăng rõ rệt, đòi hỏi kỹ năng đọc hiểu tốt.",
    icon: <FaBookOpen />,
    gradient: "from-red-500 to-rose-500",
  },
  {
    id: 5,
    level: 5,
    band: "5.0+",
    description:
      "Chuyên sâu về các chủ đề học thuật, câu hỏi mang tính phân tích và tổng hợp cao.",
    icon: <FaBookOpen />,
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    id: 6,
    level: 6,
    band: "6.0+",
    description:
      "Thử thách với các chủ đề phức tạp, yêu cầu tư duy phản biện và kỹ năng đọc xuất sắc.",
    icon: <FaBookOpen />,
    gradient: "from-indigo-500 to-violet-600",
  },
];

// Mock API to get user data (replace with your actual API call)
const fetchUserProgress = async (): Promise<UserData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Change these values to test different scenarios
      resolve({ level: 3, band: 4.0 });
    }, 1000);
  });
};

// --- MAIN COMPONENT ---
const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchUserProgress();
      setUserData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Thêm import font Be Vietnam Pro cho trang này (chỉ thêm 1 lần)
  if (!document.getElementById("be-vietnam-font")) {
    const fontLink = document.createElement("link");
    fontLink.id = "be-vietnam-font";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const userLevel = userData?.level;

  return (
    <>
      <Header />
      <div
        className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 text-white font-inter"
        style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', Arial, Helvetica, sans-serif",
        }}
      >
        <main className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
          {/* Page Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="inline-block p-1 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mb-5"
              variants={itemVariants}
            >
              <div className="p-3 bg-gray-800 rounded-[14px]">
                <FaUserGraduate className="text-4xl text-white" />
              </div>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
              style={{
                lineHeight: 1.25,
                minHeight: "5.5rem",
                paddingTop: "0.7rem",
              }}
            >
              Trang Ôn Luyện
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="max-w-3xl mx-auto text-lg md:text-xl text-purple-200/80"
            >
              Chọn một level dưới đây để bắt đầu hành trình chinh phục kỹ năng
              đọc hiểu và đạt điểm số IELTS mong muốn.
            </motion.p>
          </motion.div>

          {/* User Progress Display */}
          <AnimatePresence>
            {!loading && (
              <motion.div
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-16 md:mb-20"
              >
                {userLevel ? (
                  <div className="relative max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/10 p-8 flex flex-col sm:flex-row items-center justify-around gap-8 text-center">
                    <div className="flex flex-col items-center flex-1">
                      <p className="text-base font-semibold text-purple-300 mb-2 uppercase tracking-wider">
                        Level
                      </p>
                      <div className="text-6xl font-bold text-white">
                        {userLevel}
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-purple-300/50 to-transparent"></div>
                    <div className="flex flex-col items-center flex-1">
                      <p className="text-base font-semibold text-purple-300 mb-2 uppercase tracking-wider">
                        Band
                      </p>
                      <div className="text-6xl font-bold text-white">
                        {userData?.band?.toFixed(1)}
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-purple-300/50 to-transparent"></div>
                    <motion.div
                      className="flex flex-col items-center flex-1 p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="text-base font-semibold text-purple-200 uppercase tracking-wide">
                        Đề xuất
                      </p>
                      <p className="text-3xl font-bold text-white mt-1">
                        Luyện Level {userLevel}
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center max-w-2xl mx-auto bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-6">
                    <FaBullseye className="text-yellow-400 text-4xl mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Chưa có lộ trình!
                    </h3>
                    <p className="text-yellow-200/80 mb-4">
                      Bạn cần làm bài test đầu vào để nhận được lộ trình học tập
                      phù hợp.
                    </p>
                    <motion.button
                      onClick={() => navigate("/assessment-confirm")}
                      className="px-6 py-2.5 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      Làm bài test ngay
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Levels Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {readingLevels.map((card) => {
              const isRecommended = userLevel === card.level;
              const isCompleted =
                userLevel !== undefined &&
                userLevel !== null &&
                userLevel > card.level;

              return (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-300 transform-gpu cursor-pointer group
    ${
      isRecommended
        ? "shadow-2xl shadow-purple-500/40 scale-105 z-20"
        : "shadow-xl"
    }
  `}
                  style={
                    isRecommended
                      ? {
                          boxShadow:
                            "0 0 32px 8px #a78bfa, 0 8px 32px 0 rgba(168,85,247,0.18)",
                          border: "2px solid #a78bfa",
                          transition: "all 0.4s cubic-bezier(.4,2,.6,1)",
                        }
                      : {}
                  }
                  whileHover={{
                    y: -10,
                    boxShadow: isRecommended
                      ? "0 0 48px 16px #a78bfa, 0 12px 40px 0 rgba(236,72,153,0.18)"
                      : undefined,
                    transition: { type: "spring", stiffness: 300, damping: 15 },
                  }}
                  onClick={() => navigate(`/lessons/${card.level}`)}
                >
                  <div className="relative p-6 md:p-8 bg-gray-800/80 backdrop-blur-xl h-full flex flex-col rounded-3xl">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${card.gradient} text-white text-3xl shadow-lg`}
                      >
                        {card.icon}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-5xl text-white drop-shadow-lg">
                          Level {card.level}
                        </p>
                        <p className="text-sm font-medium text-purple-300">
                          Band {card.band}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-grow my-4">
                      <p className="text-lg text-purple-200/90 mb-6">
                        {card.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-auto">
                      <motion.div
                        whileHover={{
                          scale: 1.08,
                          boxShadow: "0 8px 32px 0 rgba(168,85,247,0.25)",
                          background:
                            "linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)",
                          color: "#fff",
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-purple-200 rounded-full text-base font-semibold cursor-pointer select-none transition-all duration-300"
                        style={{ userSelect: "none" }}
                      >
                        <span>Bắt đầu</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Badges */}
                  {isRecommended && (
                    <motion.div
                      className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-base font-extrabold shadow-2xl border-2 border-white/40 drop-shadow-xl z-30"
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: [1, 1.08, 1] }}
                      transition={{
                        delay: 0.3,
                        duration: 0.7,
                        ease: "easeInOut",
                      }}
                      style={{
                        boxShadow: "0 0 24px 6px #a78bfa, 0 4px 16px 0 #f472b6",
                      }}
                    >
                      <motion.span
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                        className="flex items-center"
                      >
                        <FaCrown className="text-2xl mr-1 text-yellow-300 drop-shadow-lg" />
                      </motion.span>
                      <span>Đề xuất</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default LessonsPage;
