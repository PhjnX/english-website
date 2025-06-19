import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaBook,
  FaRedo,
  FaRocket,
  FaExclamationCircle,
  FaCrown,
  FaTimes,
  FaPlay,
} from "react-icons/fa";
import { getUserInfo } from "../../../apis/auth-api";
import { getUserById } from "../../../apis/user-api";
import { getAllReadingTests } from "../../../apis/reading-api";
import { saveReadingPracticeResult } from "../../../utils/mockData";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
// --- TYPE DEFINITIONS ---
interface UserData {
  user_id: number;
  user_name: string;
  full_name: string;
  email: string;
  level: number | null;
  band: number | null;
  picture: string | null;
}

interface CompletedExercise {
  id: string;
  title: string;
  level: number;
  readingNum: number;
  score: number;
  totalQuestions: number;
  dateCompleted: string;
  type: "reading-practice" | "assessment";
}

interface LevelInfo {
  level: number;
  band: string;
  title: string;
  totalExercises: number;
  isUnlocked: boolean;
}

interface ReadingTest {
  id: number;
  level: string;
  reading_num: string;
  title: string;
}

// --- API FUNCTIONS ---
const fetchUserData = async (): Promise<UserData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const userInfo = await getUserInfo(token);
  const userDetail = await getUserById(userInfo.user_id);

  return {
    user_id: userInfo.user_id,
    user_name: userInfo.user_name,
    full_name: userInfo.full_name || userInfo.user_name,
    email: userInfo.email,
    level: userDetail.level ? parseInt(userDetail.level) : null,
    band: userDetail.band ? parseFloat(userDetail.band) : null,
    picture: userInfo.picture || null,
  };
};

const fetchCompletedExercises = async (): Promise<CompletedExercise[]> => {
  console.log("🔵 fetchCompletedExercises called");
  
  // Chỉ lấy từ localStorage, không set mock data
  const userData = localStorage.getItem("user_completed_exercises");
  console.log("🔵 Raw localStorage data:", userData);
  
  if (userData) {
    try {
      const exercises = JSON.parse(userData);
      console.log("🔵 Parsed exercises:", exercises.length, exercises);
      
      // Cleanup duplicates và chuẩn hóa title
      const uniqueExercises = exercises.filter((exercise: any, index: number, self: any[]) => {
        return index === self.findIndex((ex: any) => 
          ex.level === exercise.level && 
          ex.readingNum === exercise.readingNum &&
          ex.type === exercise.type
        );
      });

      // Chuẩn hóa title
      const normalizedExercises = uniqueExercises.map((ex: any) => ({
        ...ex,
        title: ex.type === "reading-practice" ? `Reading ${ex.readingNum}` : ex.title
      }));

      console.log("🔵 After normalization:", normalizedExercises.length, normalizedExercises);

      // Nếu có sự thay đổi, lưu lại localStorage
      if (normalizedExercises.length !== exercises.length || 
          JSON.stringify(normalizedExercises) !== JSON.stringify(exercises)) {
        localStorage.setItem("user_completed_exercises", JSON.stringify(normalizedExercises));
        console.log(`🟢 Cleaned up exercises: ${normalizedExercises.length} unique from ${exercises.length} total`);
      }

      return normalizedExercises;
    } catch (error) {
      console.error("❌ Error parsing completed exercises:", error);
      return [];
    }
  }

  console.log("🔵 No data found in localStorage");
  // Trả về array rỗng nếu chưa có data thực
  return [];
};

const fetchAllReadingTests = async (): Promise<ReadingTest[]> => {
  try {
    const tests = await getAllReadingTests();
    return tests;
  } catch (error) {
    console.error("Failed to fetch reading tests:", error);
    return [];
  }
};

const fetchAllLevels = async (): Promise<LevelInfo[]> => {
  // Định nghĩa tất cả các level theo yêu cầu
  const allLevelsData = [
    { level: 1, band: "3.5+", title: "Beginner Foundation", totalExercises: 0 },
    { level: 2, band: "4.0+", title: "Elementary Progress", totalExercises: 0 },
    { level: 3, band: "4.5+", title: "Pre-Intermediate", totalExercises: 0 },
    { level: 4, band: "5.0+", title: "Intermediate Skills", totalExercises: 0 },
    { level: 5, band: "5.5+", title: "Upper-Intermediate", totalExercises: 0 },
    { level: 6, band: "6.0+", title: "Advanced Reading", totalExercises: 0 },
  ];

  // Lấy số lượng bài test thực từ API
  const readingTests = await fetchAllReadingTests();

  // Đếm số bài theo level
  const levelCounts = allLevelsData.map((levelData) => {
    const count = readingTests.filter(
      (test) => parseInt(test.level) === levelData.level
    ).length;
    return {
      ...levelData,
      totalExercises: count,
      isUnlocked: true, // Tất cả level đều unlock theo yêu cầu
    };
  });

  return levelCounts;
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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  exercise,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  exercise?: CompletedExercise;
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-purple-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaPlay className="text-2xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            {exercise && (
              <div className="bg-white/10 rounded-xl p-4 mb-6 border border-purple-500/20">
                <h4 className="font-semibold text-white text-lg mb-2">
                  {exercise.title}
                </h4>
                <div className="flex justify-center gap-4 text-sm text-purple-200">
                  <span>Level {exercise.level}</span>
                  <span>•</span>
                  <span>
                    Điểm: {exercise.score}/{exercise.totalQuestions}
                  </span>
                </div>
              </div>
            )}
            <p className="text-purple-200 text-lg mb-8 leading-relaxed">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-200"
              >
                Hủy bỏ
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
              >
                Làm lại ngay
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- DASHBOARD PAGE COMPONENT ---
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [completed, setCompleted] = useState<CompletedExercise[]>([]);
  const [allLevels, setAllLevels] = useState<LevelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<CompletedExercise | null>(null);
  // Protected Route Logic và reload data khi quay lại
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login", { state: { from: "/dashboard" } });
    } else {
      const loadDashboardData = async () => {
        try {
          const userData = await fetchUserData();
          const completedData = await fetchCompletedExercises();
          const levelsData = await fetchAllLevels();

          setUser(userData);
          setCompleted(completedData);
          setAllLevels(levelsData);
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
          // If API fails, fallback to login
          navigate("/login", { state: { from: "/dashboard" } });
        } finally {
          setIsLoading(false);
        }
      };
      loadDashboardData();
    }
  }, [navigate]);  // Reload data khi component được focus lại (user quay về từ reading practice)
  useEffect(() => {
    const handleFocus = async () => {
      console.log("🔵 Window focus detected, refreshing dashboard data");
      try {
        const completedData = await fetchCompletedExercises();
        setCompleted(completedData);
        console.log("🟢 Dashboard data refreshed on focus, exercises:", completedData.length);
      } catch (error) {
        console.error("❌ Failed to refresh dashboard data:", error);
      }
    };

    // Refresh data khi user navigate về trang này
    const handlePopState = async () => {
      console.log("🔵 Popstate detected, refreshing dashboard data");
      try {
        const completedData = await fetchCompletedExercises();
        setCompleted(completedData);
        console.log("🟢 Dashboard data refreshed on navigation, exercises:", completedData.length);
      } catch (error) {
        console.error("❌ Failed to refresh dashboard data:", error);
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  // Calculate Progress Logic
  useEffect(() => {
    if (user && allLevels.length > 0) {
      if (user.level && user.band) {
        // Trường hợp 1: Đã làm test đầu vào - tính từ level hiện tại trở lên
        const relevantLevels = allLevels.filter((l) => l.level >= user.level!);
        const totalExercises = relevantLevels.reduce(
          (sum, level) => sum + level.totalExercises,
          0
        );
        const completedExercises = completed.filter(
          (c) => c.level >= user.level!
        ).length;

        if (totalExercises > 0) {
          const calculatedProgress = Math.min(
            100,
            Math.round((completedExercises / totalExercises) * 100)
          );
          setProgress(calculatedProgress);
        }
      } else {
        // Trường hợp 2: Chưa làm test đầu vào - tính tất cả level
        const totalExercises = allLevels.reduce(
          (sum, level) => sum + level.totalExercises,
          0
        );
        const completedExercises = completed.length;

        if (totalExercises > 0) {
          const calculatedProgress = Math.min(
            100,
            Math.round((completedExercises / totalExercises) * 100)
          );
          setProgress(calculatedProgress);
        }
      }
    }
  }, [user, completed, allLevels]);

  // Handle exercise retry
  const handleRetryExercise = (exercise: CompletedExercise) => {
    setSelectedExercise(exercise);
    setShowConfirmModal(true);
  };
  const confirmRetry = () => {
    if (selectedExercise) {
      setShowConfirmModal(false);
      // Navigate tới bài reading practice cụ thể
      navigate(
        `/reading-practice/${selectedExercise.level}/${selectedExercise.readingNum}`
      );
    }
  };

  // Group exercises by level
  const groupedExercises = completed.reduce((acc, exercise) => {
    if (!acc[exercise.level]) {
      acc[exercise.level] = [];
    }
    acc[exercise.level].push(exercise);
    return acc;
  }, {} as Record<number, CompletedExercise[]>);

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
  if (user && (user.level === null || user.band === null)) {
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
            Bạn chưa làm bài test đầu vào. Bạn có muốn làm bài test đầu vào để
            cá nhân hóa lộ trình học tập phù hợp nhất cho mình không?
          </p>
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={() => navigate("/assessment-confirm")}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Làm bài kiểm tra ngay
            </motion.button>
            <motion.button
              onClick={() => navigate("/lessons")}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Bỏ qua, học thử ngay
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 text-gray-200 font-inter">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 !pt-32">
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
                </div>{" "}
                <motion.button
                  onClick={() => navigate(`/lessons/${user?.level}`)}
                  className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -3 }}
                >
                  <FaRocket />
                  Bắt đầu ôn luyện theo level đề xuất
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
                    <span className="text-sm text-purple-300">Hoàn thành</span>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Learning Path */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Lộ trình của bạn
              </h2>{" "}              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allLevels.map((level) => {
                  // Logic hiển thị theo trường hợp
                  const hasLevelAndBand = user?.level && user?.band;
                  const isCurrent =
                    hasLevelAndBand && user?.level === level.level;

                  return (
                    <motion.div
                      key={level.level}
                      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                        isCurrent
                          ? "bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-purple-400 shadow-purple-500/30 shadow-xl"
                          : "bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-purple-400/50 hover:shadow-lg"
                      }`}
                      whileHover={{ y: -8, scale: 1.02 }}
                      onClick={() => navigate(`/lessons/${level.level}`)}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
                      </div>

                      {/* Crown icon for current level */}
                      {hasLevelAndBand && isCurrent && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-3 shadow-lg z-10"
                        >
                          <FaCrown className="text-2xl text-white" />
                        </motion.div>
                      )}

                      {/* Content */}
                      <div className="relative p-8 text-center">
                        {/* Level Number */}
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                          isCurrent 
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg" 
                            : "bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-purple-600 group-hover:to-indigo-600"
                        } transition-all duration-300`}>
                          <span className="text-3xl font-bold text-white">{level.level}</span>
                        </div>

                        {/* Band */}
                        <div className={`inline-block px-4 py-2 rounded-full mb-4 text-sm font-semibold ${
                          isCurrent
                            ? "bg-purple-500/20 text-purple-200 border border-purple-400/30"
                            : "bg-gray-600/30 text-gray-300 border border-gray-500/30 group-hover:bg-purple-500/20 group-hover:text-purple-200 group-hover:border-purple-400/30"
                        } transition-all duration-300`}>
                          Band {level.band}
                        </div>

                        {/* Title */}
                        <h3 className={`text-xl font-bold mb-2 ${
                          isCurrent ? "text-white" : "text-gray-200 group-hover:text-white"
                        } transition-colors duration-300`}>
                          Level {level.level}
                        </h3>

                        <p className={`text-base ${
                          isCurrent ? "text-purple-200" : "text-gray-400 group-hover:text-purple-200"
                        } transition-colors duration-300`}>
                          {level.title}
                        </p>

                        {/* Exercise Count */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                          <FaBook className="text-xs" />
                          <span>{level.totalExercises} bài tập</span>
                        </div>

                        {/* Current Level Badge */}
                        {hasLevelAndBand && isCurrent && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Level hiện tại
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  );
                })}
              </div>
            </div>{" "}
            {/* Completed Exercises Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Lịch sử làm bài
              </h2>
              {Object.keys(groupedExercises).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedExercises)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort by level descending
                    .map(([level, exercises]) => (
                      <div key={level} className="space-y-3">
                        <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                          <FaBook className="text-purple-400" />
                          Level {level}
                          <span className="text-sm text-purple-400 ml-2">
                            ({exercises.length} bài đã hoàn thành)
                          </span>
                        </h3>
                        <div className="grid gap-3">
                          {exercises.map((item) => (
                            <motion.div
                              key={item.id}
                              className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-center gap-4 w-full">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg text-xl shadow-lg">
                                  <FaBook />
                                </div>{" "}
                                <div className="flex-grow">
                                  <h4 className="font-bold text-lg text-gray-100">
                                    {item.title}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-purple-300/80">
                                    <span>
                                      Điểm: {item.score}/{item.totalQuestions}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {Math.round(
                                        (item.score / item.totalQuestions) * 100
                                      )}
                                      %
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {new Date(
                                        item.dateCompleted
                                      ).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <motion.button
                                    onClick={() => handleRetryExercise(item)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/20 text-purple-200 font-semibold rounded-lg hover:bg-purple-500/40 hover:text-white transition-colors duration-200"
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
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center bg-white/5 backdrop-blur-md p-8 rounded-xl border border-purple-500/20 text-purple-300">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-xl mb-2">
                    Chưa có bài tập nào được hoàn thành
                  </p>
                  <p className="text-purple-400">
                    Hãy bắt đầu hành trình học tập của bạn ngay!
                  </p>
                </div>              )}
            </div>

            {/* Debug Info và Refresh Button (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Debug Info (Development)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-400">
                  <div>
                    <span className="font-medium">Completed Exercises:</span> {completed.length}
                  </div>
                  <div>
                    <span className="font-medium">Current Progress:</span> {progress}%
                  </div>
                  <div>
                    <span className="font-medium">User Level:</span> {user?.level || 'N/A'}
                  </div>
                </div>                <div className="flex gap-2 mt-3">
                  <button
                    onClick={async () => {
                      console.log("🔵 Manual refresh button clicked");
                      const completedData = await fetchCompletedExercises();
                      setCompleted(completedData);
                      console.log("🟢 Manual refresh completed, exercises:", completedData.length);
                    }}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded text-xs hover:bg-blue-600/40 transition-colors"
                  >
                    Refresh Data
                  </button>
                  <button
                    onClick={() => {
                      console.log("🔵 Check localStorage button clicked");
                      const data = localStorage.getItem("user_completed_exercises");
                      console.log("🔵 Current localStorage data:", data);
                      if (data) {
                        const parsed = JSON.parse(data);
                        console.log("🔵 Parsed data:", parsed);
                        alert(`Found ${parsed.length} exercises in localStorage. Check console for details.`);
                      } else {
                        alert("No data found in localStorage");
                      }
                    }}
                    className="px-3 py-1 bg-green-600/20 text-green-300 rounded text-xs hover:bg-green-600/40 transition-colors"
                  >
                    Check localStorage
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all completed exercises?")) {
                        localStorage.removeItem("user_completed_exercises");
                        setCompleted([]);
                        console.log("🟢 Cleared all data");
                      }
                    }}
                    className="px-3 py-1 bg-red-600/20 text-red-300 rounded text-xs hover:bg-red-600/40 transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={confirmRetry}
              title="Làm lại bài tập"
              message="Bạn có chắc chắn muốn làm lại bài tập này không? Điểm số hiện tại sẽ được thay thế bằng điểm số mới."
              exercise={selectedExercise || undefined}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;

// Export function để sử dụng trong ReadingPracticeScore
export { saveReadingPracticeResult };
