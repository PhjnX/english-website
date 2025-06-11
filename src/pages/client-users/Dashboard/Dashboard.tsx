import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBook,
  FaChartLine,
  FaRedo,
  FaRocket,
  FaUserGraduate,
  FaExclamationCircle,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

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
        level: 2, // Người dùng đang ở Level 2
        band: 3.5,
        picture: null,
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
          score: 7,
          totalQuestions: 14,
          dateCompleted: "2024-06-12",
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
      // Fetch all data if token exists
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
    if (user && user.level && allLevels.length > 0 && completed.length > 0) {
      const relevantLevels = allLevels.filter((l) => l.level >= user.level!);

      const totalExercisesInPath = relevantLevels.reduce(
        (sum, level) => sum + level.totalExercises,
        0
      );

      const completedExercisesInPath = completed.filter((c) =>
        relevantLevels.some((l) => l.level === c.level)
      ).length;

      if (totalExercisesInPath > 0) {
        const calculatedProgress = Math.round(
          (completedExercisesInPath / totalExercisesInPath) * 100
        );
        setProgress(calculatedProgress);
      }
    }
  }, [user, completed, allLevels]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-purple-500 border-purple-200 rounded-full"
        />
      </div>
    );
  }

  // Handle case where user hasn't taken the initial test
  if (user && user.level === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-lg text-center"
        >
          <FaExclamationCircle className="text-5xl text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-purple-800 mb-2">
            Bắt đầu hành trình của bạn!
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần hoàn thành bài kiểm tra đầu vào để chúng tôi có thể xây dựng
            lộ trình học tập phù hợp nhất cho bạn.
          </p>
          <motion.button
            onClick={() => navigate("/assessment-confirm")} // Navigate to confirmation page before test
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-indigo-100 text-gray-800 font-inter">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
              Chào mừng trở lại, {user?.full_name}!
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Đây là lộ trình học tập được cá nhân hóa cho bạn.
            </p>
          </motion.div>

          {/* Main Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-500 rounded-2xl shadow-xl p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-center md:text-left">
              <p className="text-purple-200 text-lg">
                Bạn đã hoàn thành bài test đầu vào. Kết quả của bạn là:
              </p>
              <div className="flex items-baseline justify-center md:justify-start gap-4 mt-2">
                <p className="text-5xl font-bold">{user?.band}</p>
                <p className="text-2xl text-purple-200">IELTS Band</p>
              </div>
              <p className="mt-4 text-purple-100 text-xl">
                Lộ trình của bạn sẽ bắt đầu từ{" "}
                <strong className="font-bold text-white underline">
                  Level {user?.level}
                </strong>
                .
              </p>
            </div>
            <motion.button
              onClick={() => navigate(`/assessment/level/${user?.level}`)} // Navigate to the recommended level
              className="flex-shrink-0 flex items-center gap-3 px-8 py-4 bg-white text-purple-700 font-bold rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -3 }}
            >
              <FaRocket />
              Bắt đầu ôn luyện
            </motion.button>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-purple-800">
                Tiến độ Lộ trình
              </h2>
              <span className="text-2xl font-bold text-indigo-600">
                {progress}%
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Phần trăm bài tập đã hoàn thành từ Level {user?.level} trở lên.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Completed Exercises Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              Lịch sử làm bài
            </h2>
            <AnimatePresence>
              {completed.length > 0 ? (
                <motion.div className="space-y-4">
                  {completed.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                      className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg hover:border-purple-400 border border-transparent transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-2xl">
                          <FaBook />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Level: {item.level} | Score: {item.score}/
                            {item.totalQuestions}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() =>
                          navigate(`/assessment/exercise/${item.id}`)
                        } // Navigate to the specific exercise
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaRedo />
                        Làm lại
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center bg-white p-8 rounded-xl shadow-md text-gray-500"
                >
                  Bạn chưa hoàn thành bài tập nào. Hãy bắt đầu ngay!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
