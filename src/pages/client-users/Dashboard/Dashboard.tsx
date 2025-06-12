import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  FaBook,
  FaRedo,
  FaRocket,
  FaExclamationCircle,
  FaCrown,
  FaCheckCircle,
} from "react-icons/fa";

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
  id: string;
  title: string;
  level: number;
  score: number;
  totalQuestions: number;
  dateCompleted: string;
}

interface LevelInfo {
  level: number;
  band: number;
  title: string;
  totalExercises: number;
}

// --- MOCK API (Giả lập các hàm gọi API) ---
// Giả lập API lấy thông tin người dùng
const fetchUserData = async (): Promise<UserData> => {
  console.log("Fetching user data...");
  // Trong thực tế, bạn sẽ gọi API thật ở đây
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user_id: 1,
        user_name: "phongx2003",
        full_name: "Lê Văn Phong",
        email: "phong@gmail.com",
        level: 3, // Người dùng đang ở Level 3
        band: 4.0,
        picture: "https://placehold.co/100x100/A78BFA/FFFFFF?text=P",
      });
    }, 800);
  });
};

// Giả lập API lấy danh sách bài đã hoàn thành
const fetchCompletedExercises = async (): Promise<CompletedExercise[]> => {
  console.log("Fetching completed exercises...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "read001",
          title: "The History of Glass",
          level: 1,
          score: 9,
          totalQuestions: 13,
          dateCompleted: "2024-06-10",
        },
        {
          id: "read002",
          title: "Volcanoes - A Fiery Force",
          level: 1,
          score: 11,
          totalQuestions: 13,
          dateCompleted: "2024-06-11",
        },
        {
          id: "read005",
          title: "The Life of a Honeybee",
          level: 2,
          score: 12,
          totalQuestions: 14,
          dateCompleted: "2024-06-12",
        },
        {
          id: "read008",
          title: "Exploring the Deep Sea",
          level: 2,
          score: 10,
          totalQuestions: 14,
          dateCompleted: "2024-06-14",
        },
        {
          id: "read012",
          title: "The Art of Storytelling",
          level: 3,
          score: 8,
          totalQuestions: 15,
          dateCompleted: "2024-06-15",
        },
      ]);
    }, 1200);
  });
};

// Giả lập API lấy thông tin tất cả các level và bài tập
const fetchAllLevels = async (): Promise<LevelInfo[]> => {
  console.log("Fetching all levels info...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          level: 1,
          band: 3.0,
          title: "Beginner Foundation",
          totalExercises: 5,
        },
        {
          level: 2,
          band: 3.5,
          title: "Elementary Progress",
          totalExercises: 8,
        },
        { level: 3, band: 4.0, title: "Pre-Intermediate", totalExercises: 10 },
        {
          level: 4,
          band: 4.5,
          title: "Intermediate Skills",
          totalExercises: 12,
        },
        {
          level: 5,
          band: 5.0,
          title: "Upper-Intermediate",
          totalExercises: 15,
        },
        { level: 6, band: 6.0, title: "Advanced Reading", totalExercises: 15 },
      ]);
    }, 500);
  });
};

// Animated Counter Component
const AnimatedCounter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 100, damping: 15 });
  const display = useTransform(spring, (current) => current.toFixed(1));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

// --- DASHBOARD PAGE COMPONENT ---
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [completed, setCompleted] = useState<CompletedExercise[]>([]);
  const [allLevels, setAllLevels] = useState<LevelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Protected Route Logic
  useEffect(() => {
    const token = localStorage.getItem("token"); // Hoặc cách bạn quản lý token
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login", { state: { from: "/dashboard" } });
    } else {
      const loadDashboardData = async () => {
        try {
          const [userData, completedData, levelsData] = await Promise.all([
            fetchUserData(),
            fetchCompletedExercises(),
            fetchAllLevels(),
          ]);
          setUser(userData);
          setCompleted(completedData);
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
            <h2 className="text-3xl font-bold text-white mb-6">
              Lịch sử làm bài
            </h2>
            {/* Remove AnimatePresence and framer-motion entrance/exit for completed exercises */}
            {completed.length > 0 ? (
              <div className="space-y-4">
                {completed.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
                    initial={false}
                    animate={false}
                  >
                    <div className="flex items-center gap-5 w-full">
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg text-2xl shadow-lg">
                        <FaBook />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-100">
                          {item.title}
                        </h3>
                        <p className="text-sm text-purple-300/80">
                          Level: {item.level} | Score: {item.score}/
                          {item.totalQuestions}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <motion.button
                          onClick={() =>
                            navigate(`/assessment/exercise/${item.id}`)
                          }
                          className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 text-purple-200 font-semibold rounded-lg hover:bg-purple-500/40 hover:text-white transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaRedo />
                          <span>Làm lại</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-white/5 backdrop-blur-md p-8 rounded-xl border border-purple-500/20 text-purple-300">
                Bạn chưa hoàn thành bài tập nào. Hãy bắt đầu ngay!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
