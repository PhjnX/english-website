// src/components/sections/HowItWorksSection.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  UserPlusIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

interface StepItem {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const stepsData: StepItem[] = [
  {
    icon: UserPlusIcon,
    title: "Đăng Ký Tài Khoản",
    description:
      "Tạo tài khoản Readify miễn phí chỉ trong vài giây để mở khóa toàn bộ tài nguyên học tập.",
    link: "/login",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Kiểm Tra Trình Độ",
    description:
      "Hoàn thành bài kiểm tra đầu vào để hệ thống phân tích và đề xuất lộ trình phù hợp nhất với bạn.",
    link: "/assessment",
  },
  {
    icon: AcademicCapIcon,
    title: "Học Theo Lộ Trình",
    description:
      "Theo sát kế hoạch học tập được cá nhân hóa, bao gồm bài giảng, từ vựng và các dạng bài tập trọng tâm.",
    link: "/dashboard",
  },
  {
    icon: PencilSquareIcon,
    title: "Luyện Tập Chuyên Sâu",
    description:
      "Thực hành không giới hạn với kho đề thi thử và bài tập đa dạng, bám sát cấu trúc thi thật.",
    link: "/lessons",
  },
  {
    icon: CheckBadgeIcon,
    title: "Chinh Phục Mục Tiêu",
    description:
      "Theo dõi tiến độ, nhận phản hồi chi tiết và tự tin đạt được điểm số IELTS Reading bạn mơ ước.",
    link: "/mock-test",
  },
];

const FloatingShape: React.FC<{
  className: string;
  initial?: object;
  animate?: object;
  transition?: object;
  sizeClass: string;
}> = ({ className, initial, animate, transition, sizeClass }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${(Math.random() - 0.5) * 100}%`]
  );

  return (
    <motion.div
      className={`absolute rounded-full filter blur-3xl opacity-20 md:opacity-30 ${sizeClass} ${className}`}
      initial={{ ...initial, opacity: 0, scale: 0.5 }}
      animate={{
        ...animate,
        opacity: 1,
        scale: 1,
        transition: { duration: 1.5, ...transition },
      }}
      style={{ y }}
    />
  );
};

const StepCard: React.FC<StepItem & { index: number; totalSteps: number }> = ({
  icon: Icon,
  title,
  description,
  index,
  totalSteps,
  link,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  const handleCardClick = () => {
    window.location.href = link;
  };

  return (
    <motion.div
      ref={cardRef}
      className="flex items-start space-x-4 md:space-x-6 group"
      style={{ scale, opacity, y }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-fuchsia-500 text-white font-bold text-xl md:text-2xl rounded-full shadow-lg 
                       group-hover:scale-110 group-hover:shadow-purple-500/40 transition-all duration-300"
          whileHover={{ boxShadow: "0 0 20px rgba(192, 132, 252, 0.7)" }}
        >
          {index + 1}
        </motion.div>
        {index < totalSteps - 1 && (
          <motion.div
            className="mt-3 w-1 flex-grow bg-gradient-to-b from-purple-300/70 via-indigo-300/50 to-transparent"
            style={{ minHeight: "80px" }}
            initial={{ height: 0 }}
            animate={
              scrollYProgress && scrollYProgress.get() > 0.2
                ? { height: "100%" }
                : { height: 0 }
            }
            transition={{ duration: 0.5, ease: "circOut", delay: 0.2 }}
          />
        )}
      </div>{" "}
      <motion.div
        className="flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-purple-200/50 
                   group-hover:shadow-2xl group-hover:border-purple-300 transition-all duration-300 cursor-pointer"
        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.95)" }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onClick={handleCardClick}
      >
        <div className="flex items-center mb-3">
          <Icon className="w-7 h-7 md:w-8 md:h-8 text-purple-600 mr-3 group-hover:text-indigo-600 transition-colors" />
          {/* SỬA FONT TRỰC TIẾP CHO TIÊU ĐỀ CARD */}
          <h3
            className="text-lg md:text-xl font-bold text-purple-800"
            style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }} // Áp dụng font trực tiếp
          >
            {title}
          </h3>
        </div>
        {/* SỬA FONT TRỰC TIẾP CHO MÔ TẢ CARD */}{" "}
        <p
          className="text-sm md:text-base text-slate-600 leading-relaxed mb-4"
          style={{ fontFamily: '"Inter", sans-serif' }} // Áp dụng font trực tiếp
        >
          {description}
        </p>
        <motion.button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = link;
          }}
        >
          Bắt đầu
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const titleWordVariants = {
    hidden: { opacity: 0, y: -20, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  // Định nghĩa font family cho các phần tử text cần sửa
  const beVietnamProFont = { fontFamily: '"Be Vietnam Pro", sans-serif' };
  const interFont = { fontFamily: '"Inter", sans-serif' };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden"
    >
      <FloatingShape
        className="bg-purple-300/80 -top-1/4 -left-1/4 animate-pulse-slower"
        sizeClass="w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
        transition={{ duration: 40, repeat: Infinity, repeatType: "mirror" }}
      />
      <FloatingShape
        className="bg-indigo-300/70 -bottom-1/3 -right-1/4 animate-pulse-slow"
        sizeClass="w-[350px] h-[350px] md:w-[550px] md:h-[550px]"
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 2,
        }}
      />
      <FloatingShape
        className="hidden lg:block bg-fuchsia-300/60 top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2"
        sizeClass="w-[300px] h-[300px] md:w-[450px] md:h-[450px]"
        transition={{
          duration: 45,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1,
        }}
      />
      <FloatingShape
        className="hidden md:block bg-purple-200/50 bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2"
        sizeClass="w-[250px] h-[250px] md:w-[400px] md:h-[400px]"
        transition={{
          duration: 55,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 3,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16 md:mb-20 lg:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleContainerVariants}
        >
          <div className="inline-block">
            {"5 Bước Đơn Giản Để".split(" ").map((word, index) => (
              <motion.span
                key={index}
                variants={titleWordVariants}
                className="inline-block mr-2 md:mr-3 text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800"
                style={beVietnamProFont}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <br />
          <div className="inline-block mt-1 md:mt-2">
            {"Chinh Phục IELTS Reading".split(" ").map((word, index) => (
              <motion.span
                key={index}
                variants={titleWordVariants}
                className={`inline-block mr-2 md:mr-3 text-4xl md:text-5xl lg:text-6xl font-extrabold \
        ${
          ["IELTS", "Reading"].includes(word)
            ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent"
            : "text-slate-800"
        }`}
                style={beVietnamProFont}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="!mt-5 text-lg md:text-xl text-slate-600 max-w-xl mx-auto"
            style={interFont}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            Tại Readify, chúng tôi đơn giản hóa lộ trình học của bạn qua các
            bước hiệu quả, dễ dàng theo dõi và thực hiện.
          </motion.p>
        </motion.div>

        <div className="max-w-2xl lg:max-w-3xl mx-auto space-y-8 md:space-y-10">
          {stepsData.map((step, index) => (
            <StepCard
              key={step.title}
              {...step}
              index={index}
              totalSteps={stepsData.length}
            />
          ))}
        </div>
      </div>
      <style>{`
        // Bỏ comment style này nếu bạn dùng animate-pulse-... từ Tailwind, nếu không thì không cần
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(8deg);
          }
        }
        // .animate-pulse-slow { animation: pulse-slow 20s infinite alternate; } // Nếu không dùng class này thì có thể xóa

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.15) rotate(-8deg);
          }
        }
        // .animate-pulse-slower { animation: pulse-slower 25s infinite alternate; animation-delay: 2.5s;} // Nếu không dùng class này thì có thể xóa
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
