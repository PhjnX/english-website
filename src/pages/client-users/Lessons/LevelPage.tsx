import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaBolt, FaFire, FaClock, FaRegSadTear } from "react-icons/fa";
import { getAllReadingTests } from "../../../apis/reading-api";
import Header from "../_components/Header"; // Assuming path is correct
import Footer from "../_components/Footer"; // Assuming path is correct

// --- TYPE DEFINITIONS ---
interface ExerciseTest {
  id: number;
  title: string;
  time: number;
  level: number;
}

// --- CONFIGURATION FOR LEVEL-SPECIFIC STYLING ---
const levelConfig = {
  easy: {
    gradient: "from-green-500 to-teal-500",
    shadow: "shadow-teal-500/30",
    icon: <FaLeaf />,
    desc: "Khởi động nhẹ nhàng, làm quen với các dạng bài đọc.",
  },
  medium: {
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-orange-500/30",
    icon: <FaBolt />,
    desc: "Nâng cao kỹ năng, thử thách với các chủ đề phức tạp hơn.",
  },
  hard: {
    gradient: "from-rose-500 to-red-600",
    shadow: "shadow-red-500/30",
    icon: <FaFire />,
    desc: "Chinh phục những đề khó, bứt phá band điểm!",
  },
};

const getConfigByLevel = (level: number) => {
  if (level >= 5) return levelConfig.hard;
  if (level >= 3) return levelConfig.medium;
  return levelConfig.easy;
};

// --- SKELETON CARD COMPONENT FOR LOADING STATE ---
const SkeletonCard = () => (
  <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
    <div className="h-24 bg-gray-700/50 rounded-lg"></div>
    <div className="h-6 bg-gray-700/50 rounded"></div>
    <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
    <div className="h-12 bg-gray-700/50 rounded-lg mt-auto"></div>
  </div>
);

// --- MAIN COMPONENT ---
const LevelPage = () => {
  const navigate = useNavigate();
  const { level: levelParam } = useParams<{ level: string }>();
  const levelNum = Number(levelParam) || 1;

  const [tests, setTests] = useState<ExerciseTest[]>([]);
  const [loading, setLoading] = useState(true);

  const config = getConfigByLevel(levelNum);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch from real API
    getAllReadingTests()
      .then((allTests: any[]) => {
        if (isMounted) {
          // API returns array of reading tests, filter by level
          const filteredTests = allTests.filter(
            (t) => Number(t.level) === levelNum
          );
          // Map to ExerciseTest type (id, title, time, level)
          const mapped = filteredTests
            .map((t) => ({
              id: t.id,
              title: t.title,
              time: t.time,
              level: t.level,
            }))
            .sort((a, b) => {
              // Nếu title dạng "Reading 1", "Reading 2", ... thì sort theo số
              const getNumber = (str: string) => {
                const match = str.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
              };
              return getNumber(a.title) - getNumber(b.title);
            });
          setTests(mapped);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch reading tests:", error);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [levelNum]);

  // --- Framer Motion Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 text-white font-inter">
        <main className="container mx-auto px-4 sm:px-6 py-20 md:py-24">
          {/* --- NEW Level Header --- */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`relative w-full max-w-5xl mx-auto mb-16 p-8 rounded-3xl bg-gray-800/50 border border-purple-500/20 backdrop-blur-lg shadow-2xl ${config.shadow} flex flex-col items-center text-center overflow-hidden`}
          >
            <div
              className={`absolute -inset-px bg-gradient-to-r ${config.gradient} rounded-3xl opacity-20 blur-2xl`}
            ></div>
            <motion.h1
              variants={itemVariants}
              className="absolute text-9xl font-black text-white/5 -bottom-4 -right-4"
              aria-hidden="true"
            >
              <FaLeaf />
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className={`p-5 mb-4 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg`}
            >
              {React.cloneElement(config.icon, {
                className: "text-white text-5xl",
              })}
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2"
            >
              Reading Level {levelNum}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-white/80 text-lg font-medium max-w-xl"
            >
              {config.desc}
            </motion.p>
          </motion.div>

          {/* --- Exercises List --- */}
          <AnimatePresence>
            {loading ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                animate="visible"
              >
                {tests.length > 0 ? (
                  tests.map((test) => (
                    <motion.div
                      key={test.id}
                      variants={itemVariants}
                      className="relative rounded-2xl overflow-hidden group cursor-pointer"
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        },
                      }}
                      onClick={() => {
                        // Extract reading number from title (e.g., "Reading 1" -> "1")
                        const readingMatch = test.title.match(/\d+/);
                        const readingNum = readingMatch ? readingMatch[0] : "1";
                        navigate(`/lessons/${levelNum}/reading${readingNum}`);
                      }}
                    >
                      {/* Static image for all exercises */}
                      <img
                        src={
                          import.meta.env.BASE_URL +
                          "src/assets/images/login_background.png"
                        }
                        alt="Exercise"
                        className="w-full h-32 object-cover rounded-xl mb-4 border border-purple-500/20 bg-gray-900"
                      />
                      <div className="relative p-6 bg-gray-800/80 backdrop-blur-xl h-full flex flex-col rounded-2xl border border-purple-500/20">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-xl mb-3 text-white line-clamp-2 h-14">
                            {test.title}
                          </h3>
                          <div className="flex items-center gap-2 text-purple-300/80 font-medium mb-6">
                            <FaClock />
                            <span>
                              {test.time ? `${test.time} phút` : "-- phút"}
                            </span>
                          </div>
                        </div>{" "}
                        <motion.button
                          // Các class Tailwind cho style CỐ ĐỊNH
                          className="
    group relative overflow-hidden // Quan trọng: `group` để kích hoạt hover cho con, `overflow-hidden` để chứa hiệu ứng shine
    mt-auto w-full px-6 py-3 
    flex items-center justify-center gap-2
    
    rounded-xl border border-transparent 
    bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-600
    
    text-white text-base font-semibold uppercase tracking-wider
    
    shadow-lg transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-50 cursor-pointer
  "
                          // Animation vật lý với Framer Motion
                          whileHover={{
                            scale: 1.05,
                            y: -3,
                            boxShadow:
                              "0px 10px 25px -5px rgba(139, 92, 246, 0.5)", // Hiệu ứng glow màu tím
                          }}
                          whileTap={{ scale: 0.98, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 20,
                          }}
                        >
                          {/* Đặt nội dung trong span với z-10 để nó nằm trên hiệu ứng shine */}
                          <span className="relative z-10">Làm bài</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FaRegSadTear className="text-6xl text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">
                      Chưa có bài tập
                    </h3>
                    <p className="text-purple-300/80 mt-2">
                      Không có bài tập nào cho level này. Vui lòng quay lại sau.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default LevelPage;
