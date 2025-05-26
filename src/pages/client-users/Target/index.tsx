// src/components/TargetSection.tsx
import React from "react";
import { motion } from "framer-motion";
// Đảm bảo đường dẫn đến icons là chính xác
import Icon1 from "../../../assets/images/target-1.png";
import Icon2 from "../../../assets/images/target-2.png";
import Icon3 from "../../../assets/images/target-3.png";
import Icon4 from "../../../assets/images/target-4.png";

interface TargetItem {
  icon: string; // Kiểu dữ liệu của icon là string (đường dẫn)
  title: string;
  description: string;
}

const targets: TargetItem[] = [
  {
    icon: Icon1,
    title: "Cá nhân hóa",
    description:
      "Lộ trình đọc được điều chỉnh theo trình độ và mục tiêu học tập của từng học viên.",
  },
  {
    icon: Icon2,
    title: "Tập trung chuyên sâu", // Thay đổi title một chút cho rõ nghĩa hơn
    description:
      "Luyện kỹ năng đọc học thuật phù hợp với định dạng đề thi và yêu cầu của các kỳ thi quốc tế.",
  },
  {
    icon: Icon3,
    title: "Dễ dàng tiếp cận", // Thay đổi title
    description:
      "Giao diện trực quan, tương thích mọi thiết bị – học mọi lúc, mọi nơi một cách thuận tiện.",
  },
  {
    icon: Icon4,
    title: "Truyền cảm hứng học tập", // Thay đổi title
    description:
      "Gia tăng động lực thông qua hệ thống thử thách, điểm thưởng và các hoạt động tương tác thú vị.",
  },
];

const TargetSection: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "circOut", delay: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
    }),
  };

  return (
    <motion.section
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-amber-50 text-center relative overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="text-4xl sm:text-5xl font-extrabold mb-16 lg:mb-20 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-md font-be-vietnam-pro"
        // Sử dụng class `font-be-vietnam-pro` thay vì style inline nếu đã cấu hình trong Tailwind
        // Nếu chưa, bạn có thể dùng style: style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        variants={titleVariants}
      >
        Mục tiêu của VlearnReading
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto">
        {targets.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center px-6 py-10 bg-white rounded-2xl shadow-lg border border-orange-300/50 group cursor-pointer hover:border-orange-400/70"
            variants={cardVariants}
            custom={index}
            initial="hidden" // Sẽ được trigger bởi whileInView của parent nếu không set viewport ở đây
            whileInView="visible" // Hoặc để whileInView của parent xử lý
            viewport={{ once: true, amount: 0.3 }} // Viewport cho từng card để có hiệu ứng khi cuộn tới
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 35px rgba(239, 68, 68, 0.15)", // Màu đỏ cam #ef4444
            }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }} // Áp dụng cho hover
          >
            <motion.div
              className="w-24 h-24 flex items-center justify-center rounded-full mb-6 shadow-md bg-gradient-to-br from-orange-400 via-red-500 to-amber-400 group-hover:scale-110 transition-transform duration-300 ease-out"
              whileHover={{ rotate: [0, 8, -8, 0], scale: 1.12 }} // Hiệu ứng lắc nhẹ khi hover icon
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm" // Kích thước icon rõ ràng hơn
              />
            </motion.div>
            <h3 className="text-xl lg:text-2xl font-bold mb-3 font-be-vietnam-pro bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 font-inter leading-relaxed px-2">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TargetSection;
