import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export interface ExerciseTest {
  id: number;
  title: string;
  attempts: string;
  image: string;
  path: string;
}

interface ExerciseListProps {
  title: string;
  tests: ExerciseTest[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ title, tests }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-4">
      {/* Banner sinh động */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-6 flex items-center gap-4 shadow-lg"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-30 mr-4">
          <FaStar className="text-white text-3xl animate-bounce" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow mb-1">
            Chinh phục Reading IELTS
          </h2>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Luyện tập các đề thi thật, nâng cao kỹ năng đọc hiểu và bứt phá band
            điểm!
          </p>
        </div>
      </motion.div>
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-3">{title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 group cursor-pointer p-4"
              onClick={() => navigate(test.path)}
            >
              <div className="relative">
                <img
                  src={test.image}
                  alt={test.title}
                  className="w-full h-40 object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-xl"
                />
              </div>
              <div className="flex flex-col flex-1 mt-3">
                <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-2">
                  {test.title}
                </h3>
                <div className="text-gray-500 text-sm mb-3">
                  {test.attempts} lượt làm
                </div>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold shadow transition-colors duration-600 hover:from-blue-500 hover:to-pink-500 cursor-pointer"
                >
                  <FaPlayCircle className="text-lg" />
                  Làm bài
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
