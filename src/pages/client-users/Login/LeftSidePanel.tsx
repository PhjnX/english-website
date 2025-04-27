import React from "react";
import { motion } from "framer-motion";
import { FaBookReader, FaLaptopCode, FaCertificate } from "react-icons/fa";

const LeftSidePanel: React.FC = () => {
  return (
    <motion.div
      className="flex-1 min-w-[280px] h-full bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col justify-center items-start px-8 py-10 space-y-6 overflow-hidden"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold leading-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Chào mừng đến với <span className="text-red-500">VLearnReading</span>
      </motion.h2>

      <motion.p
        className="text-base md:text-lg text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Phát triển kỹ năng đọc và học tập của bạn với hướng dẫn tương tác, khóa
        học chuyên gia và cộng đồng sôi động.
      </motion.p>

      <motion.ul
        className="space-y-4 text-sm md:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <li className="flex items-center space-x-3">
          <FaBookReader className="text-red-400 text-lg" />
          <span>Các lộ trình học cá nhân hóa</span>
        </li>
        <li className="flex items-center space-x-3">
          <FaLaptopCode className="text-yellow-400 text-lg" />
          <span>Trải nghiệm đọc tương tác</span>
        </li>
        <li className="flex items-center space-x-3">
          <FaCertificate className="text-green-400 text-lg" />
          <span>Nhận chứng chỉ và theo dõi tiến trình</span>
        </li>
      </motion.ul>
    </motion.div>
  );
};

export default LeftSidePanel;
