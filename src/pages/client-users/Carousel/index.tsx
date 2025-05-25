import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const HeroCarousel: React.FC = () => {
  return (
    <motion.div
      className="bg-gray-50 py-16 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-semibold mb-4"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
        >
          <span className="inline-flex items-center justify-center bg-white  text-red-600 font-bold px-3 py-1 rounded-md mr-2 shadow-lg">
            <motion.div
              className="w-10 h-10 bg-red-600 flex items-center justify-center rounded mr-2 shadow-lg"
              initial={{ scale: 0.7, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-white text-xl font-sans"
              />
            </motion.div>
            Nâng Cao
            <span className="text-black ml-2 font-sans">
              Kỹ Năng Reading Của Bạn
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl text-gray-700 mb-1 font-bold font-sans"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Biến Việc Học Tiếng Anh Thành Đam Mê Đích Thực
        </motion.p>
        <motion.p
          className="text-sm text-gray-500 mb-6 font-sans"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Mở Cánh Cửa Tri Thức, Làm Chủ Kỹ Năng Reading Đỉnh Cao
        </motion.p>

        <div className="flex justify-center mt-10 font-sans">
          <motion.button
            className="bg-red-500 !text-white px-4 py-3.5 rounded-full font-semibold hover:bg-red-700 transition duration-300 text-sm cursor-pointer shadow-lg"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 8px 32px rgba(255,0,0,0.15)",
            }}
            whileTap={{ scale: 0.96 }}
          >
            Khởi Động
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroCarousel;
