import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const tests = [
  {
    id: 1,
    title: "IELTS Reading Test 1",
    attempts: "12K",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise1",
  },
  {
    id: 2,
    title: "IELTS Reading Test 2",
    attempts: "9K",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise2",
  },
  {
    id: 3,
    title: "IELTS Reading Test 3",
    attempts: "7K",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise3",
  },
  {
    id: 4,
    title: "IELTS Reading Test 4",
    attempts: "8K",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise4",
  },
  {
    id: 5,
    title: "IELTS Reading Test 5",
    attempts: "10K",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise5",
  },
  {
    id: 6,
    title: "IELTS Reading Test 6",
    attempts: "6K",
    image:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise6",
  },
  {
    id: 7,
    title: "IELTS Reading Test 7",
    attempts: "11K",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise7",
  },
  {
    id: 8,
    title: "IELTS Reading Test 8",
    attempts: "8K",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    path: "/lessons/level1/exercise8",
  },
];

const Level1: React.FC = () => {
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
        <h1 className="text-3xl font-extrabold mb-3">Reading Test Level 1</h1>
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

export default Level1;
