// src/components/sections/TargetSection.tsx
import React from "react";
import { motion } from "framer-motion";

// Giả định bạn import các icon PNG như sau ở đầu file:
// Hãy đảm bảo đường dẫn là chính xác trong dự án của bạn.
import Icon1 from "../../../assets/images/target-1.png"; // Đường dẫn ví dụ, thay thế bằng đường dẫn thực tế
import Icon2 from "../../../assets/images/target-2.png"; // Đường dẫn ví dụ
import Icon3 from "../../../assets/images/target-3.png"; // Đường dẫn ví dụ
import Icon4 from "../../../assets/images/target-4.png"; // Đường dẫn ví dụ

interface TargetItemProps {
  iconSrc: string; // Đường dẫn đến file icon (đã import)
  title: string;
  description: string;
  delay: number;
}

// Sử dụng trực tiếp các icon đã import
const targetsData: Omit<TargetItemProps, "delay">[] = [
  {
    iconSrc: Icon1,
    title: "Lộ Trình Cá Nhân Hóa",
    description:
      "Hệ thống điều chỉnh lộ trình học và bài tập theo đúng trình độ và mục tiêu của bạn.",
  },
  {
    iconSrc: Icon2,
    title: "Tập Trung Kỹ Năng Cốt Lõi",
    description:
      "Rèn luyện chuyên sâu các kỹ năng đọc hiểu học thuật thiết yếu cho bài thi IELTS Reading.",
  },
  {
    iconSrc: Icon3,
    title: "Tiếp Cận Mọi Lúc Mọi Nơi",
    description:
      "Giao diện hiện đại, thân thiện, học tập linh hoạt trên mọi thiết bị: máy tính, điện thoại, tablet.",
  },
  {
    iconSrc: Icon4,
    title: "Truyền Cảm Hứng Vượt Trội",
    description:
      "Gia tăng động lực với hệ thống điểm thưởng, xếp hạng và các thử thách học tập tương tác.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      duration: 0.6,
      ease: [0.6, 0.05, 0.2, 0.95], // Giá trị cubic-bezier đã sửa
    },
  }),
};

const TargetItemCard: React.FC<TargetItemProps> = ({
  iconSrc,
  title,
  description,
  delay,
}) => {
  return (
    <motion.div
      className="group relative flex flex-col items-center p-6 md:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-400 ease-out overflow-hidden cursor-default"
      variants={cardVariants}
      custom={delay}
      // initial, whileInView sẽ được parent (grid) xử lý hoặc card tự xử lý nếu viewport được set ở đây
    >
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-500/70 transition-colors duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      <motion.div
        className="absolute -top-1 -left-1 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-[8] transition-all duration-500 ease-out blur-2xl"
        aria-hidden="true"
      />

      <motion.div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full mb-6 bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
        <img
          src={iconSrc}
          alt={title}
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        />
      </motion.div>
      <motion.h3 className="relative z-10 text-xl sm:text-2xl font-bold mb-3 text-gray-800 font-be-vietnam-pro group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:via-orange-500 group-hover:to-amber-500 transition-colors duration-300">
        {title}
      </motion.h3>
      <motion.p className="relative z-10 text-sm sm:text-base text-gray-600 font-inter leading-relaxed text-center">
        {description}
      </motion.p>
    </motion.div>
  );
};

const TargetSection: React.FC = () => {
  return (
    <motion.section
      className="py-16 md:py-24 bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 text-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-800 font-be-vietnam-pro"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          VlearnReading{" "}
          <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Mang Đến
          </span>{" "}
          Điều Gì?
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 font-inter mb-12 md:mb-16 lg:mb-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          Chúng tôi không chỉ giúp bạn luyện thi. Chúng tôi đồng hành cùng bạn
          trên hành trình chinh phục IELTS Reading với những giá trị cốt lõi,
          được thiết kế để tối ưu hóa hiệu quả học tập và truyền cảm hứng mỗi
          ngày.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          // Không cần variants ở đây nếu các card tự quản lý animation dựa trên props
        >
          {targetsData.map((item, index) => (
            <TargetItemCard
              key={item.title}
              iconSrc={item.iconSrc} // Truyền iconSrc
              title={item.title}
              description={item.description}
              delay={index * 0.15}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TargetSection;
