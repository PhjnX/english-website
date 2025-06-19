import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  FaRocket,
  FaExclamationCircle,
  FaCrown,
  FaCheckCircle,
} from "react-icons/fa";
import { getUserById } from "../../../apis/user-api";

// --- TYPE DEFINITIONS (Giả lập cấu trúc dữ liệu) ---
interface UserData {
  user_id: number;
  user_name: string;
  full_name: string;
  email: string;
  level: number | null; // e.g., 1, 2, 3...
  band: number | null; // e.g., 3.0, 3.5, 4.0...
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

// Mock levels function
const fetchAllLevels = async (): Promise<LevelInfo[]> => {
  return [
    { level: 1, band: 3.0, title: "Beginner Foundation", totalExercises: 5 },
    { level: 2, band: 3.5, title: "Elementary Progress", totalExercises: 8 },
    { level: 3, band: 4.0, title: "Pre-Intermediate", totalExercises: 10 },
    { level: 4, band: 4.5, title: "Intermediate Skills", totalExercises: 12 },
    { level: 5, band: 5.0, title: "Upper-Intermediate", totalExercises: 15 },
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
  }, [navigate]);

  // Calculate Progress Logic
  useEffect(() => {
    if (user && user.level && allLevels.length > 0) {
      const relevantLevels = allLevels.filter((l) => l.level >= user.level!);
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900 p-4">
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
            Bạn cần hoàn thành bài kiểm tra đầu vào để chúng tôi có thể xây dựng
            lộ trình học tập phù hợp nhất cho bạn.
          </p>
          <motion.button
            onClick={() => navigate("/assessment-confirm")}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Làm bài kiểm tra ngay
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 text-gray-200 font-inter">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Main Goal Card */}
            <motion.div
              className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <div>
                <p className="text-purple-300 text-lg">
                  Mục tiêu hiện tại của bạn:
                </p>
                <div className="flex items-baseline gap-4 mt-2">
                  <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Band{" "}
                    {user && user.band ? (
                      <AnimatedCounter value={user.band} />
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <p className="mt-4 text-purple-200 text-xl">
                  Lộ trình của bạn đang ở{" "}
                  <strong className="font-bold text-white underline">
                    Level {user?.level}
                  </strong>
                  .
                </p>
              </div>
              <motion.button
                onClick={() => navigate(`/assessment/level/${user?.level}`)}
                className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
                whileHover={{ y: -3 }}
              >
                <FaRocket />
                Tiếp tục ôn luyện
              </motion.button>
            </motion.div>

            {/* Progress Donut Chart */}
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
                      strokeDashoffset: 2 * Math.PI * 42 * (1 - progress / 100),
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-white">
                    {progress}%
                  </span>
                  <span className="text-sm text-purple-300">Hoàn thành</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Learning Path */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Lộ trình của bạn
            </h2>
            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {allLevels.map((level) => {
                const isCompleted = user?.level! > level.level;
                const isCurrent = user?.level === level.level;
                return (
                  <motion.div
                    key={level.level}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500/20 border-green-500"
                        : isCurrent
                        ? "bg-purple-500/30 border-purple-400 shadow-purple-500/50 shadow-lg"
                        : "bg-gray-700/50 border-gray-600"
                    }`}
                    whileHover={{ y: -5, scale: 1.03 }}
                  >
                    {isCompleted && (
                      <FaCheckCircle className="absolute -top-2 -right-2 text-2xl text-green-400 bg-gray-800 rounded-full" />
                    )}
                    {isCurrent && (
                      <FaCrown className="absolute -top-3 -right-3 text-3xl text-yellow-400 rotate-12" />
                    )}

                    <p className="font-bold text-2xl text-white">
                      {level.level}
                    </p>
                    <p
                      className={`font-semibold ${
                        isCurrent ? "text-purple-200" : "text-gray-400"
                      }`}
                    >
                      Band {level.band.toFixed(1)}
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        isCurrent ? "text-purple-300" : "text-gray-500"
                      }`}
                    >
                      {level.title}
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
                        className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl shadow-lg bg-gradient-to-r from-[#ede7f6] to-[#fce4ec] border border-purple-200/60 transition hover:scale-[1.01] hover:shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div>
                          <div className="font-bold text-xl text-purple-800 drop-shadow mb-1">
                            {item.title ?? `Reading ${item.readingNum}`}
                          </div>
                          <div className="text-gray-700 text-base">
                            <span className="font-semibold text-green-600">
                              Điểm: {item.score}
                            </span>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-gray-600">
                              {item.total ?? 40}
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span>
                              Ngày:{" "}
                              <span className="text-gray-700">
                                {item.submittedAt
                                  ? new Date(
                                      item.submittedAt
                                    ).toLocaleTimeString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })
                                  : ""}
                              </span>
                              <span className="text-gray-500">
                                {item.submittedAt
                                  ? " " +
                                    new Date(
                                      item.submittedAt
                                    ).toLocaleDateString("vi-VN")
                                  : ""}
                              </span>
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{
                            background:
                              "linear-gradient(90deg,#a78bfa,#ec4899)",
                            color: "#fff",
                            scale: 1.04,
                          }}
                          className="mt-2 md:mt-0 px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md transition-all duration-200"
                          onClick={() => handleRedo(item)}
                        >
                          Làm lại
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MODAL Làm lại dùng tailwind + framer-motion */}
          {openRedo && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 40, opacity: 0 }}
                className="bg-white max-w-sm w-full rounded-xl shadow-xl p-7 text-center relative"
              >
                <div className="text-3xl mb-3 text-purple-700 font-bold">
                  Xác nhận làm lại bài
                </div>
                <div className="text-base text-gray-700 mb-6">
                  Bạn có chắc chắn muốn làm lại bài này không? Kết quả cũ sẽ bị
                  thay thế.
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={confirmRedo}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Làm lại
                  </button>
                  <button
                    onClick={cancelRedo}
                    className="px-5 py-2 bg-gray-200 font-semibold rounded-lg hover:bg-gray-300 transition"
                  >
                    Huỷ
                  </button>
                </div>
                <button
                  className="absolute top-3 right-3 text-xl text-gray-400 hover:text-purple-600"
                  onClick={cancelRedo}
                >
                  &times;
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
