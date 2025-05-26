// src/pages/Login/LeftSidePanel.tsx
import React from "react";
import { motion } from "framer-motion";
import { FaBookReader, FaLaptopCode, FaCertificate } from "react-icons/fa";

// Variants cho animation của panel và các phần tử con
const panelVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2, // Hiệu ứng xuất hiện lần lượt cho các list item
    },
  },
};

const LeftSidePanel: React.FC = () => {
  const accentColor = "text-amber-300"; // Màu nhấn thống nhất

  return (
    <motion.div
      className="hidden lg:flex flex-1 min-w-[320px] h-full bg-gradient-to-br from-orange-600 via-red-600 to-red-700 text-white 
                 flex-col justify-center items-start px-10 py-12 space-y-8 overflow-hidden"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold leading-tight font-be-vietnam-pro"
        variants={itemVariants} // Sử dụng itemVariants cho animation đồng bộ
        // transition được điều khiển bởi panelVariants nên không cần ở đây
      >
        Chào mừng đến với <span className={accentColor}>VLearnReading</span>
      </motion.h2>

      <motion.p
        className="text-base md:text-lg text-orange-100 font-inter"
        variants={itemVariants}
      >
        Nâng tầm kỹ năng đọc hiểu IELTS của bạn với lộ trình học cá nhân hóa,
        bài tập tương tác và cộng đồng học tập sôi nổi.
      </motion.p>

      <motion.ul
        className="space-y-5 text-base text-orange-50" // Tăng space-y
        variants={listVariants} // Áp dụng listVariants để staggerChildren
        // initial và animate sẽ được kế thừa từ panelVariants hoặc có thể set riêng
      >
        {[
          { icon: FaBookReader, text: "Lộ trình học tập cá nhân hóa tối ưu" },
          { icon: FaLaptopCode, text: "Trải nghiệm luyện đọc tương tác cao" },
          { icon: FaCertificate, text: "Theo dõi tiến độ và đạt chứng nhận" },
        ].map((item, index) => (
          <motion.li
            key={index}
            className="flex items-center space-x-4 group"
            variants={itemVariants} // Mỗi li cũng animate theo itemVariants
          >
            <item.icon
              className={`${accentColor} text-2xl group-hover:scale-110 transition-transform`}
            />
            <span className="group-hover:text-white transition-colors">
              {item.text}
            </span>
          </motion.li>
        ))}
      </motion.ul>
      <motion.div variants={itemVariants} className="pt-6">
        <span className="text-xs text-orange-200/80">
          © {new Date().getFullYear()} VLearnReading - Chinh phục IELTS cùng
          chuyên gia.
        </span>
      </motion.div>
    </motion.div>
  );
};

export default LeftSidePanel;
