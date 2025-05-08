import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ReadingCard {
  id: number;
  level: number;
  title: string;
  description: string;
  color: string;
  path: string;
}

const readingLevels: ReadingCard[] = [
  {
    id: 1,
    level: 1,
    title: "Reading Level 1",
    description: "Bài tập đọc hiểu cơ bản, phù hợp cho người mới bắt đầu.",
    color: "bg-blue-400",
    path: "/reading-practice/1",
  },
  {
    id: 2,
    level: 2,
    title: "Reading Level 2",
    description: "Nâng cao kỹ năng đọc hiểu với các đoạn văn ngắn.",
    color: "bg-green-400",
    path: "/reading-practice/2",
  },
  {
    id: 3,
    level: 3,
    title: "Reading Level 3",
    description: "Luyện tập đọc hiểu với các chủ đề đa dạng hơn.",
    color: "bg-yellow-400",
    path: "/reading-practice/3",
  },
  {
    id: 4,
    level: 4,
    title: "Reading Level 4",
    description: "Đọc hiểu các đoạn văn dài và phức tạp hơn.",
    color: "bg-orange-400",
    path: "/reading-practice/4",
  },
  {
    id: 5,
    level: 5,
    title: "Reading Level 5",
    description: "Thử thách với các bài đọc học thuật và chuyên sâu.",
    color: "bg-purple-400",
    path: "/reading-practice/5",
  },
  {
    id: 6,
    level: 6,
    title: "Reading Level 6",
    description: "Ôn luyện nâng cao, chuẩn bị cho các kỳ thi quốc tế.",
    color: "bg-red-400",
    path: "/reading-practice/6",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Ôn luyện Reading</h1>
          <p className="text-gray-600 mt-2">
            Chọn level phù hợp để luyện tập kỹ năng đọc hiểu tiếng Anh của bạn!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {readingLevels.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHovered(card.id)}
              onHoverEnd={() => setHovered(null)}
              className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${card.color} bg-opacity-20`}
              onClick={() => navigate(card.path)}
            >
              <div className="flex flex-col items-center justify-center p-8 bg-white bg-opacity-90 h-full min-h-[220px]">
                <div
                  className={`rounded-full p-4 mb-4 text-white text-3xl ${card.color} shadow-lg`}
                >
                  <FaBookOpen />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600 mb-4 text-center">
                  {card.description}
                </p>
                <motion.button
                  className="px-5 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-800 transition"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Bắt đầu
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-center">
              Luyện tập thường xuyên để nâng cao kỹ năng đọc hiểu của bạn!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LessonsPage;
