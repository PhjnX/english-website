// src/components/sections/KeyFeaturesSection.tsx
import React from "react";
import { motion } from "framer-motion";
// Ví dụ sử dụng Heroicons (cài đặt: npm install @heroicons/react)
import {
  AcademicCapIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
  BookOpenIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const featuresData: Omit<FeatureItemProps, "index">[] = [
  {
    icon: DocumentTextIcon,
    title: "Kho Đề Thi Chuẩn Formats",
    description:
      "Luyện tập với hàng ngàn câu hỏi và bộ đề mô phỏng cấu trúc thi IELTS Reading thực tế, cập nhật liên tục.",
  },
  {
    icon: AcademicCapIcon,
    title: "Lộ Trình Học Thông Minh",
    description:
      "Hệ thống tự động gợi ý lộ trình và bài học phù hợp dựa trên năng lực và mục tiêu điểm số của bạn.",
  },
  {
    icon: LightBulbIcon,
    title: "Giải Thích Đáp Án Tận Tình",
    description:
      "Hiểu sâu từng câu hỏi với phần giải thích chi tiết, phân tích lỗi sai và mẹo làm bài hiệu quả.",
  },
  {
    icon: SparklesIcon,
    title: "Kỹ Năng Đọc Chuyên Sâu",
    description:
      "Bài tập đa dạng rèn luyện từng kỹ năng: Skimming, Scanning, Main Ideas, Inference, và hơn thế nữa.",
  },
  {
    icon: ChartBarIcon,
    title: "Theo Dõi Tiến Độ Trực Quan",
    description:
      "Biểu đồ và báo cáo chi tiết giúp bạn nắm bắt điểm mạnh, yếu và sự tiến bộ qua từng giai đoạn học.",
  },
  {
    icon: BookOpenIcon,
    title: "Từ Vựng IELTS Trọng Tâm",
    description:
      "Học và ôn luyện từ vựng học thuật theo chủ đề thường gặp, tích hợp flashcards và game tương tác.",
  },
];

const featureCardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
    rotateX: -20, // Hiệu ứng nghiêng nhẹ
  },
  onscreen: (index: number) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: index * 0.1,
    },
  }),
};

const FeatureCard: React.FC<FeatureItemProps> = ({
  icon: Icon,
  title,
  description,
  index,
}) => {
  return (
    <motion.div
      className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-out overflow-hidden group"
      variants={featureCardVariants}
      custom={index}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <div className="p-3 mb-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg inline-block group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-800 font-be-vietnam-pro">
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-inter leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const KeyFeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-4 text-gray-800 font-be-vietnam-pro">
            Tại Sao Chọn{" "}
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              VlearnReading
            </span>
            ?
          </h2>
          <p className="text-base sm:text-lg text-center text-gray-600 font-inter max-w-2xl mx-auto mb-12 md:mb-16 lg:mb-20">
            Khám phá những tính năng ưu việt được thiết kế độc quyền, giúp bạn
            tự tin chinh phục mọi thử thách trong bài thi IELTS Reading và đạt
            được mục tiêu điểm số mong muốn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
