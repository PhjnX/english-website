// src/components/sections/TargetSection.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface TargetItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const targetsData: Omit<TargetItemProps, "index">[] = [
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Cá Nhân Hóa Lộ Trình",
    description:
      "Readify điều chỉnh chương trình học và bài tập dựa trên trình độ và mục tiêu riêng của mỗi học viên.",
  },
  {
    icon: AcademicCapIcon,
    title: "Tập Trung Chuyên Sâu",
    description:
      "Nội dung bám sát cấu trúc đề thi IELTS Reading, rèn luyện kỹ năng học thuật và tư duy phản biện.",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Tiếp Cận Linh Hoạt",
    description:
      "Học mọi lúc, mọi nơi với giao diện trực quan, tương thích hoàn hảo trên mọi thiết bị thông minh.",
  },
  {
    icon: SparklesIcon,
    title: "Theo Dõi Tiến Trình Rõ Ràng",
    description:
      "Theo dõi kết quả học tập qua các báo cáo chi tiết, thống kê tiến bộ và phản hồi tức thì từ hệ thống.",
  },
];

const AnimatedShape: React.FC<{
  className: string;
  delay?: number;
  duration?: number;
  xRange?: string[];
  yRange?: string[];
}> = ({
  className,
  delay = 0,
  duration = 20,
  xRange = ["0%", "5%", "-5%", "0%"],
  yRange = ["0%", "-8%", "8%", "0%"],
}) => {
  return (
    <motion.div
      className={`absolute rounded-full filter blur-2xl ${className}`}
      animate={{ x: xRange, y: yRange }}
      transition={{
        delay,
        duration: duration + Math.random() * 10 - 5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    />
  );
};

// Định nghĩa màu sắc
const cardDefaultBg = "rgba(255, 255, 255, 1)"; // White
const cardHoverBg = "rgba(107, 33, 168, 1)"; // Purple-800 (#6b21a8) - Tím đậm cho nền card khi hover
const textDefaultTitleColor = "rgba(88, 28, 135, 1)"; // Purple-900 (#581c87) - Tím đậm hơn cho tiêu đề
const textDefaultDescColor = "rgba(71, 85, 105, 1)"; // Slate-600 - Xám cho mô tả
const iconDefaultColorClass = "text-purple-600"; // Màu icon mặc định (Tím)
// Icon sẽ KHÔNG đổi màu sang trắng khi hover card nữa
const iconContainerDefaultBg =
  "bg-gradient-to-br from-purple-100 via-indigo-50 to-fuchsia-100";
const glowBorderHoverColor = "rgba(192, 132, 252, 0.7)"; // Purple-400 opacity 70% - Màu viền glow nhạt hơn

const TargetCard: React.FC<TargetItemProps> = ({
  icon: Icon,
  title,
  description,
  index,
}) => {
  const singleCardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1],
        delay: index * 0.15,
      },
    },
  };

  const contentEntranceDelay = index * 0.15;

  return (
    <motion.div
      className="relative group p-6 md:p-8 rounded-2xl shadow-xl 
                 transition-shadow duration-300 ease-out overflow-hidden 
                 border border-purple-200/60 cursor-default"
      style={{ backgroundColor: cardDefaultBg }}
      variants={singleCardVariants}
      whileHover={{
        y: -10,
        scale: 1.05,
        backgroundColor: cardHoverBg,
        // `color` prop ở đây sẽ áp dụng cho text con trực tiếp.
        // Nếu icon là SVG với `fill="currentColor"` hoặc `stroke="currentColor"`, nó cũng sẽ bị ảnh hưởng.
        // Vì yêu cầu icon giữ màu tím, chúng ta sẽ không set `color` ở đây nữa, mà quản lý màu text con bằng class.
        boxShadow: `0px 0px 35px 8px rgba(168, 85, 247, 0.3), 0px 0px 15px 0px rgba(192, 132, 252, 0.25)`, // Glow tím lan tỏa hơn
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      {/* Viền phát sáng khi hover */}
      <motion.div
        className="absolute -inset-px rounded-2xl border-2 group-hover:border-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          borderColor: glowBorderHoverColor,
          boxShadow:
            "0 0 24px 8px rgba(192,132,252,0.45), 0 0 8px 2px rgba(168,85,247,0.25)",
          filter: "blur(3px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className={`p-4 mb-5 ${iconContainerDefaultBg} rounded-full inline-flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 15,
              delay: contentEntranceDelay + 0.2,
            },
          }}
        >
          {/* Icon GIỮ NGUYÊN MÀU TÍM khi hover card */}
          <Icon
            className={`w-10 h-10 md:w-12 md:h-12 ${iconDefaultColorClass} transition-colors duration-300 ease-in-out`}
          />
        </motion.div>

        <motion.h3
          className={`text-xl md:text-2xl font-bold mb-2 font-be-vietnam-pro transition-colors duration-300 ease-in-out group-hover:!text-white`}
          style={{
            color: textDefaultTitleColor,
            fontFamily: "Be Vietnam Pro",
            fontWeight: 700,
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
              delay: contentEntranceDelay + 0.3,
            },
          }}
        >
          {title}
        </motion.h3>

        <motion.p
          className={`text-sm md:text-base font-inter leading-relaxed transition-colors duration-300 ease-in-out group-hover:!text-slate-100`}
          style={{ color: textDefaultDescColor }}
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
              delay: contentEntranceDelay + 0.4,
            },
          }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const TargetSection: React.FC = () => {
  return (
    <section
      id="target"
      className="py-16 md:py-24 bg-gradient-to-b from-white via-purple-50 to-indigo-100 relative overflow-hidden"
    >
      <AnimatedShape
        className="w-60 h-60 bg-purple-200/70 top-[5%] left-[5%]"
        duration={25}
      />
      <AnimatedShape
        className="w-48 h-48 bg-indigo-200/60 bottom-[10%] right-[8%]"
        delay={2}
        duration={30}
        xRange={["0%", "-6%", "6%", "0%"]}
      />
      <AnimatedShape
        className="hidden md:block w-40 h-40 bg-fuchsia-200/60 top-[30%] right-[15%]"
        delay={1}
        duration={22}
      />
      <AnimatedShape
        className="hidden lg:block w-32 h-32 border-4 border-purple-300/50 top-[60%] left-[10%]"
        delay={3}
        duration={28}
        yRange={["0%", "10%", "-10%", "0%"]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 font-be-vietnam-pro"
            style={{ fontFamily: "Be Vietnam Pro", fontWeight: 800 }}
          >
            Readify Đồng Hành
            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              <span> </span>Cùng Bạn
            </span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 font-inter max-w-2xl mx-auto">
            Với những mục tiêu cốt lõi được thiết kế chuyên biệt, Readify cam
            kết mang đến trải nghiệm học tập IELTS Reading hiệu quả và truyền
            cảm hứng nhất.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {targetsData.map((item, index) => (
            <TargetCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TargetSection;
