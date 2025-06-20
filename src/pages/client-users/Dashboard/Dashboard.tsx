import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import { FaRocket, FaExclamationCircle, FaCrown } from "react-icons/fa";
import { getUserById } from "../../../apis/user-api";
import Header from "../_components/Header";
import Footer from "../_components/Footer";

// --- TYPE DEFINITIONS (Giả lập cấu trúc dữ liệu) ---
interface UserData {
  user_id: number;
  user_name: string;
  full_name: string;
  email: string;
  level: number | null; // e.g., 1, 2, 3...
  band: number | string | null; // e.g., 3.0, 3.5, 4.0... hoặc "Below 3.0"
  picture: string | null;
}

interface CompletedExercise {
  readingId: string;
  readingNum: number;
  title: string;
  level: number;
  score: number;
  total: number;
  submittedAt: string;
}

interface CompletedByLevel {
  [key: number]: CompletedExercise[];
}

interface LevelInfo {
  level: number;
  band: number;
  title: string;
  totalExercises: number;
}

// Animated Counter Component
const AnimatedCounter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 100, damping: 15 });
  const display = useTransform(spring, (current) => current.toFixed(1));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

// Band Display Component để xử lý cả string và number
const BandDisplay = ({ band }: { band: number | string | null }) => {
  if (band === null || band === undefined) {
    return <span>N/A</span>;
  }
  if (typeof band === "string") {
    return <span>{band}</span>;
  }
  return <AnimatedCounter value={band} />;
};

// Mock levels function
const fetchAllLevels = async (): Promise<LevelInfo[]> => {
  return [
    { level: 1, band: 3.5, title: "Beginner Foundation", totalExercises: 5 },
    { level: 2, band: 4.0, title: "Elementary Progress", totalExercises: 8 },
    { level: 3, band: 4.5, title: "Pre-Intermediate", totalExercises: 10 },
    { level: 4, band: 5.0, title: "Intermediate Skills", totalExercises: 12 },
    { level: 5, band: 5.5, title: "Upper-Intermediate", totalExercises: 15 },
    { level: 6, band: 6.0, title: "Advanced Reading", totalExercises: 15 },
  ];
};

// --- DASHBOARD PAGE COMPONENT ---
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [completed, setCompleted] = useState<CompletedExercise[]>([]);
  const [allLevels, setAllLevels] = useState<LevelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [redoItem, setRedoItem] = useState<CompletedExercise | null>(null);
  const [openRedo, setOpenRedo] = useState(false);

  const completedByLevel: CompletedByLevel = completed.reduce((acc, item) => {
    if (!acc[item.level]) acc[item.level] = [];
    acc[item.level].push(item);
    return acc;
  }, {} as CompletedByLevel);

  const handleRedo = (item: CompletedExercise) => {
    setRedoItem(item);
    setOpenRedo(true);
  };
  const confirmRedo = () => {
    if (redoItem) {
      navigate(`/lessons/${redoItem.level}/reading${redoItem.readingNum}`);
    }
    setOpenRedo(false);
  };
  const cancelRedo = () => setOpenRedo(false);
  // Protected Route Logic
  useEffect(() => {
    const token = localStorage.getItem("token"); // Hoặc cách bạn quản lý token
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login", { state: { from: "/dashboard" } });
    } else {
      const loadDashboardData = async () => {
        try {
          // Lấy user (vẫn gọi API)
          const [userData, levelsData] = await Promise.all([
            getUserById(
              JSON.parse(localStorage.getItem("user") || "{}").user_id
            ),
            fetchAllLevels(), // vẫn dùng mock levels hoặc API thực nếu có
          ]);
          setUser(userData);

          // Lấy completed từ localStorage
          const localCompleted = JSON.parse(
            localStorage.getItem("reading_completed") || "[]"
          );
          setCompleted(localCompleted);

          setAllLevels(levelsData);
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadDashboardData();
    }
  }, [navigate]); // Calculate Progress Logic
  useEffect(() => {
    if (allLevels.length > 0) {
      if (user && user.level !== null && user.level !== undefined) {
        // Xác định level hiện tại dựa trên band (bao gồm cả "Below 3.0")
        let currentLevel = user.level;
        if (user.band !== null && user.band !== undefined) {
          if (user.band === "Below 3.0") {
            currentLevel = 1; // Chỉ override nếu band là "Below 3.0"
          }
        }

        // Convert currentLevel to number nếu là string
        const currentLevelNum =
          typeof currentLevel === "string"
            ? parseInt(currentLevel)
            : currentLevel; // Trường hợp đã làm assessment: tính progress từ level hiện tại
        const relevantLevels = allLevels.filter(
          (l) => l.level >= currentLevelNum
        );
        if (relevantLevels.length === 0) {
          setProgress(100); // User is at the highest level
          return;
        }
        const totalExercisesInPath = relevantLevels.reduce(
          (sum, level) => sum + level.totalExercises,
          0
        );
        const completedExercisesInPath = completed.filter((c) =>
          relevantLevels.some((l) => l.level === c.level)
        ).length;

        if (totalExercisesInPath > 0) {
          const calculatedProgress = Math.min(
            100,
            Math.round((completedExercisesInPath / totalExercisesInPath) * 100)
          );
          setProgress(calculatedProgress);
        }
      } else {
        // Trường hợp chưa làm assessment: tính progress từ tất cả levels
        const totalExercisesAll = allLevels.reduce(
          (sum, level) => sum + level.totalExercises,
          0
        );
        const completedExercisesAll = completed.length;

        if (totalExercisesAll > 0) {
          const calculatedProgress = Math.min(
            100,
            Math.round((completedExercisesAll / totalExercisesAll) * 100)
          );
          setProgress(calculatedProgress);
        } else {
          setProgress(0);
        }
      }
    }
  }, [user, completed, allLevels]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-purple-500 border-indigo-500/30 rounded-full"
          />
          <p className="text-purple-300 font-medium">Loading your path...</p>
        </div>
      </div>
    );
  }
  if (user && user.level === null) {
    return (
      <>
        <Header />
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900 p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg border border-purple-500/30 rounded-2xl shadow-xl p-8 max-w-lg text-center text-white"
          >
            <FaExclamationCircle className="text-6xl text-yellow-400 mx-auto mb-5" />
            <h2 className="text-3xl font-bold mb-3">
              Bắt đầu hành trình của bạn!
            </h2>
            <p className="text-purple-200/80 mb-8">
              Bạn cần hoàn thành bài kiểm tra đầu vào để chúng tôi có thể xây
              dựng lộ trình học tập phù hợp nhất cho bạn.
            </p>
            <motion.button
              onClick={() => navigate("/assessment")}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Làm bài kiểm tra ngay
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 text-gray-200 font-inter pt-30">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Remove framer-motion container/page entrance animation */}
          <div>
            <div className="mb-10 flex items-center gap-4">
              <img
                src={
                  user?.picture ||
                  `https://placehold.co/100x100/A78BFA/FFFFFF?text=${user?.full_name?.charAt(
                    0
                  )}`
                }
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-purple-400"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Chào mừng trở lại, {user?.full_name}!
                </h1>
                <p className="text-lg text-purple-300 mt-1">
                  Đây là lộ trình học tập được cá nhân hóa cho bạn.
                </p>
              </div>
            </div>{" "}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {" "}
              {/* Main Goal Card - Chỉ hiển thị khi đã làm assessment */}
              {user?.level !== null &&
              user?.level !== undefined &&
              user?.band !== null &&
              user?.band !== undefined ? (
                <motion.div
                  className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <div>
                    <p className="text-purple-300 text-lg">
                      Band điểm hiện tại của bạn:
                    </p>{" "}
                    <div className="flex items-baseline gap-4 mt-2">
                      <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Band <BandDisplay band={user?.band} />
                      </p>
                    </div>{" "}
                    {(() => {
                      // Xác định level được đề xuất dựa trên band
                      let recommendedLevel = user?.level;
                      if (user?.band !== null && user?.band !== undefined) {
                        if (user?.band === "Below 3.0") {
                          recommendedLevel = 1; // Chỉ override nếu band là "Below 3.0"
                        }
                      }
                      // Convert to number để hiển thị chính xác
                      const recommendedLevelNum =
                        typeof recommendedLevel === "string"
                          ? parseInt(recommendedLevel)
                          : recommendedLevel;

                      return (
                        <p className="mt-4 text-purple-200 text-xl">
                          Cấp độ được đề xuất cho bạn:{" "}
                          <strong className="font-bold text-white underline">
                            Level {recommendedLevelNum}
                          </strong>
                          .
                        </p>
                      );
                    })()}
                  </div>{" "}
                  {(() => {
                    // Xác định level để navigate
                    let targetLevel = user?.level;
                    if (user?.band !== null && user?.band !== undefined) {
                      if (user?.band === "Below 3.0") {
                        targetLevel = 1; // Chỉ override nếu band là "Below 3.0"
                      }
                    }
                    // Convert to number để navigate đúng
                    const targetLevelNum =
                      typeof targetLevel === "string"
                        ? parseInt(targetLevel)
                        : targetLevel;

                    return (
                      <motion.button
                        onClick={() => navigate(`/lessons/${targetLevelNum}`)}
                        className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                        whileHover={{ y: -3 }}
                      >
                        <FaRocket />
                        Bắt đầu ôn luyện theo level được đề xuất
                      </motion.button>
                    );
                  })()}
                </motion.div>
              ) : (
                /* Card khuyến khích làm assessment khi chưa làm */
                <motion.div
                  className="lg:col-span-2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border-2 border-gradient-to-r border-purple-400/30 rounded-3xl shadow-2xl p-8 flex flex-col justify-between relative overflow-hidden"
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-50"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <FaExclamationCircle className="text-3xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          Bạn chưa làm bài test đầu vào
                        </h3>
                        <p className="text-purple-300 text-lg">
                          Hãy làm bài test để cá nhân hóa lộ trình học tập
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                      <p className="text-purple-200 text-lg leading-relaxed">
                        🎯{" "}
                        <strong className="text-white">
                          Bạn có muốn làm bài test đầu vào
                        </strong>{" "}
                        để chúng tôi có thể xây dựng lộ trình học tập phù hợp
                        nhất với trình độ của bạn không?
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Đánh giá chính xác trình độ
                        </div>
                        <div className="flex items-center gap-2 text-blue-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Lộ trình học cá nhân hóa
                        </div>
                        <div className="flex items-center gap-2 text-yellow-300">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          Theo dõi tiến độ chi tiết
                        </div>
                        <div className="flex items-center gap-2 text-pink-300">
                          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                          Đề xuất bài tập phù hợp
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4">
                    <motion.button
                      onClick={() => navigate("/assessment-confirm")}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaRocket />
                      Làm bài test đầu vào ngay
                    </motion.button>
                    <motion.button
                      onClick={() => navigate("/lessons")}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-purple-200 font-semibold rounded-xl border border-purple-400/30 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Tự chọn level
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {/* Progress Donut Chart - Chỉ hiển thị khi đã làm assessment */}
              {user?.level !== null &&
                user?.level !== undefined &&
                user?.band !== null &&
                user?.band !== undefined && (
                  <motion.div className="flex items-center justify-center bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-2xl p-8">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          strokeWidth="10"
                          className="stroke-purple-500/10 fill-none"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="42"
                          strokeWidth="10"
                          className="stroke-purple-400 fill-none"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          strokeDasharray={2 * Math.PI * 42}
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 42 * (1 - progress / 100),
                          }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-bold text-white">
                          {progress}%
                        </span>
                        <span className="text-sm text-purple-300">
                          Hoàn thành
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}{" "}
            </div>
            {/* Learning Path */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Lộ trình của bạn
              </h2>{" "}
              <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {" "}
                {allLevels.map((level) => {
                  // Trường hợp 1: Đã làm bài test đầu vào (có level và band)
                  const hasAssessment =
                    user?.level !== null &&
                    user?.level !== undefined &&
                    user?.band !== null &&
                    user?.band !== undefined; // Xác định level được đề xuất dựa trên dữ liệu user
                  let recommendedLevel = user?.level;
                  if (
                    hasAssessment &&
                    user?.band !== null &&
                    user?.band !== undefined
                  ) {
                    // Nếu band "Below 3.0" thì đề xuất Level 1
                    if (user?.band === "Below 3.0") {
                      recommendedLevel = 1;
                    }
                    // Với các band số khác, sử dụng level từ user data (đã được tính từ API/assessment)
                  }

                  // Convert recommended level to number để so sánh chính xác
                  const recommendedLevelNum =
                    typeof recommendedLevel === "string"
                      ? parseInt(recommendedLevel)
                      : recommendedLevel;

                  // Kiểm tra có phải level được đề xuất không
                  const isCurrent =
                    hasAssessment && recommendedLevelNum === level.level;

                  return (
                    <motion.div
                      key={level.level}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? "bg-gradient-to-br from-purple-400/60 to-indigo-400/50 border-purple-200 shadow-purple-400/80 shadow-2xl ring-4 ring-purple-300/60"
                          : "bg-gray-700/50 border-gray-600 hover:border-purple-400/50 hover:bg-gray-600/50"
                      }`}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      animate={
                        isCurrent
                          ? {
                              boxShadow: [
                                "0 0 30px rgba(168, 85, 247, 0.4)",
                                "0 0 50px rgba(168, 85, 247, 0.7)",
                                "0 0 30px rgba(168, 85, 247, 0.4)",
                              ],
                            }
                          : {}
                      }
                      transition={
                        isCurrent
                          ? {
                              boxShadow: {
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }
                          : {}
                      }
                      onClick={() => navigate(`/lessons/${level.level}`)}
                    >
                      {" "}
                      {/* Chỉ hiển thị crown khi đã làm assessment và đây là level hiện tại */}
                      {isCurrent && (
                        <>
                          <motion.div
                            animate={{
                              rotate: [10, 15, 10],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <FaCrown className="absolute -top-3 -right-3 text-4xl text-yellow-300 drop-shadow-xl" />
                          </motion.div>
                          {/* Badge "HIỆN TẠI" với hiệu ứng pulse */}
                          <motion.div
                            className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-300 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-xl border-2 border-white"
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            HIỆN TẠI
                          </motion.div>
                        </>
                      )}{" "}
                      <p
                        className={`font-bold text-2xl ${
                          isCurrent ? "text-white drop-shadow-lg" : "text-white"
                        }`}
                      >
                        Level {level.level}
                      </p>
                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? "text-yellow-200 drop-shadow-sm font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        Band {level.band.toFixed(1)}+
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            {/* Completed Exercises Section */}
            <div className="mt-12">
              <h3 className="font-bold text-3xl text-purple-300 mb-6">
                Lịch sử làm bài
              </h3>
              {Object.entries(completedByLevel).length === 0 && (
                <motion.div
                  className="text-lg text-gray-400 italic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Bạn chưa làm bài nào
                </motion.div>
              )}
              <div className="space-y-8">
                {Object.entries(completedByLevel).map(([level, list]) => (
                  <motion.div
                    key={level}
                    className=""
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="font-bold text-xl text-purple-400 mb-3">
                      Level {level}
                    </div>
                    <div className="flex flex-col gap-4">
                      {(list as CompletedExercise[]).map((item) => (
                        <motion.div
                          key={item.readingId}
                          className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 rounded-2xl shadow-lg bg-gradient-to-r from-gray-800/90 via-gray-700/90 to-gray-800/90 border-2 border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:border-purple-400/60 hover:shadow-purple-500/20"
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.25)",
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-pink-900/10 opacity-50"></div>

                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                              <div className="font-bold text-xl text-white drop-shadow-sm">
                                {item.title ?? `Reading ${item.readingNum}`}
                              </div>
                            </div>
                            <div className="text-gray-300 text-base flex flex-wrap items-center gap-2">
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/60 border border-green-500/30 rounded-full">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span className="font-semibold text-green-300">
                                  {item.score}/{item.total ?? 40} câu đúng
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/60 border border-blue-500/30 rounded-full">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                <span className="text-blue-300 font-medium">
                                  {Math.round(
                                    (item.score / (item.total ?? 40)) * 100
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-900/60 border border-purple-500/30 rounded-full">
                                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                <span className="text-purple-300 font-medium">
                                  {item.submittedAt
                                    ? new Date(
                                        item.submittedAt
                                      ).toLocaleDateString("vi-VN")
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)",
                            }}
                            className="relative z-10 mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:from-purple-500 hover:to-pink-500 border border-purple-400/30 cursor-pointer"
                            onClick={() => handleRedo(item)}
                          >
                            <div className="flex items-center gap-2">
                              <FaRocket className="text-sm" />
                              Làm lại
                            </div>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>{" "}
            {/* MODAL Làm lại với thiết kế tối hiện đại */}
            {openRedo && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={cancelRedo}
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, y: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-gray-900 border border-purple-500/30 max-w-md w-full mx-4 rounded-3xl shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header với gradient tối */}
                  <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-pink-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <FaRocket className="text-xl text-purple-200" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Xác nhận làm lại
                            </h3>
                            <p className="text-purple-200 text-sm">
                              Bài tập Reading
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center text-red-300 hover:text-red-200 hover:bg-red-500/30 transition-all"
                          onClick={cancelRedo}
                        >
                          ✕
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Body với theme tối */}
                  <div className="p-6 bg-gray-900">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationCircle className="text-2xl text-orange-400" />
                      </div>
                      <p className="text-gray-200 text-lg leading-relaxed">
                        Bạn có chắc chắn muốn làm lại bài{" "}
                        <span className="font-bold text-purple-400">
                          {redoItem?.title ?? `Reading ${redoItem?.readingNum}`}
                        </span>{" "}
                        không?
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
                        onClick={cancelRedo}
                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500 cursor-pointer"
                      >
                        Hủy bỏ
                      </motion.button>
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          y: -1,
                          boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={confirmRedo}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 border border-purple-400/50 cursor-pointer"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <FaRocket className="text-sm" />
                          Làm lại ngay
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>{" "}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
